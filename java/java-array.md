---
title: 자바 배열
---

## 배열 선언

배열 선언시 배열의 크기를 정해야 한다.  

```java
int[] arr = new int[10];
```

값을 바로 넣어 아래와 같이 넣을 수 있다.  

```java
int[] arrInit = {1,2,3,4,5};
```

## 배열 길이

- 배열의 길이는 `.length`로 호출한다, `length()`가 아님을 주의

```java
int[] arr = new int[10];
System.out.println(arr.length);
// 10
```

## 배열 출력

- `Arrays.toString()` 메서드를 통해 출력

```java
System.out.println(Arrays.toString(arrInit));
// [1, 2, 3, 4, 5]
```


## 배열 랜덤 숫자 넣기

- Random을 사용하여 더미 값을 쉽게 만들자

```java
Random random = new Random();  
for (int i = 0; i < arr.length; i++) {  
    arr[i] = random.nextInt(10);  
}  
```

## 배열 슬라이싱

- `Arrays.copyOfRange`를 활용하자

```java
int[] arrInit = {1,2,3,4,5,6};
int[] arr1 = Arrays.copyOfRange(arrInit, 0, arrInit.length / 2);  
int[] arr2 = Arrays.copyOfRange(arrInit, arrInit.length/2, arrInit.length);  
// [1, 2, 3]
// [4, 5, 6]
```

