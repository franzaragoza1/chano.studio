const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

// Escapes user-provided values before inserting them into email HTML templates
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch])
}

// Only allow http(s) links in href attributes; anything else becomes '#'
export function safeUrl(value: unknown): string {
  const url = String(value ?? '').trim()
  return /^https?:\/\//i.test(url) ? escapeHtml(url) : '#'
}
