---
title: 거품 정렬
---
서로 인접한 두 원소의 대소를 비교하고, 조건에 맞지 않다면 자리를 교환하며 정렬하는 [[algorithm|알고리즘]]이다.

- 시간복잡도가 최악, 최선, 평균 모두 O(n^2)으로, 굉장히 비효율적
- 정렬 돼있지 않은 원소가 정렬 됐을때의 자리로 가기 위해서, 교환 연산(swap)이 많이 일어나게 된다.

## 장점

- 구현이 매우 간단하고, 소스코드가 직관적이다.
- 제자리 정렬이다
- 안정 정렬이다.

## 단점

- 시간복잡도가 최악, 최선, 평균 모두 O(n^2)으로, 굉장히 비효율적이다.
- 정렬 돼있지 않은 원소가 정렬 됐을때의 자리로 가기 위해서, 교환 연산(swap)이 많이 일어나게 된다.

## 예시 코드

```java
void bubbleSort(int[] arr) {
    int temp = 0;
	for(int i = 0; i < arr.length; i++) {
		for(int j= 1 ; j < arr.length-i; j++) {
			if(arr[j-1] > arr[j]) {
				temp = arr[j-1];
				arr[j-1] = arr[j];
				arr[j] = temp;
			}
		}
	}
}

int[] arr = new int[100];  

for (int i = 0; i < arr.length; i++) {  
	Random random = new Random();  
	arr[i] = random.nextInt(100);  
}  

bubbleSort.bubbleSort(arr);  
System.out.println(Arrays.toString(arr));
```

![](https://upload.wikimedia.org/wikipedia/commons/5/54/Sorting_bubblesort_anim.gif)

## 출처

https://gyoogle.dev/blog/algorithm/Bubble%20Sort.html