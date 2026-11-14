---
date: 2026-11-14
tags:
  - 맛추리
  - Linux
  - Ubuntu
---
## 문제 상황

어느날 서버의 알람이 울렸고 서버가 완전히 죽어 있는 것을 발견했다.  
모니터링에서는 별다른 지표는 확인되지 않았다.  

```cardlink
url: https://gallantheron1687.grafana.net/dashboard/snapshot/T8FnNwuxFY77G77bsj1mWRKcNfSpfmKP?from=2026-11-13T21:04:29.912Z&to=2026-11-13T22:16:44.360Z&timezone=browser&refresh=1m
title: "Grafana"
host: gallantheron1687.grafana.net
favicon: https://grafana-assets.grafana.net/grafana/13.4.0-42974521621/public/build/img/fav32.png
```

장애 시점의 로그를 보며 원인을 파악하기 시작했다.  

```sh
sudo journalctl   --since "2026-11-14 06:30:00"   --until "2026-11-14 06:45:00"   -o short-iso   --no-pager
```

```sh
sudo journalctl   --since "2026-11-14 06:30:00"   --until "2026-11-14 06:45:00"   -o short-iso   --no-pager | grep "upgrade"
```

![[IMG-20261114205204218.png]]

![[IMG-20261114205229395.png]]

자동 업데이트 시작 → `backend.service` 종료 → MySQL 서비스도 종료 → systemd 설정 재로드 →  
MySQL 서비스 재시작 → systemd 자체 재실행 → Nginx 등 여러 시스템 서비스 재시작

`unattended-upgrades-dpkg.log`애서는 재시작 로그를 확인 가능

```
592: /etc/needrestart/restart.d/dbus.service
632: /etc/needrestart/restart.d/dbus.service
709: /etc/needrestart/restart.d/dbus.service
749: /etc/needrestart/restart.d/dbus.service
774: /etc/needrestart/restart.d/dbus.service
799: /etc/needrestart/restart.d/dbus.service
```

> MySQL은 다시 시작했지만, **`matchuri-backend.service`가 재시작되는 로그가 확인되지 않음**

```
2026-11-14T06:37:32+09:00 ip-XXX-XX-XX-XX systemd[1]: Starting apt-daily-upgrade.service - Daily apt upgrade and clean activities...
```

## 해결 방법 – 의존성 설정 변경

기존에는 `Requires` 설정으로 DB와 Application 각각의 Unit이 강하게 결합되어 있었다.   

```
[Unit]
Description=Matchuri Backend Spring Boot Service
After=network.target mysql.service
Requires=mysql.service
```

이를 `After`로 변경하였다.  

```
[Unit]
Description=Matchuri Backend Spring Boot Service
After=network.target mysql.service
Wants=mysql.service
```

