---
tags:
  - 면접
  - 스터디
  - OS
---
**[[Context Switching]]은 CPU가 현재 작업의 실행 상태를 저장하고 다른 작업의 상태를 복원해 실행 대상을 바꾸는 과정입니다.** [[process|프로세스]] 사이뿐 아니라 같은 프로세스의 [[thread|스레드]] 사이에서도 발생합니다.

비용은 크게 두 가지입니다.

- **직접 비용**: 레지스터·프로그램 카운터·스택 포인터 저장과 복원, 스케줄러 실행 등의 작업이 필요합니다.
- **간접 비용**: 실행 대상이 바뀌면서 CPU 캐시 적중률이 떨어질 수 있고, 주소 공간이 달라지면 주소 변환 캐시인 [[TLB]]의 재활용에도 영향을 줍니다.

같은 프로세스의 스레드끼리는 주소 공간을 바꾸지 않아 대체로 비용이 작습니다. 다만 컨텍스트 스위칭이 잦으면 실제 작업에 쓸 CPU 시간이 줄어듭니다.

> [!QUESTION]- 시스템 콜이 발생하면 항상 컨텍스트 스위칭이 발생하나요?
> 아닙니다. 시스템 콜은 사용자 모드에서 커널 모드로 전환되지만, 같은 스레드가 커널 작업을 수행하고 돌아올 수 있습니다. 대기나 선점 때문에 실행 대상까지 바뀔 때 문맥 교환이 발생합니다.

> [!QUESTION]- 문맥 교환이 일어나면 캐시와 TLB를 모두 비우나요?
> CPU 캐시를 매번 전부 비우는 것은 아닙니다. TLB도 ASID 같은 주소 공간 식별자를 지원하면 여러 프로세스의 변환 정보를 구분해 유지할 수 있으므로, 무효화 범위는 하드웨어와 운영체제 구현에 따라 달라집니다.

> [!QUESTION]- 자발적 문맥 교환과 비자발적 문맥 교환은 어떻게 다른가요?
> 자발적 문맥 교환은 I/O나 잠금 대기 등으로 작업이 CPU를 내놓을 때 발생합니다. 비자발적 문맥 교환은 타임 슬라이스 소진이나 더 높은 우선순위 작업의 실행 등으로 선점될 때 발생합니다.

## 출처 및 참고자료

- [Mechanism: Limited Direct Execution - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf)
- [Paging: Faster Translations (TLBs) - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf)
- [getrusage(2) - Linux manual](https://man7.org/linux/man-pages/man2/getrusage.2.html)
