---
title: 옵시디언 블로그 튜토리얼
---
# 위키 링크 테스트

위키 링크가 가능하다면 [[content/index|해당 링크]]가 동작 합니다.

# 이미지 업로드

이미지가 정상적으로 업로드 됩니다.

![[Pasted image 20260520020111.png]]

# 코드 블럭 테스트

코드 블럭이 정상적으로 작동하는지 확인합니다.

```java
System.out.println("Hello world!");
```

# 마크다운 테스트

==정상 작동시 해당 텍스트는 형광펜 강조 효과 또한 정상 작동합니다.==

아래 커스텀 인용 블럭이 정상 작동하는지 확인합니다.

> [!note] 참고
> 이것은 기본 노트 콜아웃입니다.

> [!warning] 주의!
> 에러가 발생할 수 있는 부분을 강조할 때 씁니다.

> [!tip]- 접기/펴기 팁
> 이렇게 뒤에 `-`를 붙이면 기본적으로 접혀있는 콜아웃을 만들 수 있습니다.

# 머메이드 다이어그램

머메이드 다이어그램이 정상 작동합니다.

```mermaid
sequenceDiagram
    Client->>Server: HTTP GET /api/users
    Server-->>Database: SELECT * FROM users
    Database-->>Server: User Data
    Server-->>Client: 200 OK (JSON)
```


# 수학 수식 (Math / LaTeX)

수학 공식 또한 정상 작동합니다.

인라인 수식 테스트: $O(n \log n)$ 

블록 수식 테스트:
$$
f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \,d\xi
$$

# 태그

이 문서에 #obsidian #tutorial #index 태그를 달아봅니다.

# 중첩목차 테스트

## 대제목 테스트 1
### 중제목 테스트 1.1
### 중제목 테스트 1.2
## 대제목 테스트 2

