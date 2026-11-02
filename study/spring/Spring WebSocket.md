---
date: 2026-10-31
aliases:
  - 스프링 웹소켓
---
Spring에서는 [[WebSocket]]을 아래와 같이 관리

## Raw WebSocket

메시지 라우팅, 세션 관리, 메시지 형식 등을 개발자가 직접 처리

### 예제 코드

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler chatWebSocketHandler;

    public WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler) {
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler, "/ws/chat")
                .setAllowedOrigins("*");
    }
}
```

실제 WebSocket 메세지를 처리하는 Handler를 직접 구현

```java
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket 연결: " + session.getId());
    }

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message
    ) throws Exception {

        System.out.println("수신 메시지: " + message.getPayload());

        session.sendMessage(
                new TextMessage("서버 응답: " + message.getPayload())
        );
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status
    ) {
        System.out.println("WebSocket 연결 종료: " + session.getId());
    }
}
```

## Spring Messaging

- 하위 프로토콜 혹은 컨벤션을 정의할 필요가 없음
- 연결 주소마다 새로 핸들러를 구현하고 설정해줄 필요가 없음
- 외부 [[Message Queue|Messaging Queue]]를 사용 가능
- Spring Security를 사용 가능

Spring이 [[STOMP]]를 사용하는 흐름은 다음과 같다.  

![[IMG-20261031025450474.png]]

### 예제 코드

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// WebSocket 연결을 맺는 Endpoint
		registry.addEndpoint("/ws"); 
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// 클라이언트가 서버의 @MessageMapping으로 메시지를 보낼 때 사용하는 prefix
		registry.setApplicationDestinationPrefixes("/app");
		
		// 클라이언트가 메시지를 구독할 때 사용하는 prefix
		registry.enableSimpleBroker("/topic");
	}
}
```

```java
@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public ChatMessage send(ChatMessage message) {
        return message;
    }
}
```


## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-framework/reference/web/websocket/stomp/message-flow.html
title: "Flow of Messages :: Spring Framework"
host: docs.spring.io
favicon: ../../../_/img/favicon.ico
```

```cardlink
url: https://hdbstn3055.tistory.com/295
title: "[Spring WebSocket] STOMP"
description: "STOMP의 사용 이유?`WebSocket` 프로토콜은 두 가지 유형의 메시지를 정의하고 있지만,그 메시지의 내용까지는 정의하고 있지 않다. `STOMP`는 `WebSocket` 위에서 동작하는 프로토콜로써, 클라이언트와 서버가 전송할메시지 유형형식내용들을 정의하는 매커니즘이다.  STOMP 란?`STOMP`는 `Simple Text Oriented Messaging Protocol`의 약자로 `TCP` 또는 `WebSocket`과 같은양방향 네트워크 프로토콜 기반으로 동작한다. 이름에서도 알 수 있듯이, `STOMP`는 텍스트 지향 프로토콜이지만, `Message Payload`에는 `Text` 또는`Binary` 데이터를 포함할 수도 있다. `STOMP`는 HTTP 위에서 동작하는 `Frame` 기반.."
host: hdbstn3055.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcNw7Ei%2FbtsKvaSdNlI%2FAAAAAAAAAAAAAAAAAAAAACg9tV0uwAeMp17Fyn8A_WVscwCAdPZYujnrStnMy-PV%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DpmHO4Jr4D8zZ2tpA9S5pcP2XhAg%253D
```

```cardlink
url: https://www.youtube.com/watch?v=rvss-_t6gzg
title: "[10분 테코톡] ✨ 아론의 웹소켓&스프링"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란  우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/e358493a/img/favicon_32x32.png
image: https://i.ytimg.com/vi/rvss-_t6gzg/hqdefault.jpg
```
