---
title: SOLID에 대한 나의 생각
---

SOLID에 대한 이론은 알고 있지만, 과연 평소에 해당 원칙들을 잘 준수하고 있는지 확인하고자 글을 작성한다.  

## SRP

단일 책임 원칙(SRP)가 잘 지켜졌는지 판단하는 근거는 무엇일까?  

SRP가 잘 지켜진 클래스는 **변경되는 이유가 하나**여야 한다.  
아래와 같은 주문 로직을 담당하는 클래스는 알람이나 로깅과 같은 다른 정책이 수정되면 같이 수정되어야 한다.  

```java
class OrderService {
    void createOrder() { ... } // 주문 정책
    void sendOrderEmail() { ... } // 알림 정책
    void saveOrderLog() { ... } // 로깅 정책
}
```

만약 Spring 기준으로 해당 서비스 클래스를 개선한다면 아래와 같이 수정될 것이다.  

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderNotificationService notificationService;

    public void createOrder(OrderRequest request) {
        Order order = Order.create(request);
        orderRepository.save(order);
        notificationService.notifyCreated(order);
    }
}
```

## OCP

만약 코드에 if-else, if-elseif-else 패턴이 많다면 OCP가 잘 준수됐는지 확인할 필요가 있다.  

예를 들어 아래와 같은 메서드는 지원하는 소셜 로그인 provider가 추가될수록 코드가 수정될 필요가 있다.  

```java
private void login(OAuth2UserRequest userRequest) {  
    ClientRegistration registration = userRequest.getClientRegistration();  
    String registrationId = registration.getRegistrationId();  
    
    if (registrationId.equals("apple")) {  
  
    } else if  (registrationId.equals("kakao")) {  
  
    } else if (registrationId.equals("naver")) {  
  
    }  
}
```




## 출처 및 참고자료

https://www.msap.ai/docs/msa-expert-from-concepts-to-practice/part-1-msa-fundamentals/msa-design-principles/msa-single-responsibility-principle/