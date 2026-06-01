---
title: MIME type
---
## MIME type (Multipurpose Internet Mail Extensions)

MIME TYPE은 인터넷에서 전송되는 다양한 종류의 데이터를 식별하기 위한 형식이다.  
주로 웹 브라우저가 웹 서버로부터 받은 데이터를 해석할 때 사용된다.

![[Pasted image 20260601225752.png]]
https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/MIME_types

개발자 도구에서도 직접 확인하면 다음과 같다.

![[Pasted image 20260601230525.png|450]]

### 웹 개발 시 MIME type의 역할

MIME 유형은 서버가 클라이언트에게 전송하는 컨텐츠의 종류를 알려주는 메타데이터(metadata)이다.  
자바/스프링에서는 `consumes` 속성을 통해 MIME 타입을 커스텀하여 클라이언트로 전달한다.  

```java
@PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)  
public ApiResponse<MenuImageResponse> uploadImage(@RequestPart("file") MultipartFile file) {  
    var result = imageService.uploadPrimaryImage(file);  
    return ApiResponse.success(Response.from(result));  
}
```

![[Pasted image 20260601231004.png]]

## MIME Sniffing

MIME 스니핑(MIME sniffing)은 웹 브라우저가 서버로부터 전송된 리소스의 MIME 타입을 직접 확인하지 않고,  
리소스의 내용을 분석하여 자동으로 올바른 MIME 타입을 추측하는 과정.

MIME Sniffing에 대한 표준은 [해당 사이트](https://ko.htmlspecs.com/mimesniff/)를 참고

## 출처 및 참고자료

https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/MIME_types  
https://en.wikipedia.org/wiki/Content_sniffing  
https://wpgur.tistory.com/184