---
title: Cloneable 인터페이스
---
## Clonable

클래스가 해당 인터페이스를 구현한다는 것은 `clone()` 메서드가 해당 클래스의 인스턴스를 필드별로 복사한다는 것을 의미합니다.  

```java
class Person implements Cloneable {  
    @Override  
    protected Object clone() throws CloneNotSupportedException {  
        return super.clone();  
    }  
}
```

### 내부에 메서드가 없다

내부에 `clone()` 메서드가 선언되어 있지 않다.  
그렇기에 명시적으로 오버라이딩을 해야 메서드를 사용할 수 있다.  

![[Pasted image 20260704035532.png|475]]

> 이 인터페이스의 역할은 특정 클래스를 **복사할 수 있어요!** 라고 표시하는 용도이다.  
> 그리고 이걸 [[marker-interface|마커 인터페이스]]라고 한다.  

이 인터페이스를 구현하지 않는 객체를 복제하려고 하면 JVM은 _CloneNotSupportedException_ 예외를 발생시킵니다 . 따라서 _Cloneable_ **마커 인터페이스는 JVM에게** _Object.clone()_ 메서드  를 호출할 수 있음을 알려주는 지표 역할을 합니다 .

### clone 메소드는 피상적인 복사를 실행한다.

기본적으로 `clone()` 메서드는 얕은 복사이기에 내부에 객체 필드가 있다면 오버라이딩 메서드를 직접 구현하여 깊은 복사로 변경해야 된다.  

## 출처 및 참고자료

https://docs.oracle.com/javase/8/docs/api/java/lang/Cloneable.html  
https://catsbi.oopy.io/16109e87-3c7e-4c6e-9816-c86e6b343cdd  