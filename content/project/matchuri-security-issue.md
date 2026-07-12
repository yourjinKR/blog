---
title: 맛추리 보안 이슈 파악
tags:
  - 맛추리
---
# 요약

### SQL Injection

- 현재 ORM를 사용 중
- 사용자가 입력한 문자열로 SQL를 제어하지 않기에 프레임워크 레벨에서 차단

### [[XXS]]

- Access Token을 localStorage와 같은 저장소가 아닌 Auth 기반 Store에 저장
- Refresh Token은 HttpOnly 설정하여 Http 통신으로만 쿠키를 제어할 수 있도록 설정

### [[CSRF]]

- REST API는 기본적으로 stateless 환경이기에 비교적 안전
- 요청 헤더에 직접 토큰을 담지 않으면 요청이 실패하므로 CSRF가 성립 X
- 관리자 페이지는 세션기반이기에 CSRF 설정
- 추후 허용된 IP만 제어하도록 설정 

%%  %%

- 원래는 csrf 토큰을 발급하여 방어할 필요가 있음
- 혹은 `same-site: Lax` 설정을 하여 방어
- 그러나 현재 아무런 조치를 하고 있지 않음 (현재 배포 설정은 `same-site: None`)
- 현재 FE와 BE의 도메인이 분리되어 있기에 `None` 설정 필요
- 그렇다면 취약점이 있는 것이 아닌가?
- `/refresh` 호출을 통해 API 호출이 가능하긴 함.
- 그러나 [[cors|CORS]] 설정을 통해 공격자는 조회할 수 없음

### [[CORS]]

- 위에 언급한거와 같이 정해진 리소스(FE 도메인)에만 접근을 허용




