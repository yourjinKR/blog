---
date: 2026-10-04
---
## P0 — 필수

- [ ] 페이지별 `title`, `description` 설정
- [ ] `robots.txt` 생성 및 설정
- [ ] `sitemap.xml` 생성 및 설정
- [ ] 공개/비공개 페이지 `index / noindex` 구분
- [ ] Google Search Console 등록
- [ ] 검색 노출 대상 콘텐츠를 SSR/SSG 기반으로 제공

## P1 — 중요

- [ ] 페이지별 `canonical` URL 설정
- [ ] Open Graph 메타데이터 설정
- [ ] Twitter/X Card 메타데이터 설정
- [ ] Semantic HTML 구조 점검
- [ ] `h1 → h2 → h3` Heading 구조 점검
- [ ] 의미 있는 이미지에 `alt` 적용
- [ ] Core Web Vitals 점검 및 개선
- [ ] 404 페이지 처리
- [ ] URL 변경 시 Redirect 처리

## P2 — 개선

- [ ] JSON-LD Structured Data 적용
- [ ] 주요 페이지 간 내부 링크 구조 개선
- [ ] favicon 적용
- [ ] Web App Manifest 설정
- [ ] 콘텐츠 검색 키워드 최적화

Nextjs 환경에서 메타데이터 등록은 아래 링크를 참고

```cardlink
url: https://nextjs.org/docs/app/api-reference/file-conventions/metadata
title: "File-system conventions: Metadata Files | Next.js"
description: "API documentation for the metadata file conventions."
host: nextjs.org
favicon: https://nextjs.org/favicon.ico?favicon.38folom4sz_yx.ico
image: https://nextjs.org/api/docs-og?title=File-system%20conventions:%20Metadata%20Files&sig=48dd1ea46a1ce9ac
```

%%%%
### robot.txt

robots.txt 파일은 크롤러가 사이트에서 액세스할 수 있는 URL을 검색엔진 크롤러에 알려 줍니다. 이 파일은 주로 요청으로 인해 사이트가 오버로드되는 것을 방지하기 위해 사용하며, 웹페이지가 Google에 표시되는 것을 방지하기 위한 메커니즘이 아닙니다. 웹페이지가 Google에 표시되지 않도록 하려면 noindex로 색인 생성을 차단하거나 비밀번호로 페이지를 보호해야 합니다.

[출처](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=ko)

### sitemap.xml

사이트맵이란 책의 목차처럼 사이트가 보유하고 있는 모든 웹 페이지의 URL을 나열한 파일을 의미합니다. 사이트맵을 구글 서치 콘솔을 통해 구글에게 직접 제출함으로써 색인 및 노출하고자 하는 사이트의 모든 중요 페이지가 누락 없이 구글에 의해 발견될 수 있도록 할 수 있게 한다.  

[출처](https://seo.tbwakorea.com/blog/how-to-create-and-submit-a-sitemap/)

> [!CAUTION]
> 1. **사이트맵에는 색인을 원하는 페이지 URL만 포함되어야 합니다.**
> 2. **사이트맵에는 리다이렉션이 적용되어 있거나 404 에러를 반환하는 페이지를 포함해서는 안됩니다.**
> 3. **사이트맵에는 표준 URL만 포함되어야 합니다.**
