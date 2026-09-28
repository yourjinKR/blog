---
date: 2026-09-28
tags:
  - nGrinder
---
# 주요 컴포넌트

### Controller

- 웹기반의 GUI 시스템
- 유저 관리
- [[#Agent]] 관리
- 부하 테스트 실시 & 모니터링
- 부하 시나리오 작성 테스트 내역을 저장하고 재활용 가능

### Agent

- 부하를 발생시키는 대상
- Controller의 지휘를 받음
- 복수의 머신에 설치해서 [[#Controller]]의 신호에 따라서 일시에 부하를 발생

# 환경 구축

## 단일 컨테이너

```sh
docker pull ngrinder/controller
```

```sh
docker run -d -v ~/ngrinder-controller:/opt/ngrinder-controller --name controller -p 80:80 -p 16001:16001 -p 12000-12009:12000-12009 ngrinder/controller
```

```sh
docker pull ngrinder/agent
```

```sh
docker run -d --name agent --link controller:controller ngrinder/agent
```

## 도커 컴포즈로 관리

```yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    container_name: prometheus-knock-in
    ports:
      - "9090:9090"
    extra_hosts:
      - "host.docker.internal:host-gateway"  # <--- 이 부분 추가
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    restart: always

  grafana:
    image: grafana/grafana
    container_name: grafana-knock-in
    ports:
      - "3000:3000"
    restart: always

  ngrinder-controller:
    image: ngrinder/controller:3.5.9-p1
    container_name: ngrinder-controller
    ports:
      - "80:80"        # nGrinder Web UI
      - "16001:16001"  # Agent 통신용 포트
      - "12000-12029:12000-12029" # 부하 테스트 제어용 포트 range
    volumes:
      - ./ngrinder-controller-data:/opt/ngrinder-controller
    restart: always

  ngrinder-agent: 
    image: ngrinder/agent:3.5.9-p1
    # container_name: ngrinder-agent # AGENT 스케일 조절을 위한 삭제
    scale: 5
    links:
      - ngrinder-controller
    restart: always
    command: ["ngrinder-controller:80"] # Controller 연결 주소 명시
    depends_on:
      - ngrinder-controller
```

### 에이전트 스케일 아웃

우선 `docker-compose.yml`에  `container_name` 미설정 확인
아래 명령어로 AGENT 스케일 아웃 가능.  

```sh
docker compose up -d --scale ngrinder-agent=3
```

아래 명령어는 초기화 없이 agent만 다시 만들기

```sh
docker compose up -d --no-deps --scale ngrinder-agent=5 ngrinder-agent
```

다소 늦게 적용될 수 있음. 조금만 기다린 후 새로고침 시 정상적으로 동작.

# 스크립트 작성

WSL/Docker에서 띄웠다면 주소는 `localhost`가 아닌 `host.docker.internal:8080`에서 띄워야 함.

```
http://host.docker.internal:8080
```

템플릿 생성 모달에는 HTTP 메서드가 `GET`과 `POST`만 지원함.

![[IMG-20260922165644926.png]]

```groovy
@Test
public void test() {
	String jsonBody = JsonOutput.toJson(body)

	HTTPResponse response = request.POST(
		"http://host.docker.internal:8080/api/v1/guest/recommendations",
		jsonBody.getBytes("UTF-8")
	)

	grinder.logger.info("status = {}", response.statusCode)
	grinder.logger.info("response = {}", response.getBodyText())

	if (response.statusCode == 301 || response.statusCode == 302) {
		grinder.logger.warn("Warning. The response may not be correct. The response code was {}.", response.statusCode)
	} else {
		assertThat(response.statusCode, is(200))
	}
}
```

# 테스트

### Ramp-UP

![[IMG-20260921185512852.png]]

# 궁금증

## 같은 VUser 수라면 요청 수도 동일한가?

또한 VUser 수와 총 요청 횟수는 별개의 개념이다. 같은 50 VUser라도 테스트 시간, 응답 시간, Think Time 등에 따라 총 요청 수는 크게 달라질 수 있다.

## Agent 수평 확장과 Docker Compose

낮은 부하에서는 하나의 Agent에서 Process/Thread를 증가시켜도 된다. 하지만 부하가 커지면 **부하 발생기 자체가 병목**이 될 수 있다.

```
부하 발생기 한계
CPU
Memory
Network
Socket
JVM / GC
        ↓
목표 서버가 아니라 nGrinder가 먼저 병목
```

따라서 높은 부하에서는 Agent를 여러 개 사용하여 부하 발생 능력을 분산시키는 것이 중요하다.

Docker Compose에서 Agent를 scale할 때 `container_name`을 고정하면 각 컨테이너에 고유한 이름을 부여할 수 없어 scale이 제한된다.

# 고민점

1. OAuth, JWT 기반 로그인 환경에서 어떻게 유저를 생성하는가?
2. 정상적인 온보딩을 마친 유저를 대상으로 테스트라면 Member 뿐만 아니라 여러 필수 데이터들이 필요.

# 출처 및 참고자료

```cardlink
url: https://notspoon.tistory.com/48
title: "nGrinder 성능테스트 사용법 및 테스트 예제"
description: "1. nGrinder nGrinder는 네이버에서 제공하는 서버 부하 테스트 오픈 소스 프로젝트이다. 애플리케이션을 개발하고 nGrinder에서 여러가지 가상 시나리오를 만들어 트래픽에 몰렸을 때 성능을 측정할 수 있도록 도와준다. 2. 구조 Controller : 사용자가 테스트 수행을 위한 스크립트를 생성하여 성능 측정을 위한 웹 인터페이스를 제공하며 테스트 결과를 수집해 통계를 보여준다. Agent : Controller의 명령을 받아 작업을 수행하며 프로세스 및 스레드를 실행시켜 타겟이 되는 애플리케이션에 부하를 발생시킨다. 3. 설치방법 Docker APP을 통해 nGrinder를 쉽게 설치할 수 있다. Docker없이 GitHub에서 Controller와 Agent를 다운받아 실행할 수도 있다.."
host: notspoon.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FzN7To%2FbtrYV9jr1jM%2FAAAAAAAAAAAAAAAAAAAAAC8achff0BLNV57DAQPAEb54o1nfWerQ4cfh0YdTDSaz%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3Dp9BGTCNNownUArI777yByKgzVO4%253D
```


