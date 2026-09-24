---
tags:
  - OS
aliases:
  - 데드락
---
데드락이란 두 개 이상의 프로세스나 스레드가 서로 자원을 얻지 못해서 다음 처리를 하지 못하는 상태를 말한다.  ^intro

## 발생조건

4가지 조건을 모두 충족시켰을 때 데드락이 발생한다.  

1. 상호배제
2. 점유 대기
3. 비선점
4. 순환 대기

### 상호배제 (Mutual Exclusion)

자원은 한번에 한 프로세스만 사용할 수 있다.  

### 점유 대기 (Hold and Wait)

최소한 하나의 자원을 점유하고 있으면서 다른 프로세스에 할당되어 사용하고 있는 자원을 추가로 점유하기 위해 대기하는 프로세스가 존재해야 한다.  

### 비선점 (No Preemption)

다른 프로세스에 할당된 자원은 사용이 끝날 때까지 강제로 빼앗을 수 없다.  

### 순환 대기 (Circular Wait)

프로세스의 집합에서 순환 형태로 자원을 대기하고 있어야 한다.  

## 데드락 해결 방법

아래 해결 방식 중에 온전한 해결 방법은 존재하지 않는다.  

1. 데드락 방지
2. 데드락 회피
3. 데드락 감지와 복구

### 데드락 방지

네 가지 조건 중 하나가 충족되지 않게 시스템을 디자인한다.  
리소스 낭비가 많이 발생하는 방식이다.  

- 상호배제 부정: 여러 프로세스가 리소스를 공유 가능하게 한다.
- 점유대기 부정: 사용할 리소스들을 모두 획득 후 시작, 리소스를 전혀 가지지 않는 상태에서만 리소스 요청
- 비선점 부정: 추가적인 리소스를 기다려야 한다면 이미 획득한 리소스를 다른 프로세스가 선점 가능하도록 한다
- 순환대기 부정:  모든 리소스에 순서 체계를 부여하여 오름차순으로 리소스를 요청 (가장 주로 사용)

### 데드락 회피

실행 환경에서 **추가적인 정보**를 활용하여 데드락이 발생할 것 같은 상황을 회피하는 것이다.  

#### Banker Algorithm

은행원 알고리즘은 리소스 요청을 허락해줬을 때 데드락이 발생할 가능성이 있다면 리소스를 할당해도 이전할 때 까지 계속 요청을 거절하는 알고리즘이다.  

> [!CAUTION]
> Banker Algorithm은 교착 상태를 회피하는 방법이지 해결하는 방법은 아니다.  

%%%%
### 데드락 감지와 복구

데드락을 허용하고 데드락이 발생하면 복구하는 전략이다.  
복구 방식은 크게 2가지 방법이 있다.  
#### 프로세스를 종료

1. 데드락에 빠진 모든 프로세스를 종료
2. 프로세스 하나씩 강제로 종료 (교착상태가 해결될때까지)

#### 리소스 일시적인 선점 허용

1. 교착 상태의 프로세스가 점유하고 있는 자원을 선점해 다른 프로세스에게 할당 (해당 프로세는 일시정지)
2. 우선 순위가 낮은 프로세스나 수행 횟수 적은 프로세스 위주로 프로세스 자원 선점

### 데드락 무시

데드락이 일어나지 않는다고 생각하고 아무런 조치도 취하지 않는 방식이다.  

- 데드락 자체는 매우 드물게 발생하므로 데드락에 대한 조치 자체가 더 큰 오버헤드이다.  
- 데드락이 발생할 경우 사람이 직접 프로세스를 죽이는 방법으로 대체
- UNIX, Windows 등 대부분의 범용 OS가 채택

## 출처 및 참고자료

```cardlink
url: https://gyoogle.dev/blog/computer-science/operating-system/DeadLock.html
title: "데드락 (DeadLock, 교착 상태) | 👨🏻‍💻 Tech Interview"
description: "Ready for Tech-Interview"
host: gyoogle.dev
favicon: https://gyoogle.dev/blog/images/logo.png
```

```cardlink
url: https://www.youtube.com/watch?v=ESXCSNGFVto&list=PLcXyemr8ZeoQOtSUjwaer0VMJSMfa-9G-&index=7
title: "BJ.13 데드락(교착상태)은 프로그램에 치명적이죠 T^T 언제 발생하고 어떻게 해결하는지 살펴봅시다~! 간단한 자바 예제도 있어요~!!"
description: "#데드락 #교착상태 #deadlock한정된 자원을 서로 사용하려다가 데드락(deadlock, 교착상태)에 빠지곤 합니다.이 상태에 빠지면 이후로 아무것도 진행할 수가 없죠..이런 현상이 언제 발생하는지, 그리고 어떻게 해결하는지를 살펴봅니다운영체제가 취하는 몇 가지 해결 전략과, ..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/f82dea74/img/favicon_32x32.png
image: https://i.ytimg.com/vi/ESXCSNGFVto/maxresdefault.jpg
```

```cardlink
url: https://www.geeksforgeeks.org/operating-systems/bankers-algorithm-in-operating-system-2/
title: "Banker's Algorithm - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```

```cardlink
url: https://core.ewha.ac.kr/publicview/C0101020140415131030840772?vmode=f
title: "이화여자대학교 :: CORE Campus"
host: core.ewha.ac.kr
```
