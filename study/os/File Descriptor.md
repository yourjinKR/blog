---
date: 2026-11-19
tags:
  - OS
  - Linux
aliases:
  - FD
  - 파일 디스크립터
---
컴퓨터 프로그래밍 분야에서 File Descriptor는 특정한 파일에 접근하기 위한 추상적인 키이다. 이 용어는 일반적으로 POSIX 운영 체제에 쓰인다. 마이크로소프트 윈도우와 C 표준 입출력 라이브러리 환경에서 파일 핸들이라는 말이 선호되지만 후자의 경우 기술적으로 다른 객체이다.  

## Unix File Descriptor

Unix OS에서 **네트워크 소켓**과 같은 **파일**이나 기타 **입력/출력 리소스**에 액세스하는 데 사용되는 **추상표현**이다.
현대의 유닉스는 일반적으로 파일 서술자에 다음과 같은 연산자를 제공한다.  

> _즉, 시스템으로 부터 할당받은 **파일이나 소켓을 대표하는 정수다.**_

파일 디스크립터가 단순히 숫자인 이유는 프로세스가 유지하고 있는 **file descriptors** **테이블의 인덱스**이기 때문이다.  

## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%BC_%EC%84%9C%EC%88%A0%EC%9E%90
title: "파일 서술자 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
image: https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Stdstreams-notitle.svg/1280px-Stdstreams-notitle.svg.png?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=thumbnail
```

```cardlink
url: https://code4human.tistory.com/123
title: "파일 디스크립터(File Descriptor)란?"
description: "파일 디스크립터 (FD, File Descriptor)란, Unix OS에서 네트워크 소켓과 같은 파일이나 기타 입력/출력 리소스에 액세스하는 데 사용되는 추상표현이다. 즉, 시스템으로 부터 할당받은 파일이나 소켓을 대표하는 정수다. 파일 디스크립터는 음이 아닌 정수(Non-negative Integer)로, 일반적으로 형식 int로 C 프로그래밍 언어로 표현된다(음수 값은 \"무값\" 또는 오류 조건을 나타내기 위해 예약된다). (Window에서는 file handle이라고 부르고 값은 랜덤하게 할당된다.) FD의 0번에서 2번까지는 고정되어 있다. (unistd.h 헤더파일에 명시) 각 Unix 프로세스는 세 가지 standard streams에 해당하는 고정된 standard POSIX file des.."
host: code4human.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbtHbGM%2FbtqKMyY3I1H%2FAAAAAAAAAAAAAAAAAAAAAAqgvUXiJYXPTkvIyI362dOK74xaMFmQnlXjLSPd3iX6%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3DB5iYBB3zDR8u7Ibl2mwJ5GRxvHo%253D
```
