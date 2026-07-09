---
title: PRG
tags:
  - design-pattern
---
# PRG (POST & Redirect & Get)

웹개발시 권장되는 디자인 패턴이다.
[[idempotency|멱등성]]을 보장하고 POST에 대한 결과를 다른 사용자와 공유하기 위해 사용되는 패턴이다.  


POST 응답 후 GET 메서드로 리다이렉트하는 패턴을 말한다.  

> [!INFO]
> RPG 패턴을 사용하는 이유는 