---
title: 선택 정렬
---
해당 순서에 원소를 넣을 위치는 이미 정해졌고, 어떤 원소를 넣을지 결정하는 [[algorithm|알고리즘]]입니다.  

- 시간 복잡도: O(n^2)
- 공간 복잡도: O(n)

## 장점

- Bubble sort와 마찬가지로 알고리즘이 단순하다.
- 정렬을 위한 비교 횟수는 많지만, Bubble Sort에 비해 실제로 교환하는 횟수는 적기 때문에 많은 교환이 일어나야 하는 자료상태에서 비교적 효율적이다.
- Bubble Sort와 마찬가지로 정렬하고자 하는 배열 안에서 교환하는 방식이므로, 다른 메모리 공간을 필요로 하지 않는다. => 제자리 정렬(in-place sorting)

## 단점

- 시간복잡도가 O(n^2)으로, 비효율적이다.
- **불안정 정렬(Unstable Sort)** 이다.


## 로직

1. 주어진 배열 중에 최소값을 찾는다.
2. 그 값을 맨 앞에 위치한 값과 교체한다. (pass)
3. 맨 처음 위치를 뺀 나머지 배열을 같은 방법으로 교체한다.

```java
public static int[] selectionSort(int[] arr) {  
    for (int i = 0; i < arr.length - 1; i++) {  
        int minIdx = i;  
        for (int j = i + 1; j < arr.length; j++) {  
            if (arr[j] < arr[minIdx]) {  
                minIdx = j;  
            }  
        }  
        int tmp = arr[minIdx];  
        arr[minIdx] = arr[i];  
        arr[i] = tmp;  
    }  
    return arr;  
}
```

![](https://upload.wikimedia.org/wikipedia/commons/3/3e/Sorting_selection_sort_anim.gif)

## 참고 자료

https://gyoogle.dev/blog/algorithm/Selection%20Sort.html