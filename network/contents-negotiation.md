---
title: 컨텐츠 협상
---
# Content negotiation

[[HTTP]]에서 동일한 [[URI]]에서 리소스의 서로 다른 버전을 제공하기 위해 사용하는 메커니즘이다.  

- Accept (데이터 타입)
- Accept-Charset
- Accept-Encoding
- Accept-Language

## 협상과 우선순위

### Quality Values

- 0~1으로 표현하며 클수록 높은 우선순위를 지닌다

```http
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
```

![[Pasted image 20260710015114.png|533]]