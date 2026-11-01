---
date: 2026-10-30
aliases:
  - Model View Controller
  - 모델 뷰 컨트롤러
---
MVC란 소프트웨어 공학에서 사용자 인터페이스와 비즈니스 로직을 분리하여 설계하기 위한 디자인 패턴이다.  ^intro

## MVC 사용이점

- 유지보수 용이: View, 비즈니스 로직, 데이터 처리가 분리되어 수정이 쉬움.
- 테스트 용이: Controller와 Service를 독립적으로 단위 테스트 가능.
- 확장성 높음: View를 React나 모바일 앱용 API로 손쉽게 교체 가능.
- 협업에 유리: 프론트엔드(뷰)와 백엔드(모델, 컨트롤러)를 다른 팀이 동시에 작업 가능.

## MVC 구성요소

MVC의 구성 요소는 아래와 같이 3가지로 구분하여 간단히 설명할 수 있다.  

1. 모델: 데이터와 비즈니스 로직을 관리합니다.
2. 뷰: 레이아웃과 화면을 처리합니다.
3. 컨트롤러: 모델과 뷰로 명령을 전달합니다.

## 출처 및 참고자료

```cardlink
url: https://developer.mozilla.org/ko/docs/Glossary/MVC
title: "MVC - MDN Web Docs 용어 사전: 웹 용어 정의 | MDN"
description: "MVC (모델-뷰-컨트롤러) 는 사용자 인터페이스, 데이터 및 논리 제어를 구현하는데 널리 사용되는 소프트웨어 디자인 패턴입니다. 소프트웨어의 비즈니스 로직과 화면을 구분하는데 중점을 두고 있습니다. 이러한 \"관심사 분리\" 는 더나은 업무의 분리와 향상된 관리를 제공합니다. MVC 에 기반을 둔 몇 가지 다른 디자인 패턴으로 MVVM (모델-뷰-뷰모델), MVP (모델-뷰-프리젠터), MVW (모델-뷰-왓에버)가 있습니다."
host: developer.mozilla.org
favicon: https://developer.mozilla.org/favicon.ico
```

```cardlink
url: https://ko.wikipedia.org/wiki/%EB%AA%A8%EB%8D%B8-%EB%B7%B0-%EC%BB%A8%ED%8A%B8%EB%A1%A4%EB%9F%AC
title: "모델-뷰-컨트롤러 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
image: https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/MVC-Process.svg/1280px-MVC-Process.svg.png?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=thumbnail
```