[[systemd#Wants와 Requires 비교|Wants와 Requires 비교]]를 하자면 다음과 같다.  

| 구분             | `Wants=`    | `Requires=`         |
| -------------- | ----------- | ------------------- |
| 의존성 강도         | 약함          | 강함                  |
| 의존 대상 자동 시작 요청 | O           | O                   |
| 의존 대상 시작 실패    | 시작 작업 계속 가능 | `After=` 설정 시 시작 실패 |
| 의존 대상 명시적 중지   | 중지 전파 없음    | 중지 전파               |

## 약한 의존성으로 설정하는게 맞을까?

만약 Redis와 같은 캐시 레이어와 같은 경우는 강한 의존성 결합이 피하는게 맞다고 생각하지만  DB와 Server는 아키텍처 구조상 강한 의존성을 가지는데 그런 점에서 과연 약한 의존성(`Wants`)로 설정하는 것이 맞는지 의문이었다.  

앞서 언급한거와 같이 기능적 의존성만 본다면 강한 의존성(`Requires`)으로 설정하는 것이 맞다고 생각한다.  
그런데 각 요소의 생명주기 의존성 관점에서도 동일한지에 대해 고민할 필요가 있다.  

> DB 중지 시 멀쩡한 Application도 종료시키는가?

DB가 멈추더라도 Application은 다음과 같이 동작한다.  

1. JVM 및 Tomcat 프로세스는 정상 실행 중
2. DB에 접근하는 API는 일시적으로 실패
3. DB와 무관한 요청은 정상 처리 가능
4. MySQL 복구 후 커넥션 풀이 연결을 다시 확보하면 DB 기능도 복구 가능

> 오히려 약하게 의존성을 설정한다면 모니터링 시스템을 구축했기에 모니터링 레벨에서 2번과 같은 현상이 발생시 DB의 장애를 빠르게 파악할 수 있을 것이다. 반면 이전처럼 Application까지 전부 내려버리면 모니터링 레벨에서 확인할 수 있는게 전혀 없다.  

Spring Boot 공식문서에서도 Liveness와 Readiness를 구분한다.  
특히 Liveness는 DB와 같은 외부 시스템의 상태에 의존하지 않도록 권장한다.  

```cardlink
url: https://docs.spring.io/spring-boot/3.5/reference/actuator/endpoints.html?utm_source=chatgpt.com
title: "Endpoints :: Spring Boot"
host: docs.spring.io
favicon: ../../../_/img/favicon.ico
```

## 강한 의존성으로는 관리할 수 없는가?

이전에도 일일 업데이트로 인해 restart하는 경우는 있었으나 문제는 없었다.  
지금과 같은 경우는 패키지 자체가 업데이트 되었기에 명시적으로 stop 후 재시작하는 과정을 거쳤다.  
그 과정에서 정지 전파가 Application까지 이어졌으나 재실행에 대해서는 전파되지 않았기에 문제가 발생한 것이다.  

패키지 업데이트에 의해 백엔드가 중지된 이후의 복구까지 설계 프로세스를 구축할 필요가 있다.  

그 보다는 DB와 Application의 생명주기를 별개로 관리(약한 의존성)하고 만약 Application이 멀쩡하고 DB가 멈춘 상태를 빠르게 파악하기 위한 모니터링 환경만 강화한다면 큰 문제가 없을 것이라고 생각한다.  

## 결론

2026년 11월 14일 Ubuntu의 자동 패키지 업데이트 과정에서 MySQL 서버 패키지 업그레이드가 수행되었다. MySQL 패키지의 유지보수 스크립트에는 명시적인 서비스 중지 명령이 존재하며, 실제 로그에서도 MySQL과 Spring Boot가 함께 중지된 것을 확인했다.

이후 MySQL은 정상적으로 복구되었으나, `Requires=mysql.service` 의존성에 따라 중지됐던 Spring Boot에 별도의 시작 작업이 수행되지 않아 서비스 장애가 지속된 것으로 분석했다.


## 출처 및 참고자료

```cardlink
url: https://jcdgods.tistory.com/684
title: "systemd Wants와 Requires 기준 정리"
description: "본문 중간의 쿠팡 추천 상품 구매시 쿠팡 파트너스에서 일정액의 수수료를 제공받습니다.systemd Wants와 Requires 기준 정리Wants=와 Requires=는 둘 다 다른 unit을 함께 끌어오는 dependency 설정이지만, 실패와 중지 상황을 다루는 강도가 다르다. 2026년 7월 29일 확인 기준 freedesktop.org의 최신 systemd.unit 문서는 Wants=를 weak requirement dependency, Requires=를 그보다 강한 requirement dependency로 설명한다.실무에서 자주 헷갈리는 지점은 두 가지다. 첫째, 둘 다 \"같이 시작하자\"에 가깝지 \"먼저 시작하자\"는 아니다. 둘째, Requires=를 쓴다고 해서 상대 unit이 항상 살아 .."
host: jcdgods.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FkCQAB%2FdJMcad3UZlr%2FAAAAAAAAAAAAAAAAAAAAAO_vjx2vHXIfSeP651nIx6ichGhT7OSg-MwMeYqfLXop%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3DPeHVRUfU7gZe7C241NK8r%252Bra4vQ%253D
```

```cardlink
url: https://man7.org/linux/man-pages/man5/systemd.unit.5.html?utm_source=chatgpt.com#[UNIT]_SECTION_OPTIONS
title: "systemd.unit(5) - Linux manual page"
host: man7.org
```

```cardlink
url: https://ubuntu.com/server/docs/how-to/software/automatic-updates/
title: "Automatic updates"
description: "Ubuntu will apply security updates automatically, without user interaction. This is done via the unattended-upgrades package, which is installed by default. But as the name suggests, it can apply o..."
host: ubuntu.com
image: https://assets.ubuntu.com/v1/cc828679-docs_illustration.svg
```
