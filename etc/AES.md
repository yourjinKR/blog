---
date: 2026-11-11
tags:
  - Security
aliases:
  - AES-256-GCM
---
AES(Advanced Encryption Standard)는 대표적인 **[[대칭키]] 암호화 알고리즘**이다.  

AES는 키 길이에 따라 세 가지 버전이 존재하며 키 길이가 길수록 무차별 대입 공격에 대한 저항성이 높다.  

| 알고리즘    | 키 길이            | 암호화 라운드 수 |
| ------- | --------------- | --------- |
| AES-128 | 128bit (16Byte) | 10회       |
| AES-192 | 192bit (24Byte) | 12회       |
| AES-256 | 256bit (32Byte) | 14회       |
AES는 **키 길이에 관계없이 블록 크기가 항상 128bit**라는 특징이 있다.  

- **키 길이:** 암호화와 복호화에 사용하는 비밀키의 크기
- **블록 크기:** 한 번에 암호화하는 데이터의 크기
- **라운드 수:** 암호화 과정에서 반복하는 변환 단계의 횟수

## 운용 모드

AES는 **128bit 블록 단위로만 데이터를 처리**한다.
따라서 실제 데이터를 암호화하려면 다음과 같은 **운용 모드**가 필요하다.


AES는 한 번에 128bit(16Byte) 크기의 데이터 블록을 암호화하는 알고리즘이다.  
데이터가 16Byte보다 클 경우 **크기가 16Byte인 블럭**으로 나눈다.  

운용 모드는 다음과 같은 사항을 결정한다.  

- 여러 블록을 독립적으로 암호화할지, 서로 연결할지
- IV(초기화 벡터)나 Nonce를 어떻게 사용할지
- 패딩(Padding)이 필요한지
- 암호문의 변조를 검증할 수 있는지

> [!INFO] IV (Initialization Vector, 초기화 벡터)
> IV란 동일한 키와 평문을 사용하더라도 암호화 결과가 매번 달라지도록 하는 데 사용하는 값이다.  
> 
> - IV는 AES 블록 크기와 동일한 16Byte입니다.
> - 예측하기 어려운 새로운 IV를 생성해야 합니다.
> - IV 자체는 비밀로 보관할 필요가 없습니다.
> - CBC는 기본적으로 암호문의 위변조 여부를 검증하지 못합니다.

|운용 모드|특징|무결성 검증|권장 사항|
|---|---|---|---|
|ECB|각 블록을 독립적으로 암호화|X|사용 지양|
|CBC|이전 암호문 블록과 연결|X|별도 인증 필요|
|CTR|카운터를 이용해 암호화|X|별도 인증 필요|
|GCM|CTR 기반 암호화와 인증 결합|O|신규 개발에 권장|
### ECB

- 가장 단순
- 각 블록을 독립적으로 암호 → 동일한 평문 블록은 항상 동일한 암호문 블록으로 변환
- 원본 데이터를 모르더라도 암호문에 나타나는 반복 패턴을 분석 가능 → 취약함

### CBC

- ECB의 반복 패턴 노출을 개선하기 위해 이전 블록의 암호 결과를 활용
- **현재 평문 블록과 이전 암호문 블록을 XOR 연산한 다음 AES로 암호화**
- 첫 블록은 **IV**와 XOR하고, 다음 블록부터는 이전 암호문과 XOR

> IV를 처음 활용한 운용 모드

### CTR

- **카운터**를 이용하는 운용 모드
- AES로 카운터 블록을 암호화해 얻은 값을 평문과 XOR하여 암호문을 생성
- AES를 스트림 암호처럼 사용
- 블록 간 독립적인 연산이 가능해 병렬 처리에 유리
- 블록 크기의 배수로 데이터를 맞추는 **패딩이 필요하지 않음**
- 동일한 키에서 카운터 블록을 재사용하면 기밀성이 손상될 수 잇음
- 데이터 무결성을 자체적으로 제공하지 않음

### GCM

- GCM은 CTR 방식에 인증 기능을 결합한 운용 모드
- **GCM은 기밀성과 무결성을 함께 제공**

GCM에서는 다음과 같은 값들을 사용한다.  

| 구성 요소           | 일반적인 크기          |
| --------------- | ---------------- |
| AES 키           | 128bit 또는 256bit |
| Nonce(IV)       | 96bit (12Byte)   |
| 인증 태그(Auth Tag) | 128bit (16Byte)  |

```java
private static final String ALGORITHM = "AES/GCM/NoPadding";  
private static final int IV_LENGTH = 12;  
private static final int TAG_LENGTH = 128;
```



## Java

**암호화**

```java
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public static String encrypt(String plainText, String key) throws Exception {
    // 문자열 키를 SecretKey로 변환
    SecretKey secretKey = new SecretKeySpec(key.getBytes(), "AES");

    // Cipher 생성 및 초기화
    Cipher cipher = Cipher.getInstance("AES");
    cipher.init(Cipher.ENCRYPT_MODE, secretKey);

    // 데이터 암호화 및 base64 인코딩
    byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
    return Base64.getEncoder().encodeToString(encryptedBytes);
}
```

**복호화**

```java
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public static String decrypt(String cipherText, String key) throws Exception {
    // 문자열 키를 SecretKey로 변환
    SecretKey secretKey = new SecretKeySpec(key.getBytes(), "AES");

    // Cipher 생성 및 초기화
    Cipher cipher = Cipher.getInstance("AES");
    cipher.init(Cipher.DECRYPT_MODE, secretKey);

    // 데이터 Base64 디코딩 및 복호화
    byte[] decodedBytes = Base64.getDecoder().decode(cipherText);
    byte[] decryptedBytes = cipher.doFinal(decodedBytes);
    return new String(decryptedBytes);
}
```


## 출처 및 참고자료

```cardlink
url: https://docs.tosspayments.com/resources/glossary/aes
title: "AES(고급 암호화 표준) | 토스페이먼츠 개발자센터"
description: "AES(고급 암호화 표준)는 2001년에 미국 국립표준기술연구소(NIST)에서 설립한 대칭 키 암호화 알고리즘입니다."
host: docs.tosspayments.com
favicon: https://static.toss.im/tds/favicon/favicon-16x16.png
image: https://docs.tosspayments.com/static/default-og.png
```

```cardlink
url: https://true-false.tistory.com/131
title: "AES-256-GCM 암호화 방식 정리"
description: "데이터를 암호화할 때 단순히 AES 알고리즘만 선택하는 것으로는 충분하지 않다.AES는 항상 운용 모드(Mode of Operation)와 함께 사용되며, 어떤 모드를 선택하느냐에 따라 보안 특성이 크게 달라진다.최근 많은 시스템에서 사용되는 방식이 AES-256-GCM이다.이 글에서는 AES-GCM이 어떤 방식이며 왜 많이 사용되는지 정리해본다.1. AES란 무엇인가AES(Advanced Encryption Standard)는 대표적인 대칭키 암호화 알고리즘이다.대칭키 암호화란같은 키로 암호화같은 키로 복호화를 수행하는 방식이다.AES는 키 길이에 따라 세 가지 버전이 존재한다.알고리즘키길이AES-128128bitAES-192192bitAES-256256bit 키 길이가 길수록 브루트포스 공격에 대한 .."
host: true-false.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FJ8dzO%2FdJMcajnTp8x%2FAAAAAAAAAAAAAAAAAAAAAB7VVkNbGyBcihNZN8FMfwhKmQhQoOCJq9dKKUrkeQGZ%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3DqiTVRGGvvfrFbgIc711jGiLPGgs%253D
```


