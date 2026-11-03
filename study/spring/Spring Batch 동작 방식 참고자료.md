---
date: 2026-11-03
tags:
  - Spring
ai: true
---
> [!INFO]
> 해당 동작 방식은 **Spring Batch 6.0.6** 기준이다.

JobOperator → JobRepository → JobExecution 생성 → Job → Step → Reader → Processor → Writer → Commit → 다음 Chunk → Job 종료

```mermaid
flowchart TD
    A["Scheduler / API / Command Line"] --> B["JobOperator"]

    B -->|"Job + JobParameters"| C["JobRepository"]

    C --> D["JobInstance 조회 / 생성"]
    D --> E["JobExecution 생성"]

    E --> F["Job 실행"]

    F --> G["Step 1 실행"]
    G --> H["Step 2 실행"]
    H --> I["..."]

    subgraph STEP["Chunk-Oriented Step"]
        G1["Chunk 시작"]
        G2["ItemReader<br/>데이터 1개씩 읽기"]
        G3["ItemProcessor<br/>데이터 가공"]
        G4{"Chunk Size만큼<br/>모였는가?"}
        G5["ItemWriter<br/>Chunk 단위 쓰기"]
        G6["StepExecution / ExecutionContext 갱신"]
        G7["Transaction Commit"]
        G8{"읽을 데이터가<br/>남았는가?"}

        G1 --> G2
        G2 --> G3
        G3 --> G4
        G4 -->|"No"| G2
        G4 -->|"Yes"| G5
        G5 --> G6
        G6 --> G7
        G7 --> G8
        G8 -->|"Yes"| G1
    end

    G --> G1
    G8 -->|"No"| H

    I --> J["JobExecution 상태 갱신"]
    J --> K["Job 완료"]

    C -. "Batch Metadata 저장" .-> M[("Batch Metadata DB")]
    E -.-> M
    G6 -.-> M
    J -.-> M
```

청크 내부 동작


## 출처 및 참고자료

```cardlink
url: https://chatgpt.com/share/6ae9e6f6-d128-83ee-b87f-75e1f7d662e4
title: "이 채팅을 확인해 보세요"
description: "누군가 회원님이 보고 싶어 할 것 같다고 생각한 채팅입니다."
host: chatgpt.com
favicon: /favicon.ico
image: https://ogimg.chatgpt.com/conversation/6ae9e6f6-d128-83ee-b87f-75e1f7d662e4/response_multicolor_v1.png
```

