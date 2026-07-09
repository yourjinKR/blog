---
title: HTTP
---
# HTTP (HyperText Transfer Protocol)

웹에서 클라이언트와 서버 간에 데이터가 교환되는 방식을 정의하는 핵심 인터넷 [[protocol|프로토콜]]입니다.

- 웹 브라우저와 웹 서버 간의 통신을 가능하게 합니다.
- 월드 와이드 웹에서 데이터 전송의 기반을 형성합니다.
- 시스템 간 데이터 요청 및 전달에 대한 규칙을 정의합니다.

> 본래 HTTP는 문서 전송이 주 목적이었으나 현재는 모든 바이너리 데이터를 전송하는데 사용

## HTTP Message

![[Pasted image 20260710020154.png]]

### Request Messsage

1. start line: [[http-method|method]] + path + http version
2. [[http-header|header]]: http 전송에 필요한 모든 부가정보를 갖는다
3. empty line
4. message [[http-body|body]]: 응답 본문

### Response Message

1. Status Line: http version + [[http-status#상태 코드|status code]] + reason-phase
2. Response Headers
3. empty line: 요청에 대한 모든 메타 정보가 전송되었음을 알림
4. Response Message Body

## 특징

- **무상태**: 각 요청은 독립적이며 서버는 이전 상호 작용 정보를 저장하지 않습니다.
- **비연결성**: 클라이언트와 서버가 한 번 연결을 맺은 후 요청-응답을 마친 후 연결을 끊는다.
- **텍스트 기반:** 메시지는 일반 텍스트 형식이므로 읽고 디버깅하기 쉽습니다.
- **클라이언트-서버 모델:** 리소스 요청 및 제공에 있어 클라이언트-서버 아키텍처를 따릅니다.
- **요청-응답 방식:** 클라이언트와 서버 간의 요청-응답 주기를 기반으로 작동합니다.
- **요청 메서드:** 리소스에 대한 다양한 작업을 위해 `GET`, `POST`, `PUT`, `DELETE`와 같은 다양한 메서드를 지원합니다.

#### 무상태성

- 서버는 클라이언트의 상태를 보존하지 않는다.  
- 서버를 클라이언트로부터 무상태로 관리한다면 서버에 대한 유연한 확장이 가능하다. 
- 그러나 모든 기능들을 무상태로 관리하는데에는 한계가 존재한다.  
- 이러한 문제를 해결하기 위해 쿠키, 세션, JWT등이 주로 활용된다.  

#### 비연결성

- HTTP는 불특정 다수의 통신 환경을 기반으로 설계됐다.
- 서버가 다수의 클라이언트와 연결을 계속 유지시, 이에 따른 리소스가 지속적으로 발생한다.
- 연결을 유지하기 위한 리소스를 줄여 더 많은 연결을 할 수 있다.
- TCP의 [[tcp#TCP 3-way Handshake|3-way Hanshake]] 과정에서 지속적인 오버헤드 발생한다.
- 이에 대한 해결책으로 오버헤드를 줄이기 위해 [[http-keep-alive|HTTP Keep Alive]] 속성을 사용한다.

#### 클라이언트 서버 구조

- 클라이언트 서버에 요청을 보내고, 응답을 대기
- 서버가 요청에 대한 결과를 만들어서 응답

## 출처 및 참고자료

https://www.geeksforgeeks.org/html/what-is-http/  
https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages  
