---
date: 2026-09-12
tags:
  - Network
  - Spring
  - SSE
  - Web
aliases:
  - Spring 환경에서 SSE 구현하기
---
Spring Framework에서는 SSE 기능을 편리하게 사용할 수 있도록 `SseEmitter`라는 구현체를 지원한다.  

![[IMG-20260912020029584.png|453]]

##  회원 중복 연결 제어

기존에는 `EmitterRepository`를 아래와 같이 단순히 member.id 기준으로 다뤘다.  

```java
private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
```

이렇게 할 경우 다음과 같은 문제가 발생한다.  

```
회원 1 - 탭 A 연결
회원 1 - 탭 B 연결 → 탭 A가 덮어써짐
탭 A 종료 콜백 실행 → 회원 1의 탭 B emitter까지 삭제
```

그렇기에 `SseEmitter`와 각각의 고유 ID를 매핑하여 아래와 같이 구조로 emitter들을 관리한다.  

```java
private final ConcurrentMap<Long, ConcurrentMap<String, SseEmitter>> emitters = new ConcurrentHashMap<>();

public record EmitterConnection(  
        String emitterId,  
        SseEmitter emitter  
) {  
}
```

## 단일 클라이언트 전송 추가 및 SUBSCRIBE 중복 제거

SUBSCRIBE 이벤트는 모든 client에게 보낼 필요 없기에 memberId + emitterId 조합의 알림 전송이 필요함.

## 에러 제어

emitter를 생성 후 콜백 함수를 등록한다. 보통 emitter 객체를 삭제하는 방식이다.  

```java
// 사용자 ID를 기반으로 Emitter 생성  
private EmitterConnection createEmitter(Long memberId) {  
    SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);  
    String emitterId = createEmitterId();  
    emitterRepository.save(memberId, emitterId, emitter);  
  
    // 콜백 등록  
    Runnable cleanup = () -> emitterRepository.delete(memberId, emitterId, emitter);  
  
    // SSE 연결이 정상적으로 종료되었을 때 실행  
    emitter.onCompletion(cleanup);  
    // DEFAULT_TIMEOUT을 초과해서 연결이 타임아웃 되었을 때  
    emitter.onTimeout(cleanup);  
    // SSE 연결 중 에러가 발생했을 때  
    emitter.onError(error -> cleanup.run());  
  
    return new EmitterConnection(emitterId, emitter);  
}
```

`IllegalArgumentException`를 에러 포함시킨 이유는 다음과 같다.  

등록된 `HttpMessageConverter`들을 돌면서 `data`를 쓸 수 있는 converter를 찾습니다. 아무 converter도 처리할 수 없다면 Spring이 직접 다음과 같이 `IllegalArgumentException`을 던진다.  

```java
private void sendLogic(EmitterConnection connection, Long memberId, SseEventType eventType, Object data) {
	String emitterId = connection.emitterId();
	SseEmitter emitter = connection.emitter();
	try {
		emitter.send(
				SseEmitter.event()
						.id(String.valueOf(memberId))
						.name(eventType.name())
						.data(data)
		);
	} catch (IOException | IllegalArgumentException e) {
		emitterRepository.delete(memberId, emitterId, emitter);
		emitter.completeWithError(e);
	}
}

```

## 이벤트 기반으로 트랜잭션 분리

트랜잭션 내에 SSE 전송을 포함시키면 다음과 같은 문제점이 발생한다.  

1. DB 트랜잭션의 생명주기에 네트워크 I/O가 포함된다.  
2. 예외가 강하게 결합된다.
3. 트랜잭션은 취소되지만 SSE 메세지는 전송될 수 있다.

또한 [[OSIV]]가 켜져있을 시 SSE 서비스단에 트랜잭션이 걸려있다면 SSE연결 동안 트랜잭션을 계속 물고 있어 커넥션 낭비가 일어날 수 있으니 트랜잭션을 걸지 않는 것을 권장한다.  

이벤트 객체 정의하고 EventListener Bean 등록한다.  
이벤트 리스너 정의 및 `@TransactionalEventListener` 어노테이션 추가한다.  
발생 시점은 COMMIT 이후로 한다. 

```java
@Component  
@RequiredArgsConstructor  
public class AlarmEventListener {  
  
    private final AlarmChannelService alarmChannelService;  
  
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)  
    public void notifyAlarm(AlarmCreateEvent event) {  
        alarmChannelService.notify(event.receiverId(), event.alarm());  
    }  
}
```

