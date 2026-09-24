---
title: API 설계
---
## API 설계

- [[URI]]를 리소스만으로 표현  
- 행위는 메서드로 표현
- 동사형은 최대한 지양
- URI에 API와 버전을 표기 (`api.example.com/v1/xxx`, `www.example.com/api/v1/xxx`)

> [!TIP]
> 버전을 명시하면 직관적 이해와 캐싱 전략을 쉽게 적용할 수 있다.  
> 그러나 URI가 길어질 수 있으며 URI 변경시 클라이언트에서 수정이 필요하다.  

- 리소스는 복수형으로 표현
- Path에 리소스 ID는 가능한 1개만 사용 (`/리소스/{리소스 ID}/하위 리소스`)

```
/teams/{teamId}/members
```

- kebab-case를 사용
- parameter, body는 camelCase를 사용
- 복잡한 행위에는 동사를 URI에 포함시키자 (**컨트롤 URI**)
- 일관성을 유지하자

## 출처 및 참고자료

https://jojoldu.tistory.com/783