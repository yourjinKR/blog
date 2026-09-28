---
date: 2026-09-24
tags:
  - JPA
---
OSIV(Open Session In View)는 **영속성 컨텍스트를 뷰까지 열어두는 기능**이다.  
`spring.jpa.open-in-view` 설정값을 통해 활성화/비활성화 제어 가능하다. (기본값은 `true`)

> [!NOTE] OSIV와 OEIV
> JPA에서는 OEIV(Open EntityManager In View), 하이버네이트에선 OSIV라고 표현

`true`일때는 아래와 같이 View에서도 지연 로딩이 가능하다.  

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("users")
public class UserController {

    private final UserService userService;

    @GetMapping("{username}")
    public ResponseEntity<UserResponse> findUser(@PathVariable String username) {
        User user = userService.findByUsername(username);
        List<Article> articles = user.getArticle(article); // 지연 로딩 발생
        return ResponseEntity.ok(toUserDetailResponse(user, articles));
    }
    
}
```

그러나 `false` 설정시 트랜잭션이 종료되면 영속성 컨텍스트가  닫히게 된다.  
그 경우 `LazyInitializationException`이 발생한다.  

## 동작 원리

- 클라이언트의 요청이 들어오면 서블릿 필터나, 스프링 인터셉터에서 영속성 컨텍스트를 생성한다. 단 이 시점에서 트랜잭션은 시작하지 않는다.
- 서비스 계층에서 `@Transeactional`로 트랜잭션을 시작할 때 1번에서 미리 생성해둔 영속성 컨텍스트를 찾아와서 트랜잭션을 시작한다.
- 서비스 계층이 끝나면 트랜잭션을 커밋하고 영속성 컨텍스트를 플러시한다. 이 시점에 트랜잭션은 끝내지만 영속성 컨텍스트는 종료되지 않는다.
- 컨트롤러와 뷰까지 영속성 컨텍스트가 유지되므로 조회한 엔티티는 영속 상태를 유지한다.
- 서블릿 필터나, 스프링 인터셉터로 요청이 돌아오면 영속성 컨텍스트를 종료한다. 이때 플러시를 호출하지 않고 바로 종료한다.

![[IMG-20260921174530953.png|490]]

## 언제 끄고 키는가

> 편의성을 우선하면 `true`, 트랜잭션 경계와 DB 접근을 명확하게 관리하려면 `false`.
> 특히 일반적인 REST API 서버에서는 `false`로 설정하고 필요한 데이터를 Service 계층의 트랜잭션 안에서 조회하는 방식을 많이 사용한다.

### OSIV를 끄는 경우

- 영속성 컨텍스트의 범위를 **트랜잭션 내부로 제한**할 수 있다.
- Controller/View에서 의도치 않은 **지연 로딩과 추가 쿼리 발생을 방지**할 수 있다.
- 필요한 데이터를 Service 계층에서 명시적으로 조회하게 되어 **쿼리를 예측하고 관리하기 쉬워진다.**
- 요청 처리 과정에서 외부 API 호출 등 시간이 오래 걸리는 작업이 있어도 영속성 컨텍스트가 불필요하게 오래 유지되는 것을 막을 수 있다.

> 대신 필요한 연관 데이터는 트랜잭션 내부에서 `fetch join`, DTO 조회, 명시적 초기화 등을 통해 가져와야 한다.

### OSIV를 켜는 경우

- 서버 사이드 렌더링처럼 View에서 엔티티의 연관 관계를 조회해야 하는 경우
- 규모가 작고 단순한 애플리케이션
- 개발 편의성을 우선하는 경우

> 다만 Controller/View에서 쿼리가 발생할 수 있어 **N+1 문제나 예상하지 못한 DB 접근을 발견하기 어려워질 수 있다.**

## 출처 및 참고자료

```cardlink
url: https://ykh6242.tistory.com/entry/JPA-OSIVOpen-Session-In-View%EC%99%80-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94#google_vignette
title: "JPA - OSIV(Open Session In View) 정리"
description: "OSIV(Open Session In View) OSIV(Open Session In View)는 영속성 컨텍스트를 뷰까지 열어두는 기능이다. 영속성 컨텍스트가 유지되면 엔티티도 영속 상태로 유지된다. 뷰까지 영속성 컨텍스트가 살아있다면 뷰에서도 지연 로딩을 사용할 수가 있다. ! JPA에서는 OEIV(Open EntityManager In View), 하이버네이트에선 OSIV(Open Session In View)라고 한다. 하지만 관례상 둘 다 OSIV로 부른다. OSIV 동작 원리 OSIV의 동작 방식에 대해서 Spring Framework가 제공하는 OSIV을 통해 알아보겠다. 스프링이 제공하는 OSIV 클래스는 서블릿 필터에서 적용할지 스프링 인터셉터에서 적용할지에 따라 원하는 클래스를 선택해서.."
host: ykh6242.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbd835C%2FbtqTPzbjhqa%2FAAAAAAAAAAAAAAAAAAAAADapPn1fnmQsFZSd4REqjo87stThHIKh0mMkyJB_RwP9%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DJHexezAs8VST1ZEU6sBTerYRMus%253D
```

```cardlink
url: https://velog.io/@hyeok_1212/osiv-%EC%84%A4%EC%A0%95%ED%95%98%EC%8B%9C%EB%82%98%EC%9A%94
title: "[Spring] OSIV 설정하시나요?"
description: "실행만 되면 OK일까요? OSIV에 대해 학습한 내용이에요."
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/hyeok_1212/post/7141ba8e-7b3b-485b-8eca-26553b6c1739/image.png
```

```cardlink
url: https://www.youtube.com/watch?v=Q2n9I86mav4
title: "[10분 테코톡] 웨이드의 OSIV"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란 우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인 ..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/e60429bd/img/favicon_32x32.png
image: https://i.ytimg.com/vi/Q2n9I86mav4/maxresdefault.jpg
```
