---
tags:
  - Intellij
  - Gradle
---
IntelliJ에서 `build.gradle.kts`의 `implementation`, `testImplementation` 등이 `Unresolved reference`로 표시되고 있었다.  

![[IMG-20260929175948025.png]]

실제 Gradle 빌드는 정상적으로 동작하며 새로고침을 반복해도 여전히 동일한 문제가 발생했다.  

그래서 빌드 싱크 과정을 보니 다음과 같은 로그가 있었다.  

![[IMG-20260929184627669.png]]


## 문제 원인

Gradle 자체 오류가 아니라 IntelliJ와 Gradle 버전 간 호환성 문제였다.  

## 해결 방법

```sh
.\gradlew.bat wrapper --gradle-version 8.14.5
```

```sh
.\gradlew.bat --version
```

![[IMG-20260929183706204.png]]

이후 정상적으로 동작 확인

![[IMG-20260929184305727.png]]

## 출처 및 참고자료

```cardlink
url: https://chatgpt.com/share/6abb8929-fe50-83ee-b859-49b6bd7c078a
title: "Check out this chat"
description: "Here's a chat someone thought you'd want to see."
host: chatgpt.com
favicon: https://chatgpt.com/favicon.ico
image: https://ogimg.chatgpt.com/conversation/6abb8929-fe50-83ee-b859-49b6bd7c078a/response_multicolor_v1.png
```
