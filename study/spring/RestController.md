---
date: 2026-10-30
tags:
  - Spring
aliases:
  - "@RestController"
---
Spring에서 **[[REST|RESTful]] 웹 서비스의 컨트롤러**를 만들 때 사용하는 어노테이션이다.  

- `@Controller`와 [[ResponseBody|@ResponseBody]]의 동작을 하나로 결합한 어노테이션
- View가 아닌 특정 데이터 타입을 반환 (Spring Boot의 기본값은 json)


![[IMG-20261030191842298.png|397]]

## 출처 및 참고자료

```cardlink
url: https://dncjf64.tistory.com/288
title: "@Controller와 @RestController의 차이점"
description: "1.개요 Spring MVC의 @RestController은 @Controller와 @ResponseBody의 조합입니다. Spring 프레임 워크에서 RESTful 웹 서비스를 보다 쉽게 개발할 수 있도록 Spring 4.0에서 추가되었습니다. 근본적인 차이점은 @Controller의 역할은 Model 객체를 만들어 데이터를 담고 View를 찾는 것이지만, @RestController는 단순히 객체만을 반환하고 객체 데이터는 JSON 또는 XML 형식으로 HTTP 응답에 담아서 전송합니다. 물론 @Controller와 @ResponseBody를 사용하여 만들 수 있지만 이러한 방식은 RESTful 웹서비스의 기본 동작이기 때문에 Spring은 @Controller와 @ResponseBody의 동작을 조.."
host: dncjf64.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbXvA4D%2FbtqW4gE9bMH%2FAAAAAAAAAAAAAAAAAAAAAHEv6cY_XKFMU5KhnUY31zjv8ykA93Y06qCyyYtbfvoe%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Do8Tuh4xLbfNv3yYgEH753AF2CUQ%253D
```
