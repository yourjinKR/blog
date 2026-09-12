---
tags:
  - 면접
  - 스터디
  - OS
---
**[[Paging|페이징]]은 [[Virtual Memory|가상 메모리]]를 고정 크기의 페이지로, 물리 메모리를 같은 크기의 프레임으로 나누어 매핑하는 방식입니다. 내부 단편화는 할당받은 메모리 안에서 사용하지 못하고 남는 공간입니다.**

페이지 테이블이 페이지 번호를 프레임 번호로 변환하므로, 프로세스의 페이지들을 물리 메모리에 연속해서 배치할 필요가 없습니다. 가상 주소는 **페이지 번호와 페이지 내 오프셋**으로 나뉘며, 변환 후에도 오프셋은 유지됩니다.

예를 들어 페이지 크기가 4 KiB이고 10 KiB의 공간을 페이지 단위로 할당하면 3개 페이지, 즉 12 KiB가 필요합니다. 이때 남는 2 KiB가 내부 단편화입니다. 페이징은 기본 페이지 프레임 할당에서 외부 단편화를 피하지만, 내부 단편화와 페이지 테이블 관리 비용이 발생합니다.

> [!QUESTION]- 페이지 크기를 작게 하면 무조건 유리한가요?
> 작게 하면 마지막 페이지의 낭비를 줄일 수 있지만 페이지 수와 페이지 테이블 크기가 늘어납니다. 같은 수의 [[TLB]] 항목으로 다룰 수 있는 메모리 범위도 작아지므로 절충이 필요합니다.

> [!QUESTION]- TLB는 무엇이며 왜 필요한가요?
> 최근 사용한 가상 페이지와 물리 프레임의 변환 정보를 저장하는 캐시입니다. 매번 페이지 테이블을 조회하는 비용을 줄이며, 적중하면 캐시된 매핑으로 주소를 빠르게 변환할 수 있습니다.

> [!QUESTION]- 페이징을 쓰면 모든 메모리 단편화가 사라지나요?
> 아닙니다. 페이지 내부의 낭비는 남고, 힙 할당자의 가변 크기 할당에서도 단편화가 생길 수 있습니다. 큰 페이지처럼 연속된 물리 프레임이 필요한 요청은 물리 메모리 단편화의 영향을 받을 수 있습니다.

> [!QUESTION]- Page 크기를 정할 때 고려해야 할 사항은 무엇인가요?
> 작은 Page는 내부 단편화와 한 번의 Page Fault에서 읽는 불필요한 데이터를 줄이지만, Page Table 항목 수와 관리할 Page 수가 늘고 같은 TLB 항목으로 다룰 수 있는 메모리 범위가 작아집니다. 큰 Page는 Page Table과 TLB Miss 부담, 연속 접근의 I/O 횟수를 줄일 수 있지만 내부 단편화와 I/O 증폭, 긴 Fault 처리 시간, 큰 연속 물리 공간 확보 비용이 커질 수 있습니다. 따라서 Working Set과 접근 지역성, 메모리 낭비, TLB Reach, 저장장치 특성을 함께 고려합니다.

## 출처 및 참고자료

- [Paging: Introduction - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf)
- [Paging: Faster Translations (TLBs) - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf)
- [Concepts overview - Linux Kernel documentation](https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html)
- [Paging: Smaller Tables - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-smalltables.pdf)
