---
tags:
  - OS
aliases:
  - Translation Lookaside Buffer
---
가상 메모리 주소를 물리적인 주소로 변환하는 속도를 높이기 위해 사용되는 캐시이다.  
TLB는 page, frame 단위로 저장하고 있으며, 가상 주소 → 물리 메모리 주소로 변환할 때 속도를 높여준다.  

![[IMG-20260903203514873.png|456]]

## TLB Flush

TLB 플러쉬란 CPU가 프로세스를 사용하면서 TLB에 저장한 (page, frame) 매핑 정보를 모두 지우는 과정이다.  
주로 [[Context Switching|컨텍스트 스위칭]] 과정에서 TLB 플러쉬가 발생한다.

TLB Flush가 필요한 이유는 다음과 같다.  

1. 가상 주소 공간의 충돌 방지
2. 주소 변환의 일관성 유지

추가적으로, 컨텍스트 스위칭시 무조건적으로 Flush가 발생하지는 않는다.  

```
Context Switch
      ↓
다른 작업의 working set 사용
      ↓
기존 cache line eviction
      ↓
원래 작업 재실행
      ↓
cache miss 증가
      ↓
하위 캐시 또는 메모리 접근
```


## 출처 및 참고자료

https://www.youtube.com/watch?v=5eSiUbJcnUA  
https://server-technology.tistory.com/450  
https://ko.wikipedia.org/wiki/%EB%B3%80%ED%99%98_%EC%83%89%EC%9D%B8_%EB%B2%84%ED%8D%BC  