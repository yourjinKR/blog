---
title: 아키텍처에 대한 고민
tags:
  - Architecture
  - 프로그라피
---
## 하나의 Service와 여러 Repository가 결합

MVP 범위의 API를 개발을 마친 후 팀원과 코드의 구조적인 부분에 대해서 이야기를 나눴다.  
가장 먼저 나온 내용은 다음과 같았다.  

> [!Quote]
> _하나의 Service가 여러 Repository를 참조하고 있는 구조에 대해 지양하는건 어떨까요?_

대표적으로 아래와 같은 구조이다.  

```java
@Service  
@RequiredArgsConstructor
public class RoommateBoardServiceImpl implements RoommateBoardService {  
    private final RoommateBoardRepository roommateBoardRepository;  
    private final RoommateBoardFileRepository roommateBoardFileRepository;  
    private final MemberServiceImpl memberService;  
    private final FileService fileService;  
    private final TransactionTemplate transactionTemplate;  
    private final MetaServiceImpl metaService;  
    private final PreferenceConditionRepository preferenceConditionRepository;  
    private final MemberLifePatternRepository memberLifePatternRepository;  
    private final AuthenticationRepository authenticationRepository;  
    private final RoommateBoardOptionRepository roommateBoardOptionRepository;  
    //...
}
```

그런데 이런 구조가 무슨 문제가 있는걸까?

- 한 파일에 많은 도메인에 대한 비지니스 로직이 혼재
- 특정 도메인에 대한 중복된 로직 방지

먼저 하나의 서비스가 단일 `repository`를 참조하되 여러 서브 서비스를 참조하는 구조로 방향성을 잡았다.  

## 수정 중 고민

수정하다가 `CalendarServiceImpl`가  `MyRoomMateServiceImpl`를 참조하는 것이다.  

```java
@Service  
@RequiredArgsConstructor  
public class CalendarServiceImpl {  
    private final MyRoomMateServiceImpl myRoomMateService;  
}
```

둘 다 컨트롤러로부터 직접 통신하는 최상위 컨트롤러이다.  

![[Pasted image 20260709170013.png]]

![[Pasted image 20260709170021.png]]

추후 내 룸메 페이지에서 내 룸메와 달력 정보를 동시에 가져와야 하는 엔드포인트가 추가됐을 때 해당 구조는 문제가 발생할 가능성이 크다. (순환 참조 발생할 확률인 높음)

어떤 구조로 재설계하는게 좋을까..?
기존에는 룸메이트 관리 컨트롤러에 관련 다수의 서비스들이 참조되었다.  

```java
@RestController  
@RequiredArgsConstructor  
@RequestMapping("/roommates")  
@Tag(name = "8. 룸메이트 관리")  
public class RoomMatesController {  
    private final MyRoomMateServiceImpl myRoomMateService;  
    private final HouseRuleServiceImpl houseRuleService;  
    private final CalendarServiceImpl calendarService;
}
```

그러나 추후에 내 룸메 정보, 하우스룰 정보, 캘린더 정보를 한번에 요청하는 API가 추가된다면 순환참조 혹은 controller에서 각 서비스에서 받은 응답값을 Response에 맞게 조립하는 로직이 추가될 것이다.  

우선 컨트롤러와 직접 소통하는 서비스를 하나만 관리하는 구조로 리팩토링했다.   

![[컨트롤러와 직접 소통하는 서비스는 하나.excalidraw.svg]]

이와 같이 구현한 이유는 현재 엔티티 구조에 따라 설게했다.  
