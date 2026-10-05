---
date: 2026-10-05
tags:
  - Spring
aliases:
  - BPP
  - 빈 전처리기
---
`BeanPostProcessor`는 [[Spring Bean|빈]]의 생명주기에 접근하여 구성을 수정할 수 있는 기능을 제공하는 인터페이스이다.  ^intro

객체 조작 및 완전히 다른 객체로 바꿔치기할 수 도 있다. (프록시 객체)  

- `postProcessBeforeInitialization()`: 전처리
- `postProcessAfterInitialization()`: 후처리

![[IMG-20260929200234630.png]]

> 위 사진은 `BeanPostProcessor`의 default 메서드이다.   
> 리턴 타입이 `Object`로 매개변수로 받은 객체와 타입이 일치하지 않아도 동작한다.  

## 예시

`CodeService`를 구현한 `CodeServiceImpl`가 있기에 API 호출시 랜덤 UUID를 반환할 것이다.  

```java
@Service  
public class CodeServiceImpl implements CodeService {  
  
    @Override  
    public String generate() {  
        return UUID.randomUUID().toString();  
    }  
}
```

그러나 `BeanPostProcessor`를 사용하여 빈 저장소에 등록하기 전에 가로채어 로직을 제어할 수 있다.  

```java
@Configuration  
public class CodeServiceProxyConfig {  
  
    @Bean  
    public BeanPostProcessor codeService(){  
        return new BeanPostProcessor() {  
            @Override  
            public @Nullable Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {  
                if (bean instanceof CodeService){  
                    return new CodeService() {  
                        @Override  
                        public String generate() {  
                            return "123456";  
                        }  
                    };  
                }  
                return bean;  
            }  
        };  
    }  
}
```



## 출처 및 참고자료

```cardlink
url: https://www.baeldung.com/spring-beanpostprocessor
title: "Spring BeanPostProcessor | Baeldung"
description: "Learn how we can use Spring's BeanPostProcessor to customize the beans themselves."
host: www.baeldung.com
favicon: https://www.baeldung.com/wp-content/themes/baeldung/favicon/favicon.ico
image: https://www.baeldung.com/wp-content/uploads/2016/10/social-Spring-On-Baeldung-3.jpg
```
