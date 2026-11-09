---
date: 2026-11-09
tags:
  - 맛추리
  - Spring
  - Spring-Security
---

## OAuth2 연결 해제



### 카카오

https://developers.kakao.com/docs/ko/kakaologin/common#unlink

![[IMG-20261021010309448.png]]

### 네이버

https://developers.naver.com/docs/login/web/web.md

![[IMG-20261109181522357.png]]

### 구글

https://developers.google.com/identity/protocols/oauth2/web-server?hl=ko#tokenrevoke

![[IMG-20261109181547132.png]]


## 구현


| 객체                              | 담고 있는 내용                                        |
| ------------------------------- | ----------------------------------------------- |
| `OAuth2User`                    | provider 사용자 ID, 이메일 등 사용자 정보                   |
| `OAuth2AuthenticationToken`     | 로그인한 사용자와 어떤 provider로 인증했는지                    |
| `OAuth2AuthorizedClient`        | 해당 로그인에서 받은 provider access token·refresh token |
| `OAuth2AuthorizedClientService` | `OAuth2AuthorizedClient`를 저장하고 조회하는 서비스         |

구글과 같은 경우는 refreshToken이 내려오지 않을 수도 있다.  

![[IMG-20261109173647377.png]]

이를 위해 구글 OAuth 요청에는 아래와 같은 파라피터를 담아 보내야 한다.  

- `access_type=offline`: refresh token을 받을 수 있는 방식으로 요청
- `prompt=consent`: 이미 승인한 사용자에게도 동의 화면을 다시 표시

![[IMG-20261109175329876.png]]


- member의 필드 변화는 X
- 단순히 내부적으로 반복문으로 3회 재시도 진행 → 어짜피 이 부분은 리팩토링을 통해 고도화할거임
- provider_refresh_token 저장 전 이미 토큰이 있다면 교체하지 않음

네이버는 결과값이 `null`

![[IMG-20261109204815219.png]]




## 출처 및 참고자료

```cardlink
url: https://developers.kakao.com/docs/ko/kakaologin/common#unlink
title: "카카오 로그인 > 이해하기 - 카카오디벨로퍼스 | 문서"
description: "이 문서는 카카오 로그인을 소개합니다."
host: developers.kakao.com
image: http://k.kakaocdn.net/14/dn/btqC4uKcq7H/4Pmwbc2IgMyWfsgGXm0fAK/o.jpg
```

```cardlink
url: https://docs.cloud.google.com/apigee/docs/api-platform/reference/policies/revoke-oauth-v2-policy?hl=ko
title: "OAuth V2 정책 취소  |  Apigee  |  Google Cloud Documentation"
host: docs.cloud.google.com
image: https://docs.cloud.google.com/_static/cloud/images/social-icon-google-cloud-1200-630.png?hl=ko
```

```cardlink
url: https://github.com/Team-Unearned-Income/11th-1team-BE/pull/363
title: "Refactor: 카카오 소셜 연결 해제에 OpenFeign 및 서킷 브레이커 적용 by Developer-Choi-Jae-Young · Pull Request #363 · Team-Unearned-Income/11th-1team-BE"
description: "PR 타입(하나 이상의 PR 타입을 선택해주세요) Feat : 새로운 백엔드 기능 추가 Bug : 서버/로직 버그 발견 및 수정 Refactor : 백엔드 코드 구조 개선 Chore : 의존성/설정/인프라 유지보수 API : API 엔드포인트 및 스펙 변경 DB : DB 스키마/쿼리/마이그레이션 변경 Performance : 성능 개선 ..."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/2028ab072744701ce87ae2db8a0ccfeac25b25df2134e3d298d1b895e928b51d/Team-Unearned-Income/11th-1team-BE/pull/363
```

```cardlink
url: https://github.com/yourjinKR/11th-1team-BE/pull/1
title: "Refactor: 카카오 Unlink API 선언형 클라이언트 전환 및 서킷브레이커 적용 by yourjinKR · Pull Request #1 · yourjinKR/11th-1team-BE"
description: "PR 타입(하나 이상의 PR 타입을 선택해주세요) Feat : 새로운 백엔드 기능 추가 Bug : 서버/로직 버그 발견 및 수정 Refactor : 백엔드 코드 구조 개선 Chore : 의존성/설정/인프라 유지보수 API : API 엔드포인트 및 스펙 변경 DB : DB 스키마/쿼리/마이그레이션 변경 Performance : 성능 개선 ..."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/a177b0dcd3d5f92dc7543fdaf122efd013fa9994e702b85d7e6085c2b38ca353/yourjinKR/11th-1team-BE/pull/1
```

```cardlink
url: https://velog.io/@dayoung_sarah/Spring-Boot-OAuth2-%EA%B0%84%ED%8E%B8-%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%83%88%ED%87%B4-%EC%B6%94%EC%83%81%ED%99%94#4-%ED%83%88%ED%87%B4%EC%97%B0%EB%8F%99-%ED%95%B4%EC%A0%9C-%EC%B2%98%EB%A6%AC-%ED%94%84%EB%A1%9C%EB%B0%94%EC%9D%B4%EB%8D%94%EB%B3%84%EB%A1%9C-%EB%8B%A4%EB%A5%B8-%EB%A1%9C%EC%A7%81
title: "[Spring Boot] OAuth2 간편 로그인·탈퇴 추상화"
description: "OAuth2 간편 로그인·탈퇴 추상화 패턴"
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/dayoung_sarah/post/46d25647-135d-4df5-ba19-02f61986edb5/image.png
```
