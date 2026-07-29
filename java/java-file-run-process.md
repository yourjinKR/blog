---
title: 자바 파일을 실행하는 과정
date: 2026-07-29
---
## 실행 과정

![[Pasted image 20260729173812.png]]

- Java 언어로 소드코드를 작성한다. (`Test.java`)
- 자바 컴파일러가 해당 Java파일을 컴파일 하여 바이트 코드로 만든다. (`Test.class`)
- 컴파일된 class 파일은 [[jvm|JVM]]의 클래스 로더에게 전달됩니다.  
- 클래스 로더는 동적 로딩을 통해 필요한 클래스를 JVM의 메모리에 올린다.
- 실행 엔진은 JVM 메모리에 올라온 코드를 interpreter와 [[jit-compiler|JIT Compiler]]로 해석한다.

## 코드로 확인하기

`.java` 파일을 컴파일한다.  

```java
javac Test.java
```

`.class` 파일을 실행한다.  

```java
java Test
```

> [!INFO]
> IDE에서 자바 코드를 실행하면 `.class` 파일이 같은 폴더에 생성되는 것이 아닌 특정 경로로 저장되어 소스코드와 컴파일된 결과물을 엄격하게 분리하여 관리한다.  
> 
> - **일반적인 인텔리제이 프로젝트 (IntelliJ IDEA):** `out/production/프로젝트명/패키지경로/`
> - **Gradle 프로젝트:** `build/classes/java/main/패키지경로/`
> - **Maven 프로젝트:** `target/classes/패키지경로/`

%%  %%

## 출처 및 참고자료

https://steady-snail.tistory.com/67#%EC%8B%A4%ED%96%89_%EC%97%94%EC%A7%84(Execution_Engine)  
https://icea.tistory.com/50  
