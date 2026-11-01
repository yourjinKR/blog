---
date: 2026-10-30
tags:
  - Spring
aliases:
  - "@ResponseBody"
---
- ViewResolver 대신에 HttpMessageConverter가 동작된다.
- 기본 문자 처리의 경우, StringHttpMessageConverter를 사용한다.
- 기본 객체 처리의 경우, MappingJackson2 HttpMessageConverter를 사용한다.
- byte 처리 및 기타 여러 가지의 HttpMessageConverter가 기본으로 등록되어 있다.

```java
@GetMapping("/members")
public @ResponseBody List<MemberRequest> getMemberList() {
	return memberService.findMember();
}
```

## 출처 및 참고자료

```cardlink
url: https://hyos-dev-log.tistory.com/18
title: "[Spring] HttpMessageConverter 정리"
description: "HttpMessageConverter를 사용하면, JSON 데이터를 Http Message Body에서 직접 읽거나 쓰는 경우에 편리하다. @ResponseBody를 사용하는 경우 ViewResolver 대신에 HttpMessageConverter가 동작된다. 기본 문자 처리의 경우, StringHttpMessageConverter를 사용한다. 기본 객체 처리의 경우, MappingJackson2 HttpMessageConverter를 사용한다. byte [] 처리 및 기타 여러 가지의 HttpMessageConverter가 기본으로 등록되어 있다. HTTP 요청, 응답에 둘 다 사용 요청의 경우, 메시지를 읽어서 객체로 바꾼 다음 컨트롤러에 파라미터로 넘겨주는 역할은 한다. 응답의 경우, 컨트롤러에서 .."
host: hyos-dev-log.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Ftistory_admin%2Fstatic%2Fimages%2FopenGraph%2Fopengraph.png
```

