
```
http://localhost:8080/actuator/health
```

```json
{
  "groups": [
    "liveness",
    "readiness"
  ],
  "status": "UP"
}
```

## 접근 제어

Spring Boot 4 이전 버전은 [해당 글](https://techblog.woowahan.com/9232/) 참고

### Spring Boot 4

Spring Boot 4.0에서는 `management.endpoints.enabled-by-default`가 `deprecated`되었으며  
아래와 같이 접근제어 기반 설정으로 변경되었다.  

```yml
management:  
  endpoints:  
    access:  
      default: none  
    web:  
      exposure:  
        include: health  
  
  endpoint:  
    health:  
      access: read-only
      show-details: always # DB 등 상세 컴포넌트의 상태를 노출
```

## 출처 및 참고자료

https://techblog.woowahan.com/9232/  
https://docs.spring.io/spring-boot/4.0/reference/actuator/endpoints.html#actuator.endpoints.access  
