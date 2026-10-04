---
date: 2026-09-30
tags:
  - 맛추리
  - 트러블슈팅
  - Web
---
## 요약

1. 로그상으로는 Turbopack이 구글 폰트를 resolve하지 못함
2. 번들링 문제라고 판단하여 로컬에서 테스트했으나 정상 동작
3. Vercel의 빌드 캐시 상태가 꼬일 수 있기에 no-cache redeploy 실행 

## 전체 로그

```cardlink
url: https://gist.github.com/yourjinKR/e61bd11b1df609191c65ad823940e683
title: "Vercel Google Font 에러"
description: "Vercel Google Font 에러. GitHub Gist: instantly share code, notes, and snippets."
host: gist.github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://github.githubassets.com/assets/gist-og-image-54fd7dc0713e.png
```

## 해결 과정

로그를 보니 구글 폰트를 못찾았음을 확인했다.   

![[IMG-20260930150139626.png]]

![[IMG-20260930150229626.png]]

turbopack 문제라고 하는데 로컬에서는 빌드(`npm run build`)가  정상적으로 동작한다.  

![[IMG-20260930151802455.png]]

Vercel 환경과 로컬 환경의 nextjs 버전이 일치하지 않음

![[IMG-20260930152259877.png]]

버전을 통일하기 위해 아래 과정을 수행했으나 여전히 빌드 정상적으로 확인

- `node_modules` 제거
- `.next` 제거
- `npm ci`
- 재빌드

![[IMG-20260930152910116.png]]

처음에 예상했던 번들링 과정에서의 문제점은 아니라고 판단.  
아래 PR도 preview deploy에 성공했기에 문제가 없었기에 빌드 문제는 아니라는 근거가 이를 뒷받침함.

```cardlink
url: https://github.com/matchuri/frontend/pull/269
title: "[Feat] 그룹 투표 결과 페이지 구현 및 결과 조회 흐름 개선 (MC-211~214) by Leejaelim · Pull Request #269 · matchuri/frontend"
description: "노션 백로그MC-211~214요약무엇을 변경했나요?그룹 투표 종료 후 최종 선정 메뉴와 주변 맛집을 확인할 수 있는 독립적인 투표 결과 페이지를 구현추천 세션에 저장된 위치와 반경을 기반으로 주변 맛집을 조회하고 기존 지도 및 맛집 목록 UI를 재사용방장이 투표를 종료하면 FINALIZED 상태로 전환되고 모든 그룹원이 투표 결과 보러..."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/d3b2073f52c8f66d51d473999a68c2ac90db31501bf315ebcba079e5a087e3f1/matchuri/frontend/pull/269
```

이런 상황을 AI는 아래와 같이 예측함.  

> [!AI] AI의 예측
> 로컬에서는 동일한 `Next.js 16.2.9 + Turbopack + next/font/google` 조합으로 빌드가 정상적으로 성공했기 때문에, 폰트 설정이나 Next.js 버전 자체의 문제일 가능성은 낮다고 판단했다.
> 
> 반면 Vercel 로그에는 이전 배포의 Build Cache를 복원한 기록이 있었고, Vercel 환경에서만 `@vercel/turbopack-next/internal/font/google/font` resolve 오류가 발생했다. 이에 **Vercel Build Cache가 꼬였을 가능성**을 우선 원인으로 예측했다.
> 
> 이후 **Build Cache를 사용하지 않고 Redeploy**한 결과 정상적으로 빌드가 성공하여, 이번 문제는 코드 자체보다는 **Vercel의 기존 빌드 캐시 상태에 의해 발생한 문제**로 확인되었다.

이후 Vercel에서 빌드 캐시 없이 Redeploy 진행

![[IMG-20260930154438244.png]]

정상적으로 배포 완료됐다.  

![[IMG-20260930154540687.png]]

## 번외

에이전트에게 요청했으나 폰트 관리 방식을 변경해버렸고 다른 방식을 2차적으로 모색함.  
AI가 수정한 내용을 지속적으로 검증할 필요가 있음.  

```cardlink
url: https://github.com/matchuri/frontend/pull/270
title: "[Chore] Vercel Google Font 배포 실패 조사 (변경 기각) by yourjinKR · Pull Request #270 · matchuri/frontend"
description: "관련 이슈Vercel 배포 빌드의 Google Font 오류 조사 (연결된 GitHub 이슈 없음)요약이 PR은 next/font/google을 제거하고 시스템 글꼴 스택을 적용한 후보 변경을 기록합니다.원래 코드로 로컬 빌드를 실행했을 때 정상 동작했습니다.Vercel에서 빌드 캐시를 사용하지 않고 재배포한 뒤에도 정상 동작했습니다...."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/7adeb70760187dd207ecd60d732a6b6492602024811e68d5d48149f7857c31e6/matchuri/frontend/pull/270
```
