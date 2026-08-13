---
title: Spring DI
tags:
  - Spring
---
## Spring의 의존성 주입

의존성 주입은 객체가 생성자 인자, 팩토리 메서드 인자, 또는 객체 인스턴스가 생성되거나 팩토리 메서드에서 반환된 후 설정되는 속성을 통해서만 의존성을 정의하는 프로세스입니다. 컨테이너는 빈을 생성할 때 이러한 의존성을 주입합니다. 이 프로세스는 근본적으로 빈 자체가 클래스의 직접 생성이나 서비스 로케이터 패턴을 사용하여 의존성의 인스턴스화 또는 위치를 직접 제어하는 ​​방식의 정반대입니다(그래서 '제어의 역전'이라는 이름이 붙었습니다).

DI(Dependency Injection) 원칙을 사용하면 코드가 더 깔끔해지고, 객체에 필요한 의존성이 제공될 때 결합도 감소 효과가 더욱 커집니다. 객체는 의존성을 직접 찾아볼 필요가 없으며, 의존성의 위치나 클래스를 알 필요도 없습니다. 결과적으로, 특히 의존성이 인터페이스나 추상 기본 클래스에 기반한 경우, 단위 테스트에서 스텁이나 모의 구현을 사용할 수 있어 클래스 테스트가 훨씬 쉬워집니다.

> [!INFO]
> 위 글은 [Spring의 공식 문서](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)를 참고했습니다.  

%%%%
## @Autowired

필요한 의존 객체의 “타입"에 해당하는 빈을 찾아 주입하는 어노테이션

## 주요 주입 방식

대표적인 의존성 주입 방식은 다음과 같다.  

- 생성자 주입
- setter 주입
- 필드 주입

### 생성자 주입

생성자를 통해 의존성을 주입받는 방식이다. **Spring에서 가장 권장하는 방식**

- **특징** : 빈 객체가 생성되는 시점에 의존성이 함께 주입
- **장점**
    - 불변성 보장
    - 의존성 누락 방지
    - 순환 참조 방지
    - 단위 테스트 용이성
    - 가독성 & 유지보수성

```java
@Service
public class OrderService {
    private final PaymentRepository paymentRepository;

    @Autowired
    public OrderService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
}
```

추가로 Spring Framework 4.3 부터 해당 클래스에 하나의 생성자만 존재한다면 `@Autowired`를 생략 가능

```java
@Service  
@RequiredArgsConstructor  
public class ExerciseService implements ExerciseServiceInterface {  
    private final ExerciseMapper exerciseMapper;  
    private final ExerciseRepository exerciseRepository;  
    private final BodyDetailPartRepository bodyDetailPartRepository;  
    private final ExerciseTargetRepository exerciseTargetRepository;
}
```

`Lombok`의 `@RequiredArgsConstructor`를 사용하면 더욱 깔끔한 코드로 DI 환경을 구축 가능

### setter 주입

`setter` 메서드를 통해 의존성을 주입하는 방식이다.

- **특징** : 객체 생성 이후에 의존성을 설정
- **장점** : 의존성을 선택적으로 주입하거나, 런타임에 의존성을 변경해야 할 때 유용
- **단점** : 완료되지 않은 상태에서 객체가 사용될 위험이 존재, 불변성을 보장 X

```java
public class SimpleMovieLister {
	private MovieFinder movieFinder;

	@Autowired
	public void setMovieFinder(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}
}
```

### 필드 주입

변수에 `@Autowired` 어노테이션을 직접 붙이는 방식

- **특징** : 코드가 간결
- **단점** : 외부에서 변경이 불가능하여 단위 테스트 작성에 어려움 존재, 프레임워크 의존도가 증가

```java
public class MovieRecommender {

	private final CustomerPreferenceDao customerPreferenceDao;

	@Autowired
	private MovieCatalog movieCatalog;

	@Autowired
	public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
		this.customerPreferenceDao = customerPreferenceDao;
	}
}
```

## DI시 빈이 여러개 일때

동일한 타입의 Bean이 여러개 존재 할 때, 하나의 빈에 `@Primary`

### @Primary

우선순위를 지닌 Bean에게 `@Primary`를 명시하면 해당 객체를 **우선적으로 조립**한다.

> 기본적으로 하나의 Type Bean에 여러 Bean이 존재한다면 bean name과 field name을 매핑하여 주입  
> 그러나, 특정 Type Bean에 `@Primary`가 명시된 Bean이 있다면 name을 무시하고 해당 Bean을 주입

```java
interface MyBean {  
    void doSomething();  
}  
  
@Component  
@Primary  
class MainBean implements MyBean {  
    @Override  
    public void doSomething() {  
        System.out.println("Main");  
    }  
}  
  
@Component  
class SubBean implements MyBean {  
    @Override  
    public void doSomething() {  
        System.out.println("Sub");  
    }  
}
```

```java
@SpringBootTest  
public class PrimaryTest {  
  
    @Autowired  
    public MyBean myBean;  
  
    @Test  
    public void mainBeanLoad() {  
        assertThat(myBean).isInstanceOf(MainBean.class);  
    }  
}
```

### @Qualifier

`@Primary`만으로는 기능이 부족한 경우에 주로 사용한다.

예를 들어 소셜 로그인과 일반 로그인이 동시에 존재하는 서비스를 개발한다고 할 때,  
각 방식에 맞는 `AuthenticationSuccessHandler`가 필요하기에 아래와 같이 `@Qualifier("이름")`로 명시하여 각각 의도에 맞게 Bean을 등록할 수 있다.

```java
@Component  
@Qualifier("LoginSuccessHandler")  
public class LoginSuccessHandler implements AuthenticationSuccessHandler { }

@Component  
@Qualifier("SocialSuccessHandler")  
public class SocialSuccessHandler implements AuthenticationSuccessHandler { }
```

```java
// SecurityConfig.java

@Configuration  
@EnableWebSecurity  
public class SecurityConfig {  
  
    private final AuthenticationConfiguration authenticationConfiguration;  
    private final AuthenticationSuccessHandler loginSuccessHandler;  
    private final AuthenticationSuccessHandler socialSuccessHandler;  
    private final JwtService jwtService;  
  
    public SecurityConfig(  
            AuthenticationConfiguration authenticationConfiguration,  
            @Qualifier("LoginSuccessHandler") AuthenticationSuccessHandler loginSuccessHandler,  
            @Qualifier("SocialSuccessHandler") AuthenticationSuccessHandler socialSuccessHandler,  
            JwtService jwtService) {  
  
        this.authenticationConfiguration = authenticationConfiguration;  
        this.loginSuccessHandler = loginSuccessHandler;  
        this.socialSuccessHandler = socialSuccessHandler;  
        this.jwtService = jwtService;  
    }
}
```

## 주입 로직

- `@Bean` 으로 bean을 생성하게 되면, method name이 bean name으로 생성된다.
- 같은 Type의 bean이 1개만 있다면, bean name과 관련없이 bean을 주입해준다.
- 같은 Type의 bean이 여러 개 있으면, `@Qualifier`가 없어도 bean name과 field name을 매칭해서 bean을 주입해준다.
- (!) `@Primary`가 있으면, bean name을 무시하고 Type 기반으로 Primary인 Bean을 주입한다.
- `@Qualifier`가 있으면, 무조건 bean name 기준으로 주입해준다. (없으면 오류가 발생한다)
- `@Qualifier` 어노테이션이 `@Primary` 어노테이션보다 우선하여 적용된다.

## 출처 및 참고자료

https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html  
https://mangkyu.tistory.com/125  
https://mangkyu.tistory.com/150  
