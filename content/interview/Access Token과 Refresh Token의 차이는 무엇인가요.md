---
tags:
  - 면접
  - 스터디
---
Access Token은 사용자가 API에 접근할 때 인증 및 인가를 수행하기 위해 사용하는 토큰이고, Refresh Token은 만료된 Access Token을 다시 발급받기 위해 사용하는 토큰입니다.

Access Token은 실제 리소스에 접근할 수 있기 때문에 탈취 피해를 줄이기 위해 만료 시간을 짧게 설정합니다. 반면 Refresh Token은 일반 API에 접근하는 용도로 사용하지 않고 Access Token 재발급 엔드포인트에서만 사용하며, 사용자가 자주 로그인하지 않도록 상대적으로 긴 만료 시간을 설정합니다.

다만 Refresh Token이 탈취되면 공격자가 Access Token을 계속 발급받을 수 있으므로 안전하게 보관해야 합니다. 로그아웃이나 강제 만료, 토큰 재사용 탐지 등을 지원하기 위해 Refresh Token 또는 세션 정보를 DB나 Redis에서 관리하기도 합니다. 이 경우 완전한 무상태성은 일부 포기하지만 보안성과 제어 가능성을 높일 수 있습니다.

참고로 Access Token과 Refresh Token은 역할에 따른 구분이고, JWT는 토큰을 표현하는 형식이므로 두 개념을 동일하게 볼 수는 없습니다.

> [!QUESTION]- Access Token의 만료 시간을 짧게 설정하는 이유는 무엇인가요?
> Access Token은 API 호출 권한을 직접 가지므로 탈취되면 공격자가 즉시 사용할 수 있습니다. 만료 시간을 짧게 설정하면 토큰을 즉시 폐기하기 어려운 무상태 구조에서도 피해가 지속되는 시간을 제한할 수 있습니다.

> [!QUESTION]- Refresh Token Rotation은 어떻게 동작하나요?
> Refresh Token으로 Access Token을 재발급할 때 Refresh Token도 새로 발급하고 기존 토큰은 즉시 무효화하는 방식입니다. 이미 사용된 Refresh Token이 다시 제출되면 탈취 및 재사용으로 판단하여 해당 토큰 계열을 모두 폐기할 수 있습니다.

> [!QUESTION]- 로그아웃하면 Access Token은 즉시 무효화되나요?
> 서명과 만료 시간만 검증하는 완전한 무상태 방식에서는 서버가 이미 발급한 Access Token을 즉시 제거할 수 없습니다. 보통 Refresh Token을 폐기하고 Access Token은 짧은 만료 시간을 사용하며, 즉시 차단이 필요하면 블랙리스트나 토큰 버전 같은 서버 측 상태를 추가합니다.
