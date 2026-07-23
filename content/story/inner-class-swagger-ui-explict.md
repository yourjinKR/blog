---
title: 중첩 객체로 인한 swagger-ui example 객체 충돌 발생
tags:
  - Spring
  - Swagger
  - 프로그라피
  - 트러블슈팅
---
## 배경

프로젝트를 처음 진행하면서 다음과 같은 문제점을 발견했다.  
게시글 저장 API의 Request는 다음과 같은 DTO 형태였다.  

```java
public static class Request {  
    @Schema(description = "제목")  
    private String title;  
    @Schema(description = "내용")  
    private String contents;  
	// 중략,,,
}
```

그러나 전혀 swagger-ui의 Example Value에서는 전혀 다른 값이 보이는 것이다.

![[Pasted image 20260604035241.png|275]]

Config와 같은 설정 파일에서 충돌이 난 경우인지 찾아봤다.  
전혀 문제가 없었고 다른 곳에서 문제를 찾기 시작했다.  

![[Pasted image 20260604035338.png|300]]

스키마가 Request로 명시되어 있긴 한데 이는 다른 API에서 사용되는 Request였다.  

## 1차 해결

각 클래스에 스키마를 정의하니 해결할 수 있었다.

```java
@Data  
public class BoardDto {  
    @Data  
    @Schema(name = "BoardSaveRequest")  // 스키마 추가
    public static class Request {  
        @Schema(description = "제목")  
        private String title;  
        @Schema(description = "내용")  
        private String contents;  
    }  
}
```

![[Pasted image 20260604034309.png|250]]

## 2차 해결

사실 더 간단한 방식이 존재했다.
아래와 같은 설정을 통해 패키로 구분하여 스키마를 정의할 수 있었다.  

```yml
springdoc:
  use-fqn: true
```

![[Pasted image 20260604040138.png|350]]


## 출처 및 참고자료

https://findmypiece.tistory.com/360