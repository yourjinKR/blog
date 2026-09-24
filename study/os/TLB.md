---
tags:
  - OS
aliases:
  - Translation Lookaside Buffer
---
가상 메모리 주소를 물리적인 **주소로 변환하는 속도를 높이기 위해 사용**되는 캐시이다.  
TLB는 page, frame 단위로 저장하고 있으며, 가상 주소 → 물리 메모리 주소로 변환할 때 속도를 높여준다.  

![[IMG-20260903203514873.png|456]]

- Page table 중 일부가 Associative Register에 보관
- 만약 해당 Page가 Associative Register에 있는 경우 바로 TLB Hit이 발생하여 Frame을 얻는다.
- 그렇지 않을 경우 Physical Memory에 있는 Page Table로 부터 Frame을 얻는다.  
- TLB는 context switching 때 flush가 발생한다.

일반적인 Page Table로의 접근은 Logical Address만큼 이동하여 데이터를 빠르게 탐색할 수 있지만, TLB는 페이지 테이블의 일부만 갖고 있기에 전체 탐색이 요구된다. 그러므로 병렬 탐색이 가능한 Associative Registers를 사용한다.  

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

## Two-Level Page Table

32비트 환경에서는 $2^{32}$의 주소 공간을 갖기에 약 1만개의 Page Table Entry가 필요하다.  
그러나, 대부분의 프로그램은 4GB의 주소 공간 중 지극히 일부분만 사용되기에 공간 낭비된다.  

그렇기에, Page Table 자체를 Page로 구성하여 공간을 절약한다.  

![[IMG-20260909174518983.png|381]]

## 출처 및 참고자료

```cardlink
url: https://server-technology.tistory.com/450
title: "[운영체제] TLB(Translation Lookaside Buffer)"
description: "page table은 메모리에 저장되는데, CPU는 프로세스를 사용하기 위해 메모리에 두 번 접근해야 한다.메모리에 저장된 page table에 접근가상 주소를 물리 주소로 변환하기 위해 page table에 접근한다.page table 기반으로 실제 메모리에 접근page 테이블에서 얻은 물리 주소를 통해 실제 물리 메모리에 접근한다. CPU에서 메모리에 접근하는 것은 시간이 소요되는 작업이다. 따라서 메모리에 두 번의 접근이 필요하면 상당한 시간이 소요된다. 이러한 문제를 해결하기 위해서는 메모리에 접근하는 횟수를 줄여야 한다.  1. TLB(Translation Lookaside Buffer)1-1. TLB란?TLB(Translation Lookaside Buffer)는 메모리 접근 횟수를 줄이고자 .."
host: server-technology.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FNdk88%2FbtsIsZSOXi5%2FAAAAAAAAAAAAAAAAAAAAAD4AkOPIL1VOUh7ffYFXvJ7GZr4SdS56m1Um7ctHiZ6O%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DIcGuEeeq6YiFxTiH8m3VXDxHdzY%253D
```

```cardlink
url: https://ko.wikipedia.org/wiki/%EB%B3%80%ED%99%98_%EC%83%89%EC%9D%B8_%EB%B2%84%ED%8D%BC
title: "변환 색인 버퍼 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
image: https://upload.wikimedia.org/wikipedia/commons/6/6e/Translation_Lookaside_Buffer.png?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=thumbnail_unscaled
```

```cardlink
url: https://core.ewha.ac.kr/publicview/C0101020140429132440045277?vmode=f
title: "이화여자대학교 :: CORE Campus"
host: core.ewha.ac.kr
```
