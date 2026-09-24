---
tags:
  - OS
aliases:
  - 세그먼트 테이블
---
세그먼트 **테이블** 은 운영 체제가 프로세스에 할당된 세그먼트를 추적하는 데 사용하는 데이터 구조이다.  ^intro

세그먼트 테이블의 각 항목에는 다음과 같은 정보가 포함된다.  

- **Segment Number** - 각 세그먼트를 고유하게 식별하는 번호입니다.
- **Base Address** - 메모리에서 해당 세그먼트의 시작 물리적 주소입니다.
- **Limit** - 세그먼트의 크기로, 세그먼트 내에서 접근할 수 있는 최대 오프셋을 정의합니다.

![[IMG-20260910024552700.png|600]]

## 출처 및 참고자료

```cardlink
url: https://www.tutorialspoint.com/operating_system/os_segmentation.htm
title: "Operating System - Segmentation"
description: "Segmentation is a memory management technique used in non-contiguous memory allocation systems. This chapter will explain segmentation, how it works, and its implementation in operating systems."
host: www.tutorialspoint.com
favicon: https://www.tutorialspoint.com/images/favicon.ico
image: https://www.tutorialspoint.com/images/tp_logo_436.png
```

```cardlink
url: https://www.geeksforgeeks.org/operating-systems/segmentation-in-operating-system/
title: "Segmentation in Operating System - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```
