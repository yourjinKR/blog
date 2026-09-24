---
tags:
  - DB
aliases:
  - Anomaly
  - 이상 현상
---
트랜잭션 [[Isolation Level|격리 수준]]이 충분하지 않아 데이터 조회/수정 결과의 일관성이 깨지는 현상을 말한다.  

## Standard SQL 92

Strandard SQL 92에서 정의한 3가지의 이상 현상은 다음과 같다.  

- [[#Dirty Read]]
- [[#Non-Repeatable Read]]
- [[#Phantom Read]]

### Dirty Read

다른 트랜잭션이 커밋되지 않은 트랜잭션의 값을 읽었을 때 발생하는 현상이다.  

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: UPDATE balance = 500
    Note over T1,DB: 아직 COMMIT 하지 않음

    T2->>DB: SELECT balance
    DB-->>T2: 500
    Note over T2: 커밋되지 않은 값 조회

    T1->>DB: ROLLBACK
    Note over DB: balance는 원래 값(1000)으로 복구

    Note over T2: 존재하지 않게 된 값을 읽음<br/>Dirty Read
```

### Non-Repeatable Read

같은 트랜잭션에서 같은 행을 다시 읽었을 때 값이 달라지는 현상이다.  

> Fuzzy Read라고도 부른다.  

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: SELECT balance
    DB-->>T1: 1000

    T2->>DB: UPDATE balance = 500
    T2->>DB: COMMIT

    T1->>DB: SELECT balance
    DB-->>T1: 500

    Note over T1: 동일한 행을 다시 읽었지만<br/>1000 → 500으로 변경됨
    Note over T1: Non-Repeatable Read
```

### Phantom Read

같은 범위 조건으로 다시 조회했을 때 행이 추가되거나 사라지는 현상이다.

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: SELECT * FROM member<br/>WHERE age >= 20
    DB-->>T1: Alice, Bob

    T2->>DB: INSERT Charlie (age = 25)
    T2->>DB: COMMIT

    T1->>DB: SELECT * FROM member<br/>WHERE age >= 20
    DB-->>T1: Alice, Bob, Charlie

    Note over T1: 동일한 조건으로 조회했지만<br/>새로운 행이 나타남
    Note over T1: Phantom Read
```

## Standard SQL 92에 대한 비판

- 세 가지 이상 현상의 정의가 모호하다.
- 이상 현상은 세 가지 외에도 추가로 더 존재한다.
- 상업적인 DBMS에서 사용되는 방법을 반영해서 Isolation Level를 구분하지 않았다.  

### Dirty Write

커밋되지 않은 데이터를 write할때 발생하는 현상이다.  

> 일반적으로 모든 정상적인 DBMS는 Dirty Write를 허용하면 안 됨. 

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: UPDATE balance = 800
    Note over T1,DB: 아직 COMMIT 하지 않음

    T2->>DB: UPDATE balance = 500
    Note over T2,DB: T1의 미커밋 값을 다시 덮어씀

    T1->>DB: ROLLBACK
    T2->>DB: COMMIT

    Note over DB: 어떤 값을 기준으로 복구해야 하는지 꼬이게 됨
    Note over T1,T2: 커밋되지 않은 데이터를 다시 수정함<br/>Dirty Write
```

### Lost Update

한 트랜잭션의 수정 결과가 다른 트랜잭션의 수정에 의해 덮어씌워져 사라지는 현상이다.  

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: SELECT stock
    DB-->>T1: 10

    T2->>DB: SELECT stock
    DB-->>T2: 10

    T1->>DB: UPDATE stock = 11
    T1->>DB: COMMIT

    T2->>DB: UPDATE stock = 11
    T2->>DB: COMMIT

    Note over DB: 실제로는 12가 되어야 하지만<br/>최종 값은 11
    Note over T1,T2: 먼저 반영된 수정이 나중 수정에 의해 사라짐<br/>Lost Update
```

### Dirty Read 확장 개념

롤백이 발생하지 않아도 Dirty Read는 발생할 수 있다.  
다른 트랜잭션의 커밋 전 데이터를 읽었다면, 나중에 그 트랜잭션이 커밋되더라도 Dirty Read하다.

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: UPDATE balance = 500
    Note over T1,DB: 아직 COMMIT 하지 않음

    T2->>DB: SELECT balance
    DB-->>T2: 500

    T1->>DB: UPDATE balance = 700
    T1->>DB: COMMIT

    Note over T2: T2가 읽은 500은<br/>최종적으로 커밋된 값이 아님
    Note over T2: 롤백이 없어도 커밋 전 중간값을 읽었으므로<br/>Dirty Read
```

### Read Skew

다른 트랜잭션이 데이터를 수정하여, 서로 다른 시점의 데이터를 읽게 되는 현상이다.  

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: SELECT balance FROM account A
    DB-->>T1: 500

    T2->>DB: UPDATE account A = 400
    T2->>DB: UPDATE account B = 600
    T2->>DB: COMMIT

    T1->>DB: SELECT balance FROM account B
    DB-->>T1: 600

    Note over T1: T1은 A=500(이전 값), B=600(이후 값)을 읽음
    Note over T1: 실제 한 시점의 상태가 아닌 값을 조합해서 읽음<br/>Read Skew
```

### Write Skew

서로 다른 행을 읽고, 각각 다른 행을 수정하기 때문에 직접적인 충돌은 없어 보이지만,
결과적으로 전체 비즈니스 규칙이 깨지는 현상이다.

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: SELECT Alice=ON, Bob=ON
    DB-->>T1: 둘 다 근무 가능

    T2->>DB: SELECT Alice=ON, Bob=ON
    DB-->>T2: 둘 다 근무 가능

    T1->>DB: UPDATE Alice = OFF
    T1->>DB: COMMIT

    T2->>DB: UPDATE Bob = OFF
    T2->>DB: COMMIT

    Note over DB: 최종 상태 = Alice=OFF, Bob=OFF
    Note over DB: "항상 최소 1명은 근무" 규칙 위반
    Note over T1,T2: 서로 다른 행을 수정했지만<br/>전체 제약이 깨짐<br/>Write Skew
```

### Phantom Read 확장 개념

Phantom Read는 단순히 새 행이 INSERT되는 경우만이 아니라,
기존 행이 조건 범위에 들어오거나 빠져나가는 UPDATE / DELETE 때문에도 발생할 수 있다.

```mermaid
sequenceDiagram
    participant T1 as Transaction A
    participant DB as Database
    participant T2 as Transaction B

    T1->>DB: SELECT * FROM member<br/>WHERE age >= 20
    DB-->>T1: Alice, Bob

    T2->>DB: UPDATE Charlie age = 19 -> 25
    T2->>DB: COMMIT

    T1->>DB: SELECT * FROM member<br/>WHERE age >= 20
    DB-->>T1: Alice, Bob, Charlie

    Note over T1: 새로 INSERT된 것은 아니지만<br/>기존 행이 조건 범위 안으로 들어옴
    Note over T1: 조건 결과 집합이 달라짐<br/>Phantom Read 확장 개념
```

## 출처 및 참고자료

https://www.youtube.com/watch?v=bLLarZTrebU&t=410s  