---
tags:
  - Network
---
하나의 커다란 네트워크를 더 작고 관리하기 쉬운 여러 개의 조각으로 쪼갠 작은 네트워크를 말한다.  
브넷을 통해 네트워크 트래픽은 불필요한 라우터를 통과하지 않고 더 짧은 거리를 이동하여 대상에 도달시킬 수 있다.  

```
192.168.60.14
```

## 서브넷 마스크

[[IP]] 주소에서 **네트워크 영역**과 **호스트 영역**을 나누어 주는 32비트 숫자 조합이다.  

- 서브넷 마스크는 네트워크 주소와 호스트 주소를 구분하는 역할을 합니다.
- 서브넷 마스크는 왼쪽부터 1이 연속으로 나오다가 한 번 0이 등장하면 그 뒤는 모두 0이어야 합니다.

![[IMG-20260914171311342.png|401]]

- 네트워크 ID: 네트워크 자체를 식별하는 부분
- 호스트 ID: 네트워크 내 개별 장치를 식별하는 부분

`ipconfig` 입력시 아래와 같이 확인 가능하다.

![[IMG-20260914171705237.png]]

아래와 같이 표현하기도 한다.  

`192.168.1.100/24`
- `192.168.1.0` → 네트워크 ID
- `100` → 호스트 ID
- `/24` → 서브넷 마스크 (255.255.255.0)

> [!NOTE]
> IP 주소와 Subnet Mask를 AND 연산하면 해당 IP가 속한 Network Address를 빠르게 구할 수 있다.  

%%%%
## 출처 및 참고자료

```cardlink
url: https://www.cloudflare.com/ko-kr/learning/network-layer/what-is-a-subnet/
title: "서브넷이란? | 서브넷마스크 작동원리"
description: "서브넷의 작동 원리와, 서브넷마스크와 IP 주소의 작동 방식에 대해 알아보세요."
host: www.cloudflare.com
image: https://cf-assets.www.cloudflare.com/slt3lc6tev37/53qCYhQbir5WtIU0VDWESo/954a48bfb17f429acf469e5f14345d83/unnamed-3.png
```

```cardlink
url: https://www.youtube.com/watch?v=gOMljj6K2V0
title: "IPv4주소 체계에 대한 암기사항"
description: "Host라는 말을 이해했다면 Host에 부여되는 IP주소는 어떤 구조를 가지고 있는지 함께 알아야 합니다. 더불어 Subnet-mask에 대해서 알아야 합니다. 이 두 가지를 한꺼번에 설명한 영상입니다. 학습에 도움이 되기 바랍니다."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/e60429bd/img/favicon_32x32.png
image: https://i.ytimg.com/vi/gOMljj6K2V0/maxresdefault.jpg
```
