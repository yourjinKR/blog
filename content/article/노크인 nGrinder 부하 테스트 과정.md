---
date: 2026-09-28
tags:
  - 노크인
  - nGrinder
---
출시 후 노크인 프로젝트에서 기존에 개발한 API들에 대해 성능 개선 작업을 진행했다.  
우선 로컬 환경에서 nGrinder로 부하 테스트를 진행하기로 했으며 Prometheus + Grafana로 성능을 관측하기로 했다.  
우선 각자 [[nGrinder 튜토리얼|nGrinder에 대해 먼저 알아본 후]] 작업을 진행하기로 했다. nGrinder 다루는 방식에 대해 아직 미숙했기에 [[nGrinder Connection reset 설정]]과 같이 문제를 해결하며 테스트 환경을 구축하기 시작했다.  

또한, [[nGrinder REST API 활용]]하여 Test를 반복 실행할 수 있는 스크립트를 만들었다.  

- [[노크인 부하테스트 1차 테스트 결과]]


## 출처 및 참고자료

```cardlink
url: https://github.com/naver/ngrinder/wiki
title: "Home"
description: "enterprise level performance testing solution. Contribute to naver/ngrinder development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/e705323741345797d23dcc1e1501b3fa45e2286a739ad34bb09150d15148cdea/naver/ngrinder
```

```cardlink
url: https://github.com/binghe819/TIL/blob/master/Infra&DevOps/nGrinder/nGrinder%20%EC%99%84%EB%B2%BD%EA%B0%80%EC%9D%B4%EB%93%9C.md#3-2-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%83%9D%EC%84%B1-%EB%B0%8F-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9E%91%EC%84%B1
title: "TIL/Infra&DevOps/nGrinder/nGrinder 완벽가이드.md at master · binghe819/TIL"
description: "📚 Today I Learned. 기록하자. Contribute to binghe819/TIL development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/cad0fa8fcb466a24b49438b2b7e07eecd5c6407866fe4bbe7aea3e024eb07aae/binghe819/TIL
```

--- 

## 가상의 유저 확보 방식

인증이 필요한 API에는 JWT 엑세스 토큰을 헤더에 붙여 요청해야 된다.  
초기 script에는 아래와 같이 토큰 변수를 통해 JWT 토큰을 직접 넣어 관리했다.  

```java
public static final List<String> TOKEN_POOL = [
	"TOKEN_USER_1",
	"TOKEN_USER_2",
	"TOKEN_USER_3",
	"TOKEN_USER_4",
	"TOKEN_USER_5"
]
```

이와 같은 방식은 `http://localhost:8080/oauth2/authorization/kakao`에 직접 요청 후 브라우저 Cookie에서 AccessToken을 직접 복붙해서 스크립트를 계속 수정해야 된다는 불편함이 있었다.  

이를 개선하려면 어떻게 할까?