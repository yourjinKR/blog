---
title: 이미지 업로드 기능 구현을 위해 고려한 요소
tags:
  - 맛추리
---
## 개요

[맛추리](https://github.com/matchuri) 프로젝트를 진행하면서 이미지 업로드 기능에 대해 구현하기 전에  
기능 스펙에 대해 확정지어야 할 부분들을 알아보면서 찾게됐다.  

> 이미지 업로드 기능을 구현하기 위해 결정해야 할 사항들을 알아보고 이에 대한 개념을 파악한다.

## 파일 정책

우선 어떤 이미지 확장자를 사용할지 정해야 한다.

- jpeg
- png
- webp
- 또 있나..?

[[image-extension-comparison|이미지 파일 비교]]를 해본 결과 대략 아래와 같은 맥락이었다.  

> jpeg == png < webp < avif

우선 우리는 AI가 생성한 메뉴 대표 이미지를 올릴 것이기에 어떤 파일 타입으로 다룰 것인지 정해야 한다.  

![[Pasted image 20260601164821.png|297]]

참고로 chatGPT에서는 png 파일로만 다운받을 수 있으며  
별도의 파일 확정자를 지정하기 위해서는 API를 통해서만 호출 가능하다.  

```json
{
  "model": "gpt-image-1",
  "prompt": "menu photo of doenjang jjigae, DSLR style",
  "size": "1024x1024",
  "output_format": "webp"
}
```
[공식문서](https://developers.openai.com/api/reference/resources/images/methods/generate?utm_source=chatgpt.com) 참고

## 업로드 방식

[[how-to-upload-image-file|이미지 업로드 방식]]에는 크게 2가지 방식으로 나뉜다.  

1. 서버 중계 업로드
2. presigned PUT URL

### 최종 결정

최종적으로는 **서버 중계 업로드 방식**으로 진행했다.  
그 이유는 다음과 같다.  

- 현재 업로드 기능은 BO 관리자 기능이다
- 대용량/다량 이미지를 저장할 일 없음
- 간단히 구현과 검증 가능

## 조회 방식

이미지를 어떻게 Write할지를 정했다면 **어떻게 Read할지**를 정해야한다.

1. R2 public URL 또는 custom domain을 통한 공개 읽기  
2. API 서버가 이미지를 프록시해서 반환  
3. private bucket + 단기 서명 URL

![[r2-custom-domains.svg|575]]

**public URL + object key 조합**으로 구현했다.  

그 이유는 우리 서비스에서 다루는 이미지들은 다음과 같은 특징을 가졌기 때문이다.  

- 누구에게나 공개될 이미지
- 민감 정보 없음

위와 같은 특징으로 인해 서버에서 이미지에 대한 별도의 추가 로직이 요구되지 않는다.  
또한 공개된 이미지이기에 조회에 대한 트래픽이 크게 발생할 것이기에  
서버를 통해서 접근하는 것이 아닌 client가 직접 url를 통해 이미지를 조회하는 방식이 서버의 부하를 줄일 것이다.  

이미지 url를 위한 커스텀 도메인을 추가했고 이를 Cloudflare에 등록했다.  

![[Pasted image 20260601202114.png]]

## 파일 정책

파일에 대한 검증은 다음과 같다.

- 파일크기는 5[[data-unit-si-iec#IEC 단위|MiB]]
- [[mime-type|MIME type]]만 신뢰하지 않는다

![[Pasted image 20260601224818.png]]

- 디코딩을 통해 검증을 수행한다
- EXIF 제거 또는 재인코딩은 수행하지 않는다
- 해상도는 최소 300x300, 최대 4096x4096으로 제한한다