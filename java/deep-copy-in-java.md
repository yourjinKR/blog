---
title: 얕은 복사와 깊은 복사의 차이
---
## 얕은 복사란?

원본과 동일한 필드를 모두 포함하되, 값의 복사본만 가지는 새로운 객체를 생성하는 것입니다.  
객체 내부에 객체가 있을 경우 복사된 객체 내부의 객체 필드는 원본과 메모리 주소를 공유합니다.  

![[Pasted image 20260704034840.png|275]]

## 깊은 복사

원본의 각 필드를 복사본으로 복사하고, 참조만 복사하는 것이 아니라 필드 자체를 복사하는 방식입니다. 

## 자바에서는?

자바에서 우선 얕은 복사와 깊은 복사의 차이점을 쉽게 테스트하기 위해 [[cloneable-interface|Cloneable]] 인터페이스를 사용하겠습니다.  

```java
class Person implements Cloneable {  
    String name;  
    int age;  
    Address address;  
    
    @Override  
    protected Object clone() throws CloneNotSupportedException {  
        return super.clone();  
    }  
}
```

### 복사 생성자

아래와 같은 경우는 필드값만 복사가 되며 하위 객체에 대해서는 같은 메모리를 공유하기에 복사한 객체의 주소를 변경시 같이 변경됩니다.

```java
Person original = new Person("유어진", 26, new Address("경기도"));  
Person doppelganger = (Person) original.clone();  
doppelganger.address.name = "화성";  
System.out.println(original.address.name);  
// 화성
```

복사 생성자를 추가한다.

```java
public Person(Person person) {  
    this.name = person.name;  
    this.age = person.age;  
    // 내부 객체의 필드까지 전부 복
    this.address = new Address(person.address.name);  
}
```


```java
Person original = new Person("유어진", 26, new Address("경기도"));  
Person doppelganger = new Person(original);  
doppelganger.address.name = "화성";  
System.out.println(original.address.name);
// 경기도
```

## 요약

얕은 복사란 객체의 주소값만 복사합니다.  
반면 깊은 복사는 객체의 실제 데이터를 새로운 메모리 공간에 저장하여 새로운 객체를 만듭니다.  

자바에서는 참조형 타입 필드를 가진 객체를 단순히 대입 연산자나 `clone()` 메서드로 복사한다면 참조 타입 필드에 대해 서로 같은 메모리 주소를 공유하기에 복사본에서 객체 내부에 참조된 객체의 값을 수정시 원본에게도 영향을 끼칩니다.  

이럴 경우에는 복사 생성자나 `clone()` 메서드가 내부 객체까지 전부 복사가 되도록 직접 구현하여 깊은 복사를 구현할 수 있습니다. json 라이브러리를 사용한다면 직렬화와 역직렬화를 통해서도 가능합니다.   

## 출처 및 참고자료

https://www.baeldung.com/cs/deep-vs-shallow-copy  
https://www.youtube.com/watch?v=ytzbyHL5f4Q  
