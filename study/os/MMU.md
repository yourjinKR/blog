---
tags:
  - CA
aliases:
  - Memory Management Unit
---
CPU가 메모리에 접근하는 것을 관리하는 컴퓨터 하드웨어 부품이다.  ^intro

가상 메모리 주소를 실제 메모리 주소로 변환하며, 메모리 보호, 캐시 관리, 버스 중재 등의 역할을 담당한다.  
간단한 8비트 아키텍처에서는 뱅크 스위칭을 담당하기도 한다.

[[TLB]]를 통해 주소 변환 정보를 캐싱하여 변환 속도를 높인다.  

![[IMG-20260909151802563.png]]

## MMU scheme

### 연속할당 방식

사용자 프로세스가 CPU에서 수행되며 생성해내는 모든 주소값에 대해 base register의 값을 더한다.  

- relocation register와 limit register를 통해 주소 변환이 이뤄진다.  
	- relocation register: 물리적 주소의 시작
	- limit register: 물리적 주소의 끝

- 주소 변환 과정에서 물리적 주소의 시작 + 가상 주소를 더한 물리적 주소를 저장한다, 다만 더한 주소가 물리적 주소의 끝을 넘어갔는지 확인한다. (만약 limit register를 넘어갈 경우 trap이 발생, CPU 제어권이 잠시 OS로 넘어감)

![[IMG-20260909152759744.png|436]]

### 비연속 할당 방식




## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/%EB%A9%94%EB%AA%A8%EB%A6%AC_%EA%B4%80%EB%A6%AC_%EC%9E%A5%EC%B9%98
title: "메모리 관리 장치 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
image: https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/MC68451_p1160081.jpg/1280px-MC68451_p1160081.jpg?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=thumbnail
```  

```cardlink
url: https://www.youtube.com/watch?v=5eSiUbJcnUA
title: "[개발자 면접질문] 운영체제 - TLB, MMU"
description: "00:18 배경지식01:45 TLB03:27 TLB 동작04:48 MMU05:35 마무리#TLB #MMU #CPU"
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/bfff41d2/img/favicon_32x32.png
image: https://i.ytimg.com/vi/5eSiUbJcnUA/hqdefault.jpg
```

```cardlink
url: http://www.kocw.net/home/cview.do?cid=3646706b4347ef09
title: "운영체제"
description: "운영체제는 컴퓨터 하드웨어 바로 위에 설치되는 소프트웨어 계층으로서 모든 컴퓨터 시스템의 필수적인 부분이다. 본 강좌에서는 이와 같은 운영체제의 개념과 역할, 운영체제를 구성하는 각 요소 및 그 알고리즘의 핵심적인 부분에 대해 기초부터 학습한다."
host: www.kocw.net
image: http://www.kocw.net/common/contents/thumbnail/07/t1046323.jpg
```
