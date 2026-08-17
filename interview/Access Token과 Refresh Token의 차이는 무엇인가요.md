---
tags:
  - 면접
  - 스터디
---
Access Token은 사용자가 API에 접근할 때 인증 및 인가를 수행하기 위해 사용하는 토큰이고, Refresh Token은 만료된 Access Token을 다시 발급받기 위해 사용하는 토큰입니다.

Access Token은 실제 리소스에 접근할 수 있기 때문에 탈취 피해를 줄이기 위해 만료 시간을 짧게 설정합니다. 반면 Refresh Token은 일반 API에 접근하는 용도로 사용하지 않고 Access Token 재발급 엔드포인트에서만 사용하며, 사용자가 자주 로그인하지 않도록 상대적으로 긴 만료 시간을 설정합니다.

다만 Refresh Token이 탈취되면 공격자가 Access Token을 계속 발급받을 수 있으므로 안전하게 보관해야 합니다. 로그아웃이나 강제 만료, 토큰 재사용 탐지 등을 지원하기 위해 Refresh Token 또는 세션 정보를 DB나 Redis에서 관리하기도 합니다. 이 경우 완전한 무상태성은 일부 포기하지만 보안성과 제어 가능성을 높일 수 있습니다.

참고로 Access Token과 Refresh Token은 역할에 따른 구분이고, JWT는 토큰을 표현하는 형식이므로 두 개념을 동일하게 볼 수는 없습니다.