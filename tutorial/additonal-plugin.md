---
title: 추가 설정이 필요한 플러그인
order: "4"
---
# Excalidraw

블로그에서도 Excalidraw로 생성한 이미지들을 보여주기 위해서는 `.svg` 형식으로 첨부해야 합니다.

![[Excalidraw 테스트.svg|328]]

## 기본 폴더 경로 변경

Excalidraw 플러그인 설정란에서 폴더 경로를 `/content/Excalidraw`로 설정해주세요.

![[Pasted image 20260520192015.png|575]]

## 리스트에 표시하지 않기

위와 같이 기본 경로를 설정했다면 아래와 같이 리스트에 `Excalidraw` 폴더 내부에 마크다운이 있음을 인식하여 레이아웃에 추가됩니다.

![[Pasted image 20260520193943.png|275]]

호스팅된 블로그에서는 이와 같은 내용의 마크다운으로 표시되기에 노출할 필요가 전혀 없기에 이를 가려야 합니다.

![[Pasted image 20260520194045.png|475]]

`quartz.layout.ts` 파일에서 `Component.Explorer`에 아래와 같은 속성을 추가해주세요.

```tsx
Component.Explorer({
  filterFn: (node) => {
	return node.displayName !== "Excalidraw"
  }
}),
```

다시 재실행시 숨겨진 것을 확인할 수 있어요.

![[Pasted image 20260520193912.png|325]]

## svg로 export

파일 생성 후 우측 상단 더보기 아이콘 클릭 후 `Export Images` → `SVG to Vault` 버튼을 누르면 동일 경로에 `.svg`파일이 추가됩니다. 옵시디언 위키링크에서는 `.svg` 확장자를 명시해주세요.

![[Pasted image 20260520192134.png|400]]

# Front Matter Title

파일명 대신 파일 내부 `title` 속성을 사용하는 플러그인 입니다.  

Quartz에서는 파일명이 url이 되기에 영문으로 파일명을 저장할 경우 검색이나 파일트리에서 불편함이 존재합니다.  

![[Pasted image 20260524233149.png|255]]

설치 후 아래 Features에서 Explorer를 활성화한다.  

![[Pasted image 20260524232906.png]]

파일트리와 탐색기에서 `title` 속성을 기준으로 작동하시는걸 확인할 수 있습니다.

![[Pasted image 20260524233808.png|400]]

![[Pasted image 20260524233115.png|255]]

# 출처 및 참고자료

[Front Matter Title 사용법](https://kaminik.tistory.com/entry/%ED%94%84%EB%A1%A0%ED%8A%B8%EB%A7%A4%ED%84%B0-%EA%B0%92%EC%9D%84-%ED%8C%8C%EC%9D%BC%EB%AA%85%EC%9C%BC%EB%A1%9C-%EB%8C%80%EC%8B%A0%ED%95%98%EB%8A%94-Front-Matter-Title-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8)  