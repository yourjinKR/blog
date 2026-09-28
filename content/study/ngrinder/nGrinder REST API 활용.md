---
tags:
  - nGrinder
---
nGrinder 스크립트를 만들고 특정 조건의 Test를 반복시키고 싶었다.  

### POST 테스트

우선 POST 요청을 통해 정상적으로 테스트가 수행되는지 확인해보자.

```sh
curl -u "{userId}:{password}" -H "Content-Type: application/json" -X POST "http://localhost/{topic}/api/{id}/clone_and_start" -d "{}"
```

- `userId`: 로그인시 ID
- `password`: 로그인시 PW
- `topic`: 주소명
- `id`: 테스트 ID

Test 페이지에 들어가면 url 주소에 각 테스트마다 고유 `id`가 생성된다.  

아래 이미지와 같이 `http://localhost/perftest/104`일 경우 아래와 같이 스크립트를 작성한다.  

```sh
curl -u "admin:admin" -H "Content-Type: application/json" -X POST "http://localhost/perftest/api/104/clone_and_start" -d "{}"
```

![[IMG-20260923202713705.png]]

### 스크립트

크론보다는 스크립트를 하나 만들어서 실행 만으로 특정 id의 이벤트를 N번 루프 돌리는 것도 좋다고 생각하여 스크립트를 만들었다.  

```sh
#!/bin/bash

# 1. 파라미터가 2개 입력되었는지 확인 (입력 안 했으면 사용법 안내 후 종료)
if [ "$#" -ne 2 ]; then
    echo "사용법: $0 [테스트ID] [반복횟수]"
    echo "실행 예시: $0 104 5"
    exit 1
fi

# 2. 입력받은 파라미터를 변수에 저장
TEST_ID=$1
MAX_LOOP=$2

echo "================================================="
echo " nGrinder 테스트 시작"
echo " - 테스트 ID : ${TEST_ID}"
echo " - 반복 횟수 : ${MAX_LOOP}회 (2분 간격)"
echo "================================================="

# 3. 지정된 횟수만큼 루프 실행
for ((i=1; i<=MAX_LOOP; i++)); do
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $i 번째 실행 중..."
    
    # curl 명령어에 입력받은 TEST_ID 변수 적용
    curl -s -u "admin:admin" -H "Content-Type: application/json" -X POST "http://localhost/perftest/api/${TEST_ID}/clone_and_start" -d "{}" > /dev/null
    
    # 마지막 실행이 아닐 경우에만 2분(120초) 대기
    if [ $i -lt $MAX_LOOP ]; then
        sleep 120
    fi
done

echo "================================================="
echo " ID [${TEST_ID}] - 총 ${MAX_LOOP}회 테스트 실행이 완료되었습니다!"
echo "================================================="
```

아래와 같이 id와 loop 횟수를 붙여 실행할 수 있다.  

```sh
./run_test.sh 104 5
```


## 출처 및 참고자료

```cardlink
url: https://github.com/naver/ngrinder/wiki/REST-API
title: "REST API"
description: "enterprise level performance testing solution. Contribute to naver/ngrinder development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/e705323741345797d23dcc1e1501b3fa45e2286a739ad34bb09150d15148cdea/naver/ngrinder
```

```cardlink
url: https://github.com/naver/ngrinder/wiki/REST-API-PerfTest
title: "REST API PerfTest"
description: "enterprise level performance testing solution. Contribute to naver/ngrinder development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/e705323741345797d23dcc1e1501b3fa45e2286a739ad34bb09150d15148cdea/naver/ngrinder
```
