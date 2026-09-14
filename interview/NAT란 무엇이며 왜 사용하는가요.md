---
tags:
  - 면접
  - 스터디
  - Network
---
[[NAT]]는 사설 네트워크의 호스트가 외부의 공개된 네트워크에 연결할 수 있도록 상호 간에 주소를 변환해 주는 기술입니다. NAT는 IPv4의 주소 부족 문제를 완화하기 위해 등장했습니다.  

> [!QUESTION]- 여러 장치가 하나의 공인 IP를 쓰는데 응답을 어떻게 구분하나요?
> 일반적으로 [[NAPT]] 또는 PAT를 사용합니다. 공유기가 사설 IP와 포트 번호를 공인 IP의 서로 다른 포트 번호로 변환하고, 이 매핑 정보를 NAT 테이블에 저장합니다. 이후 응답이 돌아오면 목적지 포트를 기준으로 NAT 테이블을 조회해서 어떤 내부 장치로 전달할지 판단합니다.

> [!QUESTION]- NAT를 쓰면 private IP가 암호화되는건가요?
>  IP address가 변환될 뿐 payload가 암호화되는 것은 아닙니다.  
>  필요하면 TLS, IPsec 같은 별도 보안 프로토콜이 필요합니다.  

> [!QUESTION]- 외부에서 먼저 사설망 내부 서버에 접속하려면 어떻게 하나요?
> 동적 NAT 매핑이 없는 외부의 임의 연결은 내부의 어느 호스트로 전달해야 하는지 알 수 없기 때문에 기본적으로 전달할 수 없고, [[Port Forwarding|포트 포워딩]] 같은 명시적인 매핑이 필요합니다.  

> [!QUESTION]- EC2에서는 왜 포트 포워딩을 직접 설정하지 않나요?
> EC2에 Public IPv4가 할당되어 있어도 실제 인스턴스는 Private IPv4를 사용합니다. AWS Internet Gateway가 Public IPv4와 EC2의 Private IPv4 사이에서 1:1 NAT를 수행하기 때문에 사용자가 공유기처럼 별도의 포트 포워딩을 설정하지 않아도 됩니다. 다만 인터넷에서 접근하려면 Internet Gateway로 향하는 Route와 Public IP가 필요하고, Security Group에서도 해당 포트의 트래픽을 허용해야 합니다. 


%%%%
## 출처 및 참고자료

```cardlink
url: https://chaaany.tistory.com/287
title: "NAT와 NAPT 차이: IP 변환·포트 변환·포트 포워딩 구분"
description: "NAT는 packet의 IP address를 다른 address로 바꾸는 기술의 넓은 이름이다. NAPT는 IP address뿐 아니라 TCP·UDP port 같은 transport identifier까지 함께 바꾼다. 가정용 router에서 여러 device가 public IPv4 하나를 공유할 때 흔히 NAT라고 부르는 기능은 대부분 NAPT에 가깝다.PAT(Port Address Translation)라는 이름도 자주 보이지만 RFC 2663의 용어는 NAPT(Network Address Port Translation)다.NAT와 NAPT를 한 표로 비교하기구분변환 기준대표적인 mapping일반적인 용도Basic NATIP address10.0.0.10 ↔ 198.51.100.10private·pu.."
host: chaaany.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdLv6Iq%2FbtsI2CHZdmy%2FAAAAAAAAAAAAAAAAAAAAADgZuFFhZlV1i-4FrI1e2KSjBWBp1pJ7Xb_W2WC2ZUwi%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D0E38LqMneQ1%252BPUiUeGb%252FQbkAA5o%253D
```

