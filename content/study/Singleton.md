---
tags:
  - DesignPattern
aliases:
  - 싱글톤
---
**싱글턴**은 클래스에 인스턴스가 하나만 있도록 하면서 이 인스턴스에 대한 전역 접근​ 지점을 제공하는 생성 디자인 패턴입니다.  

- **유일한 인스턴스 보장**: `new` 연산자를 여러 번 호출해도 최초 생성된 단 하나의 객체만 재사용하므로 메모리 낭비 방지
- **전역적인 접근**: 프로그램 내 어디서나 동일한 인스턴스에 쉽게 접근할 수 있어 데이터 공유가 편리
- **높은 결합도**: 전역 객체이기 때문에 다른 클래스들 간의 결합도가 증가
- **테스트의 어려움**: 독립적인 단위 테스트(Unit Test)를 수행하기가 까다롭다
- **멀티스레드 동기화 문제**: 멀티스레드 환경에서는 동시에 인스턴스를 생성하려다 여러 개가 만들어질 수 있으므로 별도의 동기화 처리가 필요

%%%%
## Java 구현 방식

다른 객체들이 싱글턴 클래스와 함께 `new` 연산자를 사용하지 못하도록 디폴트 생성자를 비공개로 설정

```java
public class Singleton {  
    private Singleton() { }  
}
```

생성자 역할을 하는 정적 생성 메서드를 만드세요. 내부적으로 이 메서드는 객체를 만들기 위하여 비공개 생성자를 호출한 후 객체를 정적 필드에 저장합니다.

```java
public class Singleton {  
    private static final Singleton instance = new Singleton();  
  
    private Singleton() { }  
  
    public static Singleton getInstance() {  
        return instance;  
    }  
}
```

이 메서드에 대한 그다음 호출들은 모두 캐시된 객체를 반환합니다.

```java
Singleton instance = Singleton.getInstance();
```

> 이 외로도 다양한 생성 기법은 [해당 페이지](https://gist.github.com/yourjinKR/7176a1a9bf6d07b9fa9cce6da7c1d8b9)에서 참고

### 문제점

Java로 기본적인 싱글톤 패턴을 구현하고자 하면 다음과 같은 단점들이 발생한다.  

- `private` 생성자를 갖고 있어 상속이 불가능하다.
- 테스트하기 힘들다.
- 서버 환경에서는 싱글톤이 1개만 생성됨을 보장하지 못한다.
- 전역 상태를 만들 수 있기 때문에 객체지향적이지 못하다.

## 출처 및 참고자료

```cardlink
url: https://mangkyu.tistory.com/151
title: "[Spring] 애플리케이션 컨텍스트(Application Context)와 스프링의 싱글톤(Singleton)"
description: "이번에는 애플리케이션 컨텍스트에 대해 간단히 알아보도록 하겠습니다. 1. 애플리케이션 컨텍스트(Application Context) [ 애플리케이션 컨텍스트(Application Context)란? ] Spring에서는 빈의 생성과 관계설정 같은 제어를 담당하는 IoC(Inversion of Control) 컨테이너인 빈 팩토리(Bean Factory)가 존재한다. 하지만 실제로는 빈의 생성과 관계설정 외에 추가적인 기능이 필요한데, 이러한 이유로 Spring에서는 빈 팩토리를 상속받아 확장한 애플리케이션 컨텍스트(Application Context)를 주로 사용한다. 애플리케이션 컨텍스트는 별도의 설정 정보를 참고하고 IoC를 적용하여 빈의 생성, 관계설정 등의 제어 작업을 총괄한다. 애플리케이션 컨텍.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbMJKcD%2Fbtq4p73lmRj%2FAAAAAAAAAAAAAAAAAAAAALjLob5_QJZ8DxLKW7qkbWHJgOPkWNoksxynJXcksizv%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DBBY4Wj6kM%252BD3Wwuqf4N0bIp6izw%253D
```


```cardlink
url: https://refactoring.guru/ko/design-patterns/singleton
title: "싱글턴 패턴"
description: "싱글턴은 클래스에 인스턴스가 하나만 있도록 하면서 이 인스턴스에 대한 전역 접근(액세스) 지점을 제공하는 생성 디자인 패턴입니다."
host: refactoring.guru
favicon: https://refactoring.guru/favicon.png
image: https://refactoring.guru/ko/images/refactoring/social/facebook-share-preview.png?id=dbf9e98269595be86eb668f365be6868
```
