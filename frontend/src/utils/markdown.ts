import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export function renderMarkdown(content: string): string {
  const preprocessed = content.replace(
    /\[audio:([^\]]+)\]\(([^)]+)\)/g,
    (_match, name, url) =>
      `<div class="audio-card" data-audio="1"><div class="audio-title">🎵 ${name}</div><audio controls src="${url}"></audio></div>`
  )

  return marked.parse(preprocessed) as string
}