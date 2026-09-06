---
tags:
  - 면접
  - 스터디
  - OS
---
**Page Fault는 접근한 가상 페이지가 현재 매핑으로 처리되지 않거나 접근 권한에 문제가 있을 때 발생하는 예외입니다.** 대표적으로 필요한 페이지가 물리 메모리에 없는 경우이며, 항상 프로그램 오류를 뜻하지는 않습니다.

요구 페이징에서의 대표적인 처리 순서는 다음과 같습니다.

1. CPU가 예외를 발생시켜 커널의 Page Fault 핸들러로 제어를 넘깁니다.
2. 커널이 유효한 주소와 허용된 접근인지 확인합니다. 복구할 수 없는 잘못된 접근이면 오류를 전달합니다.
3. 물리 프레임을 확보하고, 부족하면 기존 페이지를 회수·교체합니다.
4. 필요에 따라 파일·스왑에서 읽거나, 0으로 채운 페이지를 준비하거나, Copy-on-Write 복사를 수행합니다.
5. 페이지 테이블과 필요한 TLB 상태를 갱신하고, 중단된 명령을 다시 실행합니다.

디스크 I/O가 필요한 경우에는 해당 작업이 대기하는 동안 다른 작업을 실행할 수 있습니다.

> [!QUESTION]- Page Fault가 발생하면 항상 디스크에서 읽나요?
> 아닙니다. 디스크 I/O 없이 처리하는 Minor Fault와 I/O가 필요한 Major Fault로 구분할 수 있습니다. 이미 메모리에 있는 페이지를 매핑하거나 Copy-on-Write 복사로 해결되는 경우는 디스크 읽기가 필요하지 않을 수 있습니다.

> [!QUESTION]- TLB Miss와 Page Fault는 무엇이 다른가요?
> TLB Miss는 주소 변환 캐시에 정보가 없는 상태입니다. 페이지 테이블에 유효한 매핑과 권한이 있으면 이를 조회해 처리할 수 있으므로, TLB Miss가 반드시 Page Fault로 이어지는 것은 아닙니다.

> [!QUESTION]- Copy-on-Write 쓰기도 접근 권한 오류인데 왜 종료되지 않나요?
> 운영체제가 공유 페이지를 일시적으로 읽기 전용으로 설정한 경우, 쓰기 예외를 복사 시점으로 활용할 수 있기 때문입니다. 커널은 쓰기가 허용된 논리적 영역인지 확인한 뒤 별도 페이지를 복사·매핑하고 쓰기를 재개합니다.

## 출처 및 참고자료

- [Beyond Physical Memory: Mechanisms - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys.pdf)
- [getrusage(2) - Linux manual](https://man7.org/linux/man-pages/man2/getrusage.2.html)
- [fork(2) - Linux manual](https://man7.org/linux/man-pages/man2/fork.2.html)
