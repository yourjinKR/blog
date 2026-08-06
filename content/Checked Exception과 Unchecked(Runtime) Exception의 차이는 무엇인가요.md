가장 큰 차이는 **컴파일러가 예외 처리를 강제하는지 여부**입니다.

Checked Exception은 `RuntimeException`을 상속하지 않는 예외들로, 컴파일러가 `try-catch`로 잡거나 `throws`로 선언했는지 **컴파일 타임에 검사**합니다. 주로 복구 가능한 외부 상황(예: I/O 오류)에 사용됩니다.

반면, **Unchecked Exception**은 `RuntimeException`과 `Error`를 포함하며, 컴파일러가 예외 처리를 강제하지 않습니다. 이는 주로 프로그램 로직 오류나 복구 불가능한 시스템 오류를 나타냅니다

---

Checked Exception과 Unchecked Exception의 가장 큰 차이는 컴파일러가 예외 처리를 강제하는지 여부입니다.

Checked Exception은 RuntimeException을 상속하지 않는 Exception 계열로, IOException이 대표적입니다. 발생할 수 있는 Checked Exception은 catch로 처리하거나 throws로 호출자에게 전달해야 합니다.

Unchecked Exception은 RuntimeException과 그 하위 예외로, NullPointerException이나 IllegalArgumentException 등이 있습니다. 컴파일러가 명시적인 예외 처리를 강제하지 않으며, 주로 잘못된 값이나 프로그램의 논리 오류를 나타낼 때 사용합니다.

이 차이는 Spring의 트랜잭션 롤백 정책에도 영향을 줍니다. @Transactional은 기본적으로 RuntimeException과 Error가 외부로 전파되면 롤백하지만, Checked Exception이 발생하면 롤백하지 않고 커밋을 시도합니다.

Checked Exception에서도 롤백이 필요하다면 @Transactional의 rollbackFor에 해당 예외를 지정해야 합니다. 반대로 특정 RuntimeException에서 롤백하지 않으려면 noRollbackFor를 사용할 수 있습니다.

또한 예외를 메서드 내부에서 처리하고 외부로 전달하지 않으면 트랜잭션 프록시가 예외 발생을 알 수 없기 때문에, 기본적으로 롤백되지 않는다는 점도 주의해야 합니다.