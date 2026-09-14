---
tags:
  - Network
aliases:
  - Network Address Translation
  - 네트워크 주소 변환
---
NAT는 IP 패킷의 TCP/UDP 포트 숫자와 소스 및 목적지의 IP 주소 등을 재기록하면서 라우터를 통해 네트워크 트래픽을 주고받는 기술을 말한다.  

> NAT는 사설 네트워크의 호스트가 외부의 공개된 네트워크에 연결할 수 있도로 상호 간에 주소를 변환하는 기술이다.

- 사설망이 하나의 IP 주소로 여러 대의 기기를 연결해 사용할 수 있다.  
- 외부에 notify하지 않고 내부망의 기기들의 주소를 변경할 수이 있다.  
- 내부망의 주소가 외부에 노출되지 않아 **보안성**에 유리하다.
- 가정용 공유기에서는 IP 주소 뿐만 아니라 포트 번호까지 변환하는 [[NAPT]] 방식이 주로 사용된다.   
- NAT은 IPv4의 주소 부족 문제를 완화하기 위해 등장 (NAT 사용시 여러 장치가 각각 공인 IP를 갖지 않아도 되기에)

![[IMG-20260914145740613.png|458]]

## NAT Table

내부 네트워크의 사설 IP 주소와 외부 인터넷의 공인 IP 주소 간의 변환 **매핑 정보**를 NAT Table에 저장한다.  

저장하는 매핑 정보는 다음과 같다.
- IP Adress
- Port Number

![[IMG-20260914153834432.png|525]]

## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC_%EC%A3%BC%EC%86%8C_%EB%B3%80%ED%99%98
title: "네트워크 주소 변환 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
image: https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/NAT_Concept-en.svg/1280px-NAT_Concept-en.svg.png?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=thumbnail
```

```cardlink
url: https://witch.work/ko/posts/network-nat-and-issue
title: "NAT란 무엇이고 어떤 문제를 해결하며 어떤 문제를 만들까?"
description: "NAT란 어떤 문제를 해결하는 무엇인가? 여기서 발생하는 문제는 뭐고 그걸 보완하는 것들은 무엇인가?"
host: witch.work
favicon: https://witch.work/favicon.ico?favicon.1yh5-8a8vj_ex.ico
image: https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_300,f_auto/blog/thumbnails/static-posts-network-nat-and-issue-nat-translation-1-png
```

```cardlink
url: https://ddongwon.tistory.com/91
title: "NAT(Network Address Translation) 의 개념"
description: "1. local 네트워크 보통 컴퓨터의 cmd에서 ipconfig 명령어를 통해 IP 주소를 확인해보면, 192.168.~ 이렇게 시작하는 경우가 많을 것이다.하지만, 네이버에 IP 주소 확인이라고 검색해보면 나오는 IP주소는 위의 주소와 다르게 나온다. 같은 컴퓨터로 똑같이 IP 주소를 검색했는데 다르게 나오는 이유는 무엇일까? 보통 사용자들이 사용하는 네트워크는 local 네트워크를 사용한다.아래 그림에서 라우터 오른쪽에 있는 subnet을 local 네트워크라고 칭하는데, 그 속에서는 자체적인 IP 주소를 사용한다. 원래 IP 주소는 겹치면 안되지만, local 네트워크 속에서는 다른 local 네트워크와 같은 IP주소를 써도 상관 없다. 예를들어, 110동 901호에 사는 사람과 112동 901호.."
host: ddongwon.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb6Qn69%2FbtqZpeTFYl9%2FAAAAAAAAAAAAAAAAAAAAAEPBYrgwFR9qdru7a-gnuNaIZqklcqwQqgKsLziuwvaD%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DgnIchcLk560ECLO5%252BX3Vodc9uOI%253D
```
