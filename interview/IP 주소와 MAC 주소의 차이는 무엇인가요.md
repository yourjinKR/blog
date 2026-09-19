---
tags:
  - 면접
  - 스터디
  - Network
---
[[MAC]] 주소와 [[IP]] 주소는 모두 네트워크 통신에 사용되지만 용도는 서로 다릅니다. MAC 주소는 이더넷 같은 링크에서 네트워크 인터페이스를 구분하는 주소이고, IP 주소는 서로 다른 네트워크 사이에서 패킷을 전달할 때 사용하는 논리적 주소입니다. MAC 주소는 제조 시 할당되기도 하지만 소프트웨어로 변경하거나 임의 생성할 수도 있습니다.

> [!QUESTION]- MAC 주소가 변경될 수 있다면 장치의 영구 식별자로 사용해도 되나요?
> 영구적으로 고정된 식별자로 가정하면 안 됩니다. 예를 들어 운영체제는 Wi-Fi 추적을 줄이기 위해 사설 MAC 주소를 사용할 수 있습니다. MAC 주소만으로 사용자 신원을 인증하거나 인터넷 전체에서 장치를 추적할 수 있다고 설명하지 않습니다. [Apple의 사설 Wi-Fi 주소 설명](https://support.apple.com/en-us/102509)

> [!QUESTION]- 그렇다면 왜 IP 주소와 MAC 주소를 굳이 따로 사용하나요?  
> IP 주소는 서로 다른 네트워크 사이에서 최종 목적지를 찾기 위한 논리적 주소이고, MAC 주소는 현재 연결된 네트워크 구간에서 실제 데이터를 전달할 장치를 식별하기 위해 사용합니다.

> [!QUESTION]- IP 주소를 알고 있을 때 MAC 주소는 어떻게 알아내나요?  
> IPv4에서는 [[ARP]]를 사용합니다. 같은 네트워크에 ARP Request를 브로드캐스트하고, 해당 IP 주소를 가진 장치가 자신의 MAC 주소를 ARP Reply로 응답합니다.

> [!QUESTION]- 접속할 서버가 다른 네트워크에 있다면 서버의 MAC 주소를 ARP로 찾나요?
> 아닙니다. 라우팅 결과에 따라 현재 링크에서 패킷을 넘길 다음 홉, 일반적으로 게이트웨이의 MAC 주소를 찾습니다. 이때 IP 패킷의 목적지는 원격 서버지만 이더넷 프레임의 목적지는 다음 홉입니다. ARP 브로드캐스트는 원격 서버가 있는 네트워크까지 라우팅되지 않습니다. [RFC 826](https://www.rfc-editor.org/rfc/rfc826.html)

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
