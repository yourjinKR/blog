---
title: Spring DI
tags:
  - Spring
---
## Spring의 의존성 주입

Spring에서는 [[DI]]를 통해 [[IoC]]를 구현합니다.  

DI 원칙을 준수한다면 간결한 코드 작성이 가능하며 객체 간 결합도를 낮춰 유연성과 유지보수성을 높입니다.  
특히, 의존성이 인터페이스나 추상 클래스인 경우에는 비지니스 로직 변경 및 테스트 수행에 용이합니다.  

![[DI#^intro]]

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

동일한 타입의 Bean이 여러개 존재 할 때, 하나의 빈에 `@Primary`를 설정하여 우선순위를 조절한다.  

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
- `@Primary`가 있으면, bean name을 무시하고 Type 기반으로 Primary인 Bean을 주입한다.
- `@Qualifier`가 있으면, 무조건 bean name 기준으로 주입해준다. (없으면 오류가 발생한다)
- `@Qualifier` 어노테이션이 `@Primary` 어노테이션보다 우선하여 적용된다.

## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html
title: "Dependency Injection :: Spring Framework"
host: docs.spring.io
favicon: ../../../_/img/favicon.ico
```

```cardlink
url: https://mangkyu.tistory.com/125
title: "[Spring] 다양한 의존성 주입 방법과 생성자 주입을 사용해야 하는 이유 - (2/2)"
description: "Spring 프레임워크의 핵심 기술 중 하나가 바로 DI(Dependency Injection, 의존성 주입)이다. Spring 프레임워크와 같은 DI 프레임워크를 이용하면 다양한 의존성 주입을 이용하는 방법이 있는데, 각각의 방법에 대해 알아보도록 하자. 1. 다양한 의존성 주입 방법 [ 1. 생성자 주입(Constructor Injection) ] 생성자 주입(Constructor Injection)은 생성자를 통해 의존 관계를 주입하는 방법이다. @Service public class UserService { private UserRepository userRepository; private MemberService memberService; @Autowired public UserService(U.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb8OVUw%2FbtrzMJxLJXO%2FAAAAAAAAAAAAAAAAAAAAAJdhJ6gCAfZZcbm_1qSaaEzPItndyRizCG0BIAu-XEBD%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DAAZAUmyDGYMmIqfa9WI3wD5pdAk%253D
```


```cardlink
url: https://mangkyu.tistory.com/150
title: "[Spring] 의존성 주입(Dependency Injection, DI)이란? 및 Spring이 의존성 주입을 지원하는 이유"
description: "1. 의존성 주입(Dependency Injection)의 개념과 필요성 [ 의존성 주입(Dependency Injection) 이란? ] Spring 프레임워크는 3가지 핵심 프로그래밍 모델을 지원하고 있는데, 그 중 하나가 의존성 주입(Dependency Injection, DI) 이다. DI란 외부에서 두 객체 간의 관계를 결정해주는 디자인 패턴으로, 인터페이스를 사이에 둬서 클래스 레벨에서는 의존관계가 고정되지 않도록 하고 런타임 시에 관계를 동적으로 주입하여 유연성을 확보하고 결합도를 낮출 수 있게 해준다. 의존성이란 한 객체가 다른 객체를 사용할 때 의존성이 있다고 한다. 예를 들어 다음과 같이 Store 객체가 Pencil 객체를 사용하고 있는 경우에 우리는 Store객체가 Pencil 객체.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdefFpy%2Fbtq4kVvBKcc%2FAAAAAAAAAAAAAAAAAAAAAJKpqLELb0zKINpNm0qws-Vs6CAvjHlXCoR-1w6A05ml%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3Dp992XUahHVUmKxjWTpRuW7%252FSPOw%253D
```


