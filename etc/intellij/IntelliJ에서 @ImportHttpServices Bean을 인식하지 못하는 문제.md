---
date: 2026-10-21
tags:
  - Intellij
title: IntelliJ에서 @ImportHttpServices Bean을 인식하지 못하는 문제
aliases:
  - Intellij가 Bean을 인식 못하는 버그
---
```cardlink
url: https://github.com/yourjinKR/11th-1team-BE/pull/1
title: "Refactor: 카카오 Unlink API 선언형 클라이언트 전환 및 서킷브레이커 적용 by yourjinKR · Pull Request #1 · yourjinKR/11th-1team-BE"
description: "PR 타입(하나 이상의 PR 타입을 선택해주세요) Feat : 새로운 백엔드 기능 추가 Bug : 서버/로직 버그 발견 및 수정 Refactor : 백엔드 코드 구조 개선 Chore : 의존성/설정/인프라 유지보수 API : API 엔드포인트 및 스펙 변경 DB : DB 스키마/쿼리/마이그레이션 변경 Performance : 성능 개선 ..."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/45d7aedfad74d6875c89168e98cb5cf80d393c097e09ebc464130a8565327780/yourjinKR/11th-1team-BE/pull/1
```

Bean을 찾지 못한다는 Syntax Error가 발생했다.  

```java
public interface KakaoUnlinkClient {
    @PostExchange(url = "/v1/user/unlink", contentType = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    String unlink(@RequestHeader("Authorization") String authorization, @RequestParam("target_id_type") String targetIdType, @RequestParam("target_id") String targetId);
}
```

반면 애플리케이션 자체는 정상적으로 실행하는 것을 확인했다.  

![[IMG-20261021134732155.png]]

IDE의 기존  버전에서는 인식하지 못하는 버그가 존재했다.  
최신 버전으로 업데이트 진행했다.  (2025.2.0 → 2026.2.3)

https://youtrack.jetbrains.com/projects/IDEA/issues/IDEA-381968/HTTP-Service-Client-bean-with-ImportHttpServices-is-not-recognized

https://youtrack.jetbrains.com/projects/IDEA/issues/IDEA-376584/Spring-HTTP-Interfaces-treat-HttpExchange-interfaces-imported-via-ImportHttpServices-as-beans