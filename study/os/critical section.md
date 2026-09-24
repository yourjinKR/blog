---
title: 임계 구역
tags:
  - OS
aliases:
  - 임계 구역
---
병렬컴퓨팅에서 둘 이상의 [[thread|스레드]]가 동시에 접근해서는 안되는 공유 자원을 접근하는 코드의 일부를 말한다.  ^intro

> [!CAUTION]
> 임계 구역은 공유 자원 자체를 의미하는 것이 아니다!

```c
do {
	wait(mutex); // 입장 구역
	// 임계 구역
	signal(mutex);
	// 나머지 구역
}
```


%%%%
## 출처 및 참고자료

https://ko.wikipedia.org/wiki/%EC%9E%84%EA%B3%84_%EA%B5%AC%EC%97%AD