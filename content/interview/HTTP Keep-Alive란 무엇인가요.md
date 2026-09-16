---
tags:
  - 면접
  - 스터디
  - Network
---
[[HTTP Keep-Alive]]는 HTTP 요청마다 TCP 연결을 새로 생성하지 않고 기존 TCP 연결을 여러 요청에서 재사용하는 방식입니다. 이를 통해 [[TCP 3-way handshake]]나 HTTPS의 TLS Handshake와 같은 연결 생성 비용을 줄여 응답 지연과 네트워크 오버헤드를 줄일 수 있습니다. HTTP/1.1부터 지속 연결이 기본이며, 일정 시간 요청이 없으면 서버의 Keep-Alive Timeout 등에 의해 연결이 종료됩니다.  

> [!QUESTION]- HTTP Keep-Alive를 사용하면 어떤 장점이 있나요?
> 요청마다 새로운 TCP 연결을 생성하지 않고 기존 연결을 재사용할 수 있기 때문에
> TCP 3-Way Handshake에 필요한 비용과 네트워크 지연을 줄일 수 있습니다.
> HTTPS 환경에서는 TLS Handshake 비용도 줄일 수 있기 때문에 효과가 더 큽니다.
>
> 다만 연결을 계속 유지하면 서버가 소켓 등의 자원을 점유하게 되므로
> 일반적으로 Keep-Alive Timeout이나 최대 요청 횟수를 설정하여 연결을 관리합니다.

> [!QUESTION]- HTTP/1.1에서 Keep-Alive를 사용하면 여러 요청을 동시에 처리할 수 있나요?
> Keep-Alive 자체는 TCP 연결을 재사용하는 기능일 뿐,
> 여러 요청을 동시에 처리하도록 만들어주는 기능은 아닙니다.
>
> HTTP/1.1에서는 하나의 연결에서 여러 요청을 순차적으로 처리하는 것이 일반적이므로
> 앞선 요청의 응답이 늦어지면 뒤의 요청도 영향을 받을 수 있습니다.
> 이러한 문제를 개선하기 위해 [[HTTP 2|HTTP 2.0]]에서는 하나의 연결에 여러 Stream을 두는
> [[Multiplexing]]을 지원합니다.

> [!QUESTION]- HTTP Keep-Alive와 TCP Keepalive는 같은 기능인가요?
> 아닙니다.
>
> HTTP Keep-Alive는 하나의 TCP 연결을 여러 HTTP 요청과 응답에서 재사용하기 위한 기능입니다.
> 반면 TCP Keepalive는 일정 시간 데이터가 오가지 않는 TCP 연결에서
> 상대 호스트가 여전히 정상적으로 연결되어 있는지를 확인하기 위한 TCP 수준의 기능입니다.
>

> [!QUESTION]- HTTP/3에서도 Keep-Alive라는 개념이 있나요?
> HTTP/3에서도 연결을 재사용한다는 개념 자체는 존재하지만
> HTTP/1.1과 같은 TCP Keep-Alive Connection은 아닙니다.
>
> HTTP/3는 TCP 대신 QUIC을 사용하고,
> 하나의 QUIC Connection에서 여러 Stream을 처리합니다.
>
> 따라서 Connection: keep-alive 같은 HTTP/1.x의
> connection-specific 헤더도 사용하지 않습니다.