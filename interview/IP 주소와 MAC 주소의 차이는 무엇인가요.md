---
tags:
  - 면접
  - 스터디
  - Network
---
[[MAC]] 주소와 [[IP]] 주소는 모두 네트워크 통신에 사용되지만 용도는 서로 다릅니다. MAC 주소는 NIC 제조업체가 할당하며 하드웨어 자체를 식별하는 반면, IP 주소는 소프트웨어에 의해 할당되어 데이터가 전송되어야 하는 위치를 식별합니다.

> [!QUESTION]- 그렇다면 왜 IP 주소와 MAC 주소를 굳이 따로 사용하나요?  
> IP 주소는 서로 다른 네트워크 사이에서 최종 목적지를 찾기 위한 논리적 주소이고, MAC 주소는 현재 연결된 네트워크 구간에서 실제 데이터를 전달할 장치를 식별하기 위해 사용합니다.

> [!QUESTION]- IP 주소를 알고 있을 때 MAC 주소는 어떻게 알아내나요?  
> IPv4에서는 [[ARP]]를 사용합니다. 같은 네트워크에 ARP Request를 브로드캐스트하고, 해당 IP 주소를 가진 장치가 자신의 MAC 주소를 ARP Reply로 응답합니다.

> [!QUESTION]- 라우터를 여러 대 거쳐 통신할 때 IP 주소와 MAC 주소는 어떻게 변하나요?  
> 일반적인 라우팅 과정에서는 출발지와 목적지 IP 주소는 유지되지만, MAC 주소는 각 네트워크 구간을 지날 때마다 다음 홉에 맞게 변경됩니다.

%%%%
## 출처 및 참고자료

```cardlink
url: https://www.lenovo.com/kr/ko/glossary/what-is-mac/?orgRef=https%253A%252F%252Fwww.google.com%252F&srsltid=AfmBOoqRureTh21DI2YYV_2Q82Ow0u-UnYIAJRZS9L3ppFvvLArcKOCh
title: "MAC 란 무엇입니까? | 레노버 코리아"
host: www.lenovo.com
favicon: https://ap-img.static.pub/ss/img/2025/07/28/img.20250728074209325255.ico
```
