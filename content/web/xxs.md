---
title: XXS
aliases:
  - XXS
  - Cross-site scripting (XSS)
---
# XXS

공격자가 웹 사이트에 **악성 클라이언트 측 코드를 주입**할 수 있는 보안 공격이다.  

> 크로스 사이트 스크립팅 (XSS)은 공격자가 웹사이트에 악성 클라이언트 사이드 코드를 삽입할 수 있도록 하는 보안 취약점 공격입니다. 이 악성 코드는 피해자에 의해 실행되며 공격자가 접근 제어를 우회하고 사용자로 위장할 수 있게 만들어 줍니다. 오픈 웹 애플리케이션 보안 프로젝트에 따르면, XSS는 2017년에 7번째로 흔한 웹 앱 취약점이었습니다.
> 
> https://developer.mozilla.org/ko/docs/Glossary/Cross-site_scripting  

## 공격종류

### Reflected

- 입력값을 그대로 리턴하는 기능에 요청값에 악성 JS 코드를 심어 악성 코드가 로딩   

#### 해결 방법

1. 클라이언트로부터 받은 요청 값에 JS 값이 포함됐는지 검증
2. 이스케이프 처리

### DOM based XSS

- 프론트의 입력값에 악성 JS 코드를 넣어 그 값이 DOM에 로딩

#### 해결 방법

```javascript
element.innerHTML = userInput; 
element.textContent = userInput;
```

### Stored XSS

- 악성 코드를 특정 데이터에 저장하여 해당 데이터를 불러오는 과정에서 악성 코드를 실행

#### 해결 방법

1. 입력단에서 검증
2. 서버에서 게시글을 응답하기 전 이스페이스 시퀀스가 빠진 악성 JS를 제거
3. CSP 설정



## 출처 및 참고자료

https://www.youtube.com/watch?v=pHCBBt_yRBI