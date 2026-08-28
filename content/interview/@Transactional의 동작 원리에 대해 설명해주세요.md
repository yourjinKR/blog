---
tags:
  - 면접
  - 스터디
  - Spring
---
`@Transactional`은 Spring AOP와 프록시를 기반으로 [[Transaction|트랜잭션]]을 처리합니다.

Spring은 `@Transactional`이 적용된 빈을 등록할 때 해당 빈의 프록시 객체를 생성합니다. 외부에서 메서드를 호출하면 실제 객체가 아닌 프록시가 먼저 호출을 가로챕니다.

프록시는 `TransactionManager`를 통해 트랜잭션을 시작하고, 실제 대상 메서드를 호출합니다. 메서드가 정상적으로 종료되면 트랜잭션을 커밋하고, 예외가 발생하면 롤백 여부를 판단하여 롤백합니다. 기본적으로 `RuntimeException`과 `Error`가 발생하면 롤백하지만, 체크 예외는 롤백하지 않습니다.

> JPA 환경에서는 일반적으로 `JpaTransactionManager`가 현재 스레드에 `EntityManager`를 연결하고, 같은 트랜잭션 안에서 수행되는 작업들이 동일한 영속성 컨텍스트를 사용하도록 관리합니다. 트랜잭션이 커밋될 때 변경 감지와 플러시가 수행되고, 이후 실제 데이터베이스 트랜잭션이 커밋됩니다.

따라서 `@Transactional`은 단순히 커밋과 롤백을 수행하는 어노테이션이 아니라, 프록시와 AOP를 이용해 트랜잭션의 시작과 종료, 전파, 격리 수준, 롤백 정책 등을 선언적으로 관리하는 기능입니다.

주의할 점은 프록시를 거쳐야 동작한다는 것입니다. 같은 클래스 내부에서 `this`로 메서드를 호출하는 자기 호출은 프록시를 거치지 않으므로, 호출되는 메서드의 `@Transactional` 설정이 별도로 적용되지 않습니다.

```java
// 예시
@Service
public class OrderService {

    @Transactional
    public void createOrder() {
        saveOrder();
    }

    @Transactional(
        propagation = Propagation.REQUIRES_NEW,
        readOnly = true,
        isolation = Isolation.SERIALIZABLE,
        rollbackFor = Exception.class
    )
    public void saveOrder() {
        // ...
    }
}
```

> [!QUESTION]- private 메서드에 트랜잭션 어노테이션을 붙이면 어떤 일이 일어나는가요?
> "트랜잭션이 전혀 적용되지 않습니다. Spring Boot는 기본적으로 CGLIB 방식을 사용하여 타겟 클래스를 상속(Inheritance)받아 메서드를 오버라이딩하는 방식으로 프록시를 생성합니다. 하지만 자바에서 private 메서드는 하위 클래스에서 오버라이딩할 수 없기 때문에, 프록시 객체가 트랜잭션 처리 로직을 주입할 수 없습니다. 따라서 에러가 발생하지는 않지만, 트랜잭션이 없는 상태로 원본 메서드가 그냥 실행되게 됩니다."   
