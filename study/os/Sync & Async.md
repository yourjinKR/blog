
작업의 완료를 어떻게 다루는지에 대한 관점이다.  

## Sync

작업의 종료 시점과 결과의 전달 시점이 동일한 방식을 말한다.      
작업이 순차적으로 진행되며 작업 간 의존성이 있는 경우에 주로 사용한다.  

> [!EXAMPLE]
> 데이터베이스 트랜잭션, 파일 IO, 연속적인 계산 작업

%%%%
## Async

작업의 종료 시점과 결과의 전달 시점이 동일하지 않은 방식을 말한다.  
작업이 병렬적으로 실행되며, 시스템 자원을 효율적으로 사용하고 응답 시간을 단축할 수 있다.  

> [!EXAMPLE]
> 네트워크 IO, 이벤트 기반 프로그래밍

%%%%
## 출처 및 참고자료

```cardlink
url: https://coor.tistory.com/53
title: "동기, 비동기, 블로킹, 논블로킹 차이점"
description: "프로그래밍을 하다 보면 동기와 비동기, 블로킹과 논블로킹이라는 개념을 자주 접하게 됩니다. 이 용어들은 서로 비슷해 보이지만, 실제로는 중요한 차이점을 가지고 있어서 혼란을 겪곤 합니다. 이러한 이유로 이번 글에서는 동기와 비동기, 블로킹과 논블로킹의 개념을 명확히 정리하고 그 차이점을 살펴보려 합니다. 1. 동기, 비동기, 블로킹, 논블로킹 개념[ 동기 ]동기 작업은 하나의 작업이 완료될 때까지 다른 작업을 대기하는 방식입니다. 즉, 현재 작업이 끝나야만 다음 작업이 시작됩니다. 작업이 순차적으로 실행되며, 작업 간에 의존성이 있는 경우에 주로 사용됩니다. 데이터베이스 트랜잭션, 파일 읽기/쓰기 작업, 연속적인 계산 작업 등등에 사용합니다. 예시 코드public class Example { .."
host: coor.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FTMlAk%2FbtsIBhManLn%2FAAAAAAAAAAAAAAAAAAAAAA9ovPUIdzE2EDKCfTpmRTusNioP8OU38DfH4WfLBY0f%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D%252FqqIkeQlUNtjg438pmPtQ2%252FUIMU%253D
```
