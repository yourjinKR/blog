---
tags:
  - 면접
  - 스터디
---
CORS는 브라우저의 동일 출처 정책으로 제한되는 교차 출처 요청을 서버가 선택적으로 허용할 수 있도록 하는 HTTP 헤더 기반 정책입니다. 출처는 프로토콜, 호스트, 포트의 조합으로 판단합니다. 브라우저는 요청에 Origin을 담고, 서버의 `Access-Control-Allow-Origin` 등의 응답 헤더를 확인해 JavaScript가 응답에 접근할 수 있는지 결정합니다. `Authorization`이나 JSON처럼 단순 요청 조건을 벗어나면 실제 요청 전에 OPTIONS 방식의 Preflight 요청으로 허용 여부를 확인합니다. 또한 CORS는 브라우저가 강제하는 정책이므로 서버 간 통신에는 일반적으로 적용되지 않으며, 인증이나 CSRF 방어를 대신하는 기능도 아닙니다.

> [!QUESTION]- CORS 요청에 쿠키를 사용하는 경우는 어떻게 하나요
> CORS 환경에서 쿠키를 사용하려면 클라이언트에서 credentials: include를 설정하고, 서버에서는 Access-Control-Allow-Credentials: true와 구체적인 Access-Control-Allow-Origin을 반환해야 합니다. Credentials 사용 시 와일드카드 출처는 사용할 수 없습니다. 또한 교차 사이트 쿠키라면 SameSite=None; Secure 설정이 필요하며, 쿠키는 자동 전송되므로 CSRF 방어도 함께 적용해야 합니다.

> [!QUESTION]- 단순 요청과 Preflight 요청의 차이는 무엇인가요?
> 정해진 메서드와 헤더, Content-Type 조건을 만족하는 단순 요청은 사전 확인 없이 실제 요청을 보냅니다. 그 외 요청은 브라우저가 먼저 OPTIONS 요청으로 메서드와 헤더를 허용하는지 확인하고, 서버가 적절한 CORS 헤더로 허용한 경우에만 실제 요청을 보냅니다.

> [!QUESTION]- CORS 오류가 발생하면 서버가 요청을 처리하지 않은 것인가요?
> 반드시 그렇지는 않습니다. CORS는 브라우저가 응답을 JavaScript에 공개할지 통제하는 정책이므로, 단순 요청은 서버에서 이미 처리된 뒤 브라우저가 응답 접근만 차단할 수 있습니다. 따라서 CORS 설정을 인증이나 CSRF 방어 수단으로 사용해서는 안 됩니다.
