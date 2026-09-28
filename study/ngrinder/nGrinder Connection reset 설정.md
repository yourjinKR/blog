---
tags:
  - nGrinder
---
부하 테스트를 진행하면서 의문인 점이 있었다.  
초기에 리소스가 적은 단순 Read API에 대해 부하 테스트를 진행 중이었음에도 불구하고 에러율이 높게 나오는 것이다.  

로그를 살펴보니 Connection Refused가 발생했으며 서버 로그에는 아무런 노이즈가 없었다.  

![[IMG-20260921205835040.png]]

## Connection reset on each test run 옵션

검색 및 에이전트의 분석 결과로는 Test 설정시 `Connection reset on each test run` 체크 박스 해제를 권장한다는 사실을 알았다.  

```cardlink
url: https://velog.io/@hwicode/Connection-refused-%EC%97%90%EB%9F%AC-%ED%95%B4%EA%B2%B0-%EA%B3%BC%EC%A0%95
title: "Connection refused 에러 해결 과정"
description: "Connection refused가 발생하는 상황제가 nGrinder를 사용하면서 Connection refused를 겪은 상황은 다음과 같습니다.>서버의 ip와 포트를 잘못 입력한 경우서버의 방화벽으로 인해 차단된 경우도커에 대한 이해가 부족한 경우OS"
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/hwicode/post/1f68a111-2d67-4546-82ab-077293651727/image.png
```

```cardlink
url: http://ngrinder.373.s1.nabble.com/Connection-reset-on-each-test-run-Connection-refused-td2703.html
title: "ngrinder-user-kr - Connection reset on each test run 옵션과 Connection refused의 관계"
description: "Connection reset on each test run 옵션과 Connection refused의 관계. 안녕하세요. nGrinder를 통해 테스트 진행 중, 아래와 같이 에러 메세지를 받게 되어 질문 드립니다. (output log의 일부입니다.) ``` 2021-06-14 03:03:08,964 ERROR..."
host: ngrinder.373.s1.nabble.com
```

![[IMG-20260921211702418.png]]

아래와 같이  설정을 해제하면 `keep alive`을 통해 서버로 연결된 커넥션이 유지된다.  

![[IMG-20260921205249001.png]]

### 커넥션 풀

실제로 커넥션 풀에서 직관적으로 변화를 확인할 수 있었다.  

![[IMG-20260921211359535.png]]

![[IMG-20260921211436869.png]]

