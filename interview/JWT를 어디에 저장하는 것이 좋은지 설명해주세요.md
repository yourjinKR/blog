---
tags:
  - 면접
  - 스터디
---
- 비공개 변수
- 로컬 스토리지
- 쿠키

> 브라우저 환경에서는 Access Token은 짧은 만료 시간으로 메모리에 저장하고 Authorization 헤더로 전송하며, Refresh Token은 JavaScript가 접근할 수 없는 HttpOnly·Secure·SameSite 쿠키에 저장하는 방식을 선호합니다. Refresh Token은 서버의 DB나 Redis에서도 관리하고, 재발급 시 Rotation을 적용해 탈취와 재사용을 감지합니다. localStorage는 구현은 간단하지만 XSS 발생 시 토큰을 직접 탈취할 수 있어, 특히 Refresh Token 저장소로는 권장하지 않습니다. 다만 쿠키는 자동으로 전송되므로 SameSite와 Origin 검증 같은 CSRF 방어도 함께 적용해야 합니다.