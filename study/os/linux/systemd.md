---
date: 2026-11-14
tags:
  - OS
  - Linux
ai: true
---
# systemd 정리

systemd는 Linux의 시스템 및 서비스 관리자로, 시스템 부팅과 서비스의 시작·중지·재시작, 의존성 관리 등을 담당한다.
서비스와 같은 관리 대상을 **Unit**이라고 하며, `systemctl`로 관리하고 `journalctl`로 로그를 조회한다.

## 주요 기능

- **서비스 관리:** 서비스 시작·중지·재시작 및 자동 복구
- **의존성 관리:** 서비스 간 시작 순서와 의존 관계 설정
- **병렬 실행:** 의존성 조건을 고려하여 여러 서비스를 병렬로 시작
- **로그 관리:** `systemd-journald`를 통한 시스템 및 서비스 로그 수집
- **기타:** 소켓 활성화, 타이머, 마운트 관리 등
    

### 주요 Unit 종류

| 확장자        | 설명                     |
| ---------- | ---------------------- |
| `.service` | 애플리케이션 및 백그라운드 프로세스    |
| `.socket`  | 소켓을 통한 서비스 활성화         |
| `.timer`   | 특정 시각 또는 주기에 작업 실행     |
| `.target`  | 여러 Unit을 묶는 동기화·그룹화 대상 |
| `.mount`   | 파일시스템 마운트 관리           |

## Unit 파일 작성 방법

```
[Unit]
Description=My Simple Web Server
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 -m http.server 8000
WorkingDirectory=/home/user/web
User=user
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Unit

Unit에 대한 설명과 의존 관계를 설정한다.

- `Description=`: Unit에 대한 설명
- `After=`: 지정한 Unit보다 시작 작업이 나중에 진행되도록 순서를 설정
    - 실행 순서만 지정하며, 대상 Unit을 자동으로 시작하지는 않는다.
    - 실제 서비스가 요청을 처리할 준비까지 완료됐다는 의미는 아니다.
- `Wants=`: 다른 Unit에 대한 **약한 의존성** 설정
    - 현재 Unit 시작 시 대상 Unit의 시작을 요청한다.
    - 대상 Unit의 시작 실패가 현재 Unit의 시작을 막지 않는다.
    - 대상 Unit의 중지가 현재 Unit에 전파되지 않는다.
- `Requires=`: 다른 Unit에 대한 **강한 의존성** 설정
    - 현재 Unit 시작 시 대상 Unit의 시작을 요청한다.
    - 대상 Unit 시작이 실패하고 `After=`도 지정되어 있다면 현재 Unit의 시작도 실패한다.
    - 대상 Unit의 명시적 중지·재시작이 현재 Unit에도 전파된다.
    - 대상 Unit의 비정상 종료까지 항상 전파하는 것은 아니다.

#### Wants와 Requires 비교

|구분|`Wants=`|`Requires=`|
|---|---|---|
|의존성 강도|약함|강함|
|대상 Unit 시작 요청|O|O|
|대상 Unit 시작 실패|시작 계속 가능|`After=` 설정 시 시작 실패|
|대상 Unit 명시적 중지|중지 전파 없음|중지 전파|
|실행 순서 보장|X|X|

> `Wants=`와 `Requires=`는 의존 관계를, `After=`는 실행 순서를 정의한다.  
> 의존성이 강하다고 반드시 프로세스 생명주기까지 결합해야 하는 것은 아니다.

### Service

서비스의 실행 방식과 프로세스 관리 정책을 설정한다.

| 옵션                   | 설명                                                |
| -------------------- | ------------------------------------------------- |
| `Type=`              | 서비스 시작 완료를 판단하는 방식 (`simple`, `exec`, `notify` 등) |
| `ExecStart=`         | 실행할 명령어                                           |
| `WorkingDirectory=`  | 프로세스의 작업 디렉토리                                     |
| `User=`              | 프로세스를 실행할 사용자                                     |
| `EnvironmentFile=`   | 환경변수를 읽을 파일                                       |
| `Restart=`           | 프로세스 종료 시 재시작 정책                                  |
| `RestartSec=`        | 자동 재시작 전 대기 시간                                    |
| `SuccessExitStatus=` | 정상 종료로 취급할 추가 종료 코드·시그널                           |

**주요 Restart 정책**

- `no`: 자동 재시작하지 않음 (기본값)
- `on-failure`: 비정상 종료, 타임아웃 등의 상황에서 재시작
- `always`: 정상·비정상 종료 모두 자동 재시작

> 단, `Restart=always`를 설정해도 `systemctl stop` 등 **systemd가 의도적으로 중지한 경우에는 자동 재시작하지 않는다.**

### Install

`systemctl enable` 실행 시 Unit을 어떤 대상에 등록할지 설정한다.

- `WantedBy=multi-user.target`: 활성화할 때 `multi-user.target`이 현재 서비스를 `Wants=` 의존성으로 포함하도록 심볼릭 링크를 생성한다.
- `enable`은 부팅 시 자동 실행되도록 등록하는 작업이며, 서비스를 즉시 실행하지는 않는다.

## systemctl

systemd가 관리하는 Unit의 상태와 실행을 제어하는 명령어.

### 서비스 등록 및 시작

```
# Unit 파일 수정 후 설정 다시 읽기
sudo systemctl daemon-reload

# 부팅 시 자동 시작 등록
sudo systemctl enable my-web.service

# 즉시 서비스 시작
sudo systemctl start my-web.service

# 자동 시작 등록과 즉시 시작을 함께 수행
sudo systemctl enable --now my-web.service
```

### systemctl 명령어 모음

|명령어|설명|
|---|---|
|`systemctl status [서비스]`|서비스 상태 및 최근 로그 확인|
|`systemctl start [서비스]`|서비스 시작|
|`systemctl stop [서비스]`|서비스 중지|
|`systemctl restart [서비스]`|서비스 재시작|
|`systemctl reload [서비스]`|프로세스 유지 상태에서 서비스 자체 설정 재적용 (지원 시)|
|`systemctl enable [서비스]`|자동 시작 등록|
|`systemctl disable [서비스]`|자동 시작 등록 해제 (실행 중인 서비스는 유지)|
|`systemctl enable --now [서비스]`|자동 시작 등록 및 즉시 시작|
|`systemctl is-active [서비스]`|현재 활성 상태 확인|
|`systemctl is-enabled [서비스]`|자동 시작 등록 상태 확인|
|`systemctl cat [서비스]`|Unit 파일과 Drop-in 설정 확인|
|`systemctl show [서비스]`|systemd가 인식한 실제 속성 조회|
|`systemctl list-units --type=service`|현재 로드된 서비스 목록 조회 (기본적으로 활성 Unit 중심)|
|`systemctl list-units --type=service --all`|비활성 상태를 포함한 로드된 서비스 조회|
|`systemctl list-unit-files --type=service`|설치된 서비스 Unit 파일 및 활성화 상태 조회|
|`systemctl list-dependencies [서비스]`|의존하는 Unit 목록 확인|
|`systemctl list-dependencies --reverse [서비스]`|현재 Unit에 의존하는 Unit 확인|
|`systemctl daemon-reload`|변경된 Unit 설정 다시 읽기|
|`systemctl reset-failed [서비스]`|실패 상태 및 재시작 제한 카운터 초기화|

> [!CAUTION]
> `restart`는 재시작 작업으로 처리되며, 독립적인 `stop` 명령 후 `start` 명령을 실행하는 것과 내부적으로 완전히 동일하지는 않다. 의존성 전파에도 차이가 발생할 수 있다.

### 실무에서 유용한 명령어

```
# Unit의 최종 설정 확인
systemctl cat matchuri-backend.service

# 주요 의존성 및 재시작 정책 확인
systemctl show matchuri-backend.service \
  -p Requires -p Wants -p After -p Restart

# 설정 파일 수정 후 반영
sudo systemctl daemon-reload
sudo systemctl restart matchuri-backend.service

# Unit 설정 파일의 유효성 검사
systemd-analyze verify \
  /etc/systemd/system/matchuri-backend.service
```

## journalctl

`systemd-journald`가 수집한 시스템 및 서비스 로그를 조회하는 명령어.

### journalctl 명령어 모음

|명령어|설명|
|---|---|
|`journalctl`|조회 가능한 전체 로그|
|`journalctl -u [서비스]`|특정 서비스 로그|
|`journalctl -u [서비스] -f`|실시간 로그 추적|
|`journalctl -u [서비스] -n 100`|최근 100줄 조회|
|`journalctl -u [서비스] -p err`|오류 이상 수준의 로그만 조회|
|`journalctl -u [서비스] -b`|현재 부팅 이후 로그|
|`journalctl -b -1`|이전 부팅의 로그|
|`journalctl --list-boots`|기록된 부팅 이력|
|`journalctl -k`|커널 로그|
|`journalctl --since today`|오늘 00시 이후 로그|
|`journalctl --since "1 hour ago"`|최근 1시간 로그|
|`journalctl -u [서비스] -g 'ERROR\|Exception'`|메시지 정규식 검색|
|`journalctl -o short-iso`|ISO 8601 시각 형식으로 출력|
|`journalctl --no-pager`|페이지 뷰어 없이 출력|

일부 시스템 로그에는 `sudo` 권한이 필요하다.

### 장애 분석 시 자주 사용하는 조합

**1. 특정 서비스의 최근 로그**

```
sudo journalctl -u matchuri-backend.service \
  -n 100 --no-pager
```

**2. 특정 시간 범위의 로그**

```
sudo journalctl -u matchuri-backend.service \
  --since "2026-11-14 06:30:00" \
  --until "2026-11-14 06:45:00" \
  -o short-iso --no-pager
```

**3. 여러 서비스의 이벤트를 시간순으로 비교**

```
sudo journalctl \
  -u matchuri-backend.service \
  -u mysql.service \
  --since "2026-11-14 06:30:00" \
  --until "2026-11-14 06:45:00" \
  -o short-iso --no-pager
```

**4. 서비스 시작·중지 이력 검색**

```
sudo journalctl -u mysql.service \
  --since "2026-10-01" \
  -g 'Starting|Started|Stopping|Stopped' \
  -o short-iso --no-pager
```

**5. 실시간 로그 확인**

```
sudo journalctl -u matchuri-backend.service -f
```

`Ctrl+C`로 종료한다.

## 알아둘 점

- **현재 실행 상태와 자동 시작 등록 상태는 다르다.**
    - `active`: 현재 서비스가 실행 또는 활성 상태인가?
    - `enabled`: 자동 시작 대상으로 등록되어 있는가?
        
- **Unit 설정 재로드와 서비스 설정 재로드는 다르다.**
    - `daemon-reload`: systemd의 Unit 파일 설정 다시 읽기
    - `reload [서비스]`: 실행 중인 서비스 자체 설정 재적용
        
- **서비스 실행과 서비스 준비 완료는 다르다.**
    - 프로세스가 실행 중이어도 DB 연결 실패 등으로 정상적인 요청 처리가 불가능할 수 있다.
        
- **journalctl 로그와 애플리케이션 로그는 구분할 필요가 있다.**
    - 표준 출력·에러가 journald로 전달되도록 설정하면 `journalctl`로 애플리케이션 로그도 조회할 수 있다.

## 출처 및 참고자료

https://docs.redhat.com/ko/documentation/red_hat_enterprise_linux/7/html/system_administrators_guide/chap-managing_services_with_systemd

```cardlink
url: https://khseon7.tistory.com/26
title: "[Linux] Systemd & Journalctl"
description: "대부분의 최신 리눅스 배포판(Ubuntu, Fedora, CentOS, Debian 등)에서 systemd는 운영체제의 심장 역할을 합니다. systemd는 전통적인 SysVinit 시스템을 대체하며, 리눅스 부팅 프로세스, 시스템 서비스 관리, 그리고 이벤트 로깅 방식을 근본적으로 변화시켰다.이 글에서는 현대 리눅스 관리자 및 사용자에게 필수적인 두 가지 핵심 도구, 즉 Systemd와 그 로깅 인터페이스인 Journalctl에 대해 자세히 알아보자.1. Systemd 이해하기 (Systemd: The Init System)systemd는 단순히 시스템을 부팅하는 프로그램이 아니라, 시스템의 초기화(Init) 과정부터 종료까지 전체 수명 주기를 관리하는 포괄적인 시스템 및 서비스 관리자이다.⚙️ Sys.."
host: khseon7.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Ftistory_admin%2Fstatic%2Fimages%2FopenGraph%2Fopengraph.png
```

```cardlink
url: https://cumulus.tistory.com/158
title: "Linux systemd 완전 정복하기"
description: "systemd리눅스 시스템 관리에 있어서 systemd는 중요한 구성 요소 중 하나입니다. 이 글에서는 systemd가 무엇인지, 그리고 systemd에서 사용하는 유닛 파일들에 대해 자세히 알아보겠습니다.systemd란? systemd는 리눅스 시스템과 서비스 관리자로, 초기화 시스템(init), 시스템 서비스 관리자, 그리고 세션 관리자의 역할을 합니다. 대부분의 최신 리눅스 배포판에서는 기본 초기화 시스템으로 systemd를 사용합니다. systemd는 시스템의 부팅 과정을 책임지며, 시스템이 가동되는 동안 서비스들을 시작, 중지, 관리합니다.systemd의 주요 기능병렬 처리: systemd는 서비스들을 병렬로 시작합니다. 이는 시스템의 부팅 시간을 단축시킵니다.유닛 파일: 서비스, 소켓, 디바이.."
host: cumulus.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbWERet%2FbtsHhQHn4Hp%2FAAAAAAAAAAAAAAAAAAAAAO24D03Oyr99HWLQdefFWeu0ozgOYSFOfZtdCt6IRHCf%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3D9%252FOLHLBI9IGdu%252ByRFgkDyi64RYM%253D
```
