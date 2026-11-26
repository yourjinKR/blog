---
date: 2026-09-28
tags:
  - 노크인
  - nGrinder
---
## 들어가며

출시 후 노크인 프로젝트에서 기존에 개발한 API들에 대해 성능 개선 작업을 진행했다.  
우선 로컬 환경에서 nGrinder로 부하 테스트를 진행하기로 했으며 Prometheus + Grafana로 성능을 관측하기로 했다.  
우선 각자 [[nGrinder 튜토리얼|nGrinder에 대해 먼저 알아본 후]] 작업을 진행하기로 했다. nGrinder 다루는 방식에 대해 아직 미숙했기에 [[nGrinder Connection reset 설정]]과 같이 문제를 해결하며 테스트 환경을 구축하기 시작했다.  

또한, [[nGrinder REST API 활용]]하여 Test를 반복 실행할 수 있는 스크립트를 만들었다.  

## 탐색 피드 조회 API 개선

 [[노크인 부하테스트 1차 테스트 결과]] 상 탐색 피드의 API의 TPS가 현저히 낮은 것을 확인할 수 있었다.  
 이를 해결하기 위해 [[게시물 검색 API 성능개선]] 작업을 우선적으로 진행했다.  

탐색 피드에서 내가 차단한 사용자와 나를 차단한 사용자의 게시물 및 정보가 보이지 않아야 한다.  
차단에 대한 데이터는 다음과 같은 테이블로 관리되고 있었다.  

![[IMG-20261126223540613.png]]

이를 서브쿼리에서 `OR` 연산자로 찾고 있었다.  

```sql
and not exists (
    select 1
    from block b1_0
    where b1_0.is_deleted = false
      and (
          (
              b1_0.blocker_id = 5
              and b1_0.blocked_id = rb1_0.member_id
          )
          or
          (
              b1_0.blocker_id = rb1_0.member_id
              and b1_0.blocked_id = 5
          )
      )
)
```

`OR` 연산자 특성상 인덱스 구조에서 탐색 범위를 좁히지 못하는 문제였다. 이를 개선하고자 두 개의 `AND` 연산자 서브쿼리로 분리했고 DB 실행 계획을 통해 정상적으로 Index 탐색이 수행되는 것을 확인했다. 

사실 `OR`, `AND` 연산자의 특성을 알고 있었다면 애초에 문제가 생기지 않을 낮은 레벨의 문젝라고 생각한다.  
그러나 해당 과정에서 [[DB Index|인덱스]]에 대해 깊이 알아보는 계기가 됐다.  

> 추가로 [[DB Index#Composite Index|복합 인덱스]]를 도입하기로 판단했으나 팀원과 함께 [[게시물 검색 API 성능개선#오해: 사실 인덱스는 추가할 필요가 없었다.|2차적인 검증]] 이후 도입 필요성이 없음을 검증했다.  

## 출처 및 참고자료

```cardlink
url: https://github.com/naver/ngrinder/wiki
title: "Home"
description: "enterprise level performance testing solution. Contribute to naver/ngrinder development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/e705323741345797d23dcc1e1501b3fa45e2286a739ad34bb09150d15148cdea/naver/ngrinder
```

```cardlink
url: https://github.com/binghe819/TIL/blob/master/Infra&DevOps/nGrinder/nGrinder%20%EC%99%84%EB%B2%BD%EA%B0%80%EC%9D%B4%EB%93%9C.md#3-2-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%83%9D%EC%84%B1-%EB%B0%8F-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%9E%91%EC%84%B1
title: "TIL/Infra&DevOps/nGrinder/nGrinder 완벽가이드.md at master · binghe819/TIL"
description: "📚 Today I Learned. 기록하자. Contribute to binghe819/TIL development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/cad0fa8fcb466a24b49438b2b7e07eecd5c6407866fe4bbe7aea3e024eb07aae/binghe819/TIL
```

