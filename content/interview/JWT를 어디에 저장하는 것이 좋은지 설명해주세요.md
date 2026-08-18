---
tags:
  - 면접
  - 스터디
---
브라우저 환경에서는 Access Token은 짧은 만료 시간으로 메모리에 저장하고 Authorization 헤더로 전송하며, Refresh Token은 JavaScript가 접근할 수 없는 HttpOnly·Secure·SameSite 쿠키에 저장하는 방식을 선호합니다. Refresh Token은 서버의 DB나 Redis에서도 관리하고, 재발급 시 Rotation을 적용해 탈취와 재사용을 감지합니다. localStorage는 구현은 간단하지만 XSS 발생 시 토큰을 직접 탈취할 수 있어, 특히 Refresh Token 저장소로는 권장하지 않습니다. 다만 쿠키는 자동으로 전송되므로 SameSite와 Origin 검증 같은 CSRF 방어도 함께 적용해야 합니다.

> 정해진 정답은 없다. 애플리케이션 구조에 따라 상이하다 상황에 맞게 설정하자.

> [!QUESTION]- HttpOnly 쿠키를 사용하면 XSS로부터 완전히 안전한가요?
> 아닙니다. HttpOnly는 JavaScript가 쿠키 값을 읽어 외부로 탈취하는 것을 어렵게 하지만, 페이지에서 실행된 악성 스크립트가 브라우저에 쿠키가 포함된 요청을 보내는 것까지 막지는 못합니다. 따라서 XSS 자체를 방지하는 출력 이스케이프와 CSP 등의 대책도 필요합니다.

> [!QUESTION]- Access Token을 메모리에 저장하면 어떤 단점이 있나요?
> 페이지를 새로고침하거나 탭을 닫으면 토큰이 사라지므로 사용자 인증 상태를 복원하는 절차가 필요합니다. 보통 HttpOnly 쿠키의 Refresh Token을 이용해 새 Access Token을 발급받지만, 재발급 엔드포인트에는 CSRF 방어와 Rotation을 적용해야 합니다.

> [!QUESTION]- localStorage가 Refresh Token 저장소로 권장되지 않는 이유는 무엇인가요?
> localStorage의 값은 같은 출처에서 실행되는 JavaScript가 읽을 수 있으므로 XSS가 발생하면 수명이 긴 Refresh Token이 외부로 유출될 수 있습니다. 공격자는 이를 자신의 환경에서 재사용할 수 있기 때문에 피해가 오래 지속될 수 있습니다.
