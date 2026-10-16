import { QuartzComponentConstructor } from "./types"

export default (() => {
  function AiNotice() {
    return (
      <blockquote class="callout ai-callout" data-callout="ai">
        <div class="callout-title">
          <div class="callout-icon"></div>

          <div class="callout-title-inner">
            <p>해당 글은 AI의 도움을 받아 제작됐습니다.</p>
          </div>
        </div>
      </blockquote>
    )
  }

  return AiNotice
}) satisfies QuartzComponentConstructor