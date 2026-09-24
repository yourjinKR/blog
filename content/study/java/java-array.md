---
title: 자바 배열
---
## 배열 특징

- 배열은 같은 타입의 데이터만 저장할 수 있다.
- 한번 생성된 배열의 크기는 불변이다.

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

## Arrays 유틸

### 배열 슬라이싱

- `Arrays.copyOfRange`를 활용하자

```java
int[] arrInit = {1,2,3,4,5,6};
int[] arr1 = Arrays.copyOfRange(arrInit, 0, arrInit.length / 2);  
int[] arr2 = Arrays.copyOfRange(arrInit, arrInit.length/2, arrInit.length);  
// [1, 2, 3]
// [4, 5, 6]
```

### 그 외 메서드

| 메서드                               | 설명                                                         |
| --------------------------------- | ---------------------------------------------------------- |
| `Arrays.toString(array)`          | 입력한 배열 문자열 변환                                              |
| `Arrays.asList(array)`            | 배열을 기반으로 List생성 (크기 고정)                                    |
| `Arrays.copyOf(array)`            | 입력한 배열의 값을 복사하여 새로운 배열 생성 (깊은 복사)                          |
| `Arrays.sort(array)`              | 입력한 배열을 정렬한다                                               |
| `Arrays.equals(arr1, arr2)`       | 입력한 두 배열이 같은지 비교한다.                                        |
| `Arrays.compare(arr1, arr2)`      | 입력한 두 배열을 비교한다.  <br>(같으면: 0. arr1이 크면: 양수, arr1이 작으면: 음수) |
| `Arrays.binarySearch(array, key)` | 정렬된 배열에서 이진 탐색 수행하여 인덱스 반환                                 |
| `Arrays.fill(array, val)`         | 배열의 모든 값을 특정 값으로 채움                                        |
| `Arrays.mismatch(arr1, arr2)`     | 입력한 두 배열에서 첫 번째 불일치 인덱스 반환                                 |
| `Arrays.stream(array)`            | 입력한 배열의 Stream 클래스 반환                                      |


## 출처 및 참고자료

https://wooing1084.tistory.com/47  