그리고 `ApplicationEventPublisher`를 통해 이벤트를 발행한다.  

```java
private final ApplicationEventPublisher applicationEventPublisher;

@Transactional  
public Alarm create(Long receiverId, AlarmType type, String title, String content, String targetUrl) {  
    Member receiver = memberService.getMember(receiverId);  
    Alarm alarm = Alarm.create(receiver, type, title, content, normalizeTargetUrl(targetUrl));  
    applicationEventPublisher.publishEvent(new AlarmCreateEvent(receiverId, alarm));  
    return alarmRepository.save(alarm);  
}
```

## 하트비트

SSE는 일반 HTTP 응답과 달리 응답을 끝내지 않고 연결을 유지한다.  
이때 클라이언트가 연결을 끊어도 Servlet 서버가 바로 알 수 없다.  

그렇기에 아래 [Spring 공식 문서](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html?utm_source=chatgpt.com#mvc-ann-async-disconnects)에서도 연결이 끊어질때 쓰기 작업이 실패하므로 **주기적으로 데이터를 전송하는** 방식을 권장한다. 그리고 해당 방식을 heartbeat라고 부른다.  

> [!quote]
> The Servlet API does not provide any notification when a remote client goes away. Therefore, while streaming to the response, whether through [SseEmitter](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html?utm_source=chatgpt.com#mvc-ann-async-sse) or [reactive types](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html?utm_source=chatgpt.com#mvc-ann-async-reactive-types), it is important to send data periodically, since the write fails if the client has disconnected. The send could take the form of an empty (comment-only) SSE event or any other data that the other side would have to interpret as a heartbeat and ignore.
> 
> Alternatively, consider using web messaging solutions (such as [STOMP over WebSocket](https://docs.spring.io/spring-framework/reference/web/websocket/stomp.html) or WebSocket with [SockJS](https://docs.spring.io/spring-framework/reference/web/websocket/fallback.html)) that have a built-in heartbeat mechanism.

SSE 연결은 장시간 데이터가 흐르지 않으면 프록시, 로드밸런서 등의 idle timeout에 의해 연결이 종료될 수 있다.  
따라서 실무에서는 연결을 유지하고 끊어진 연결을 감지하기 위해 주기적으로 heartbeat를 전송할 수 있다.

`SseEmitter`에서는 `comment()`를 이용해 SSE의 comment 형식으로 heartbeat를 전송할 수 있다.  
또한 heartbeat 요청을 지속적으로 보내야 하기에 아래와 같이 스케줄러를 활용할 수 있다.  

```java
@Scheduled(fixedRateString = "PT15S")  
public void sendHeartbeat() {  
    emitterRepository.findAll().forEach(connection ->  
            send(connection, SseEmitter.event().comment("heartbeat"))  
    );  
}
```

`EventSource`를 사용하는 클라이언트에서는 `:`로 시작하는 SSE comment를 브라우저의 SSE 파서가 무시하므로,  
**별도의 heartbeat 처리 로직이 필요하지 않다.**

## Last Event ID



## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-framework/reference/6.2/web/webmvc/mvc-ann-async.html?utm_source=chatgpt.com#mvc-ann-async-http-streaming
title: "Asynchronous Requests :: Spring Framework"
host: docs.spring.io
favicon: ../../../_/img/favicon.ico
```

```cardlink
url: https://dkswnkk.tistory.com/702
title: "SSE로 알림 기능 구현하기 with Spring"
description: "서론 인터넷은 웹 브라우저와 웹 서버 간의 데이터 통신을 위해서 HTTP 표준 위에 구축되어 있습니다. 대부분의 경우 웹 브라우저인 클라이언트가 HTTP 요청을 서버에 보내고, 서버는 적절한 응답을 반환하는데 이런 왕복 통신은 'https://www.google.com'과 같은 주소를 브라우저에 입력했을 때 웹 페이지를 받게 되는 과정입니다. 이러한 HTTP 표준은 광범위하게 지원되지만, 애플리케이션이 연속적인 정보를 서버에 전송하거나, 실시간으로 업데이트된 서버의 정보를 클라이언트에게 보내야 하는 경우 지속적인 HTTP 요청을 하게 되기에 비용면에서 매우 비 효율적입니다. 이런 상황에서 폴링, 웹소켓, 그리고 SSE가 등장했는데, 이들은 데이터 스트림의 속도와 메모리 효율성에 중점을 둔 프로토콜 들입니.."
host: dkswnkk.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbxvxSz%2Fbtskrc7eMOZ%2FAAAAAAAAAAAAAAAAAAAAACYbtIa-q1juWzHTjymnooIzsGHhFC1ChQXauE-eryRl%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D6kArJQTvm5Q%252BJ0u8jUQ%252FkNkrGiA%253D
```

```cardlink
url: https://infinitecode.tistory.com/132
title: "SSE(Server-Sent Events) 도입 및 실시간 통신 구현"
description: "안녕하세요.최근 진행하고 있는 사이드 프로젝트에서 클라이언트측의 기획 요구사항으로 실시간 알림 기능이 개발이 되어야 한다고 요청을 받았습니다.백엔드 진영에서는 해당 요구사항을 위한 기술로 SSE, FCM, Web-Socket 3가지 기술이 언급이 되었고,이 중에서 SSE를 선택하게 되었고 개발을 진행하면서 해당 기술에 대한 학습도 병행하여 정리해보려 합니다.우리 팀은 왜 SSE를 선택하였는지.기술 선택에 앞서 고민했던 포인트는 다양하게 있었습니다. 그 중에서 SSE를 선택하게 된 주요 이유로는 아래와 같아요.첫번째로 MVP 성향의 프로젝트로 단기간 개발이 필요했습니다.전체 프로젝트 기간이 한달도 채 안남은 시점에서 받은 요구사항이였고, 1차 MVP 적용을 코앞에 앞두고 있는 시점에서 제일 빠르게 적용할 .."
host: infinitecode.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcaMVnx%2FdJMcabCMCsL%2FAAAAAAAAAAAAAAAAAAAAAItisQmc24B1tFb8bphy7OCtOi0V2V083O1-rWpNkTsG%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DSSn5BnKPJd10zWsQdaN1QOo%252Bnok%253D
```

```cardlink
url: https://wildeveloperetrain.tistory.com/246
title: "Spring Event, @TransactionalEventListener 사용하기"
description: "@TransactionalEventListener 사용하기 및 propagation.REQUIRES_NEW spring framework 4.2부터 스프링 이벤트의 사용이 간편해졌는데요. 지난 포스팅에서 spring event를 사용하는 이유와 @EventListener를 통한 기본적인 이벤트 처리 방법에 대해서 살펴본 것에 이어, 이번 포스팅에서는 더 향상된 기능인 @TransactionalEventListener에 대해서 살펴볼 예정입니다. 2022.12.23 - [Programming/Spring Boot] - spring 이벤트 사용하기(event publisher, event listener) (이전 포스팅 내용으로 spring event에 대한 기본적인 처리 방법이 궁금하시다면 참고하시면 좋을.."
host: wildeveloperetrain.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F7lSiS%2Fbtr34cp3LRO%2FAAAAAAAAAAAAAAAAAAAAAKXO6_yQnpm8jy8knVz4nXzSlqD5F7x3DkoUjrcEljie%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DsIVx9ZWUP4IFHpKKVW6X8IDcni0%253D
```

```cardlink
url: https://codingmasterlsw.tistory.com/70
title: "Spring SSE의 내부 동작 탐색(AsyncRequestNotUsableException)"
description: "SSE 연결 중, Client가 연결을 종료했을 때 AsyncRequestNotUsableException이 발생했습니다. 왜 이런 에러 로그가 찍히는 거고, 비동기 처리를 한 적이 없는데 왜 에러에 Async가 붙은 건지 궁금해 글을 작성하게 되었습니다. 이를 이해하기 위해서는 우선 Spring에서의 SSE 연결 흐름에 대해 알아야 합니다.SSE 요청 흐름SSE의 초기 요청 흐름입니다. 여기서 중요한 점은, 연결을 유지하는 동안 스레드를 계속 점유하고 있지 않는다는 점입니다. 하나의 스레드가 하나의 연결을 담당하는 대신에, NIO Selector에게 연결 정보를 넘겨준 후 스레드 풀에 반환이 됩니다. NIO Selector 내부에서는 하나의 스레드로 여러 개의 연결을 관리할 수 있는데요, 상당히 흥미로.."
host: codingmasterlsw.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FqkpJV%2FdJMcagqtvVV%2FAAAAAAAAAAAAAAAAAAAAALDsvmyV2ilZiyIYa2U10OhX4j1AGNYRyHy8X8MaXE9E%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DwLtoJW3hKNhTiUyMnDebh%252BqH%252Bm4%253D
```





