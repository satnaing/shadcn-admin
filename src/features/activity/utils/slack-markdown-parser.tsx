import React from 'react'

/**
 * Parses Slack-style markdown and converts it to React elements
 * Supports:
 * - `code` blocks
 * - *bold* text
 * - > blockquotes
 * - <url|text> links
 */
export function parseSlackMarkdown(text: string): React.ReactNode[] {
  if (!text) return []

  const elements: React.ReactNode[] = []
  let key = 0

  // Split text by lines to handle blockquotes properly
  const lines = text.split('\n')

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      elements.push(<br key={`br-${key++}`} />)
    }

    // Check if this line is a blockquote
    if (line.startsWith('>')) {
      const content = line.replace(/^>\s*/, '')
      elements.push(
        <blockquote
          key={`blockquote-${key++}`}
          className='border-muted-foreground/30 text-muted-foreground border-l-4 pl-4 italic'
        >
          {parseLineContent(content)}
        </blockquote>
      )
    } else {
      elements.push(...parseLineContent(line))
    }
  })

  function parseLineContent(lineText: string): React.ReactNode[] {
    const lineElements: React.ReactNode[] = []
    let lineCurrentIndex = 0

    // Find all matches in this line
    const matches = Array.from(lineText.matchAll(/(`[^`]+`|\*[^*]+\*|<[^|>]+\|[^>]+>)/g))

    matches.forEach((match) => {
      const matchIndex = match.index!

      // Add any text before this match
      if (matchIndex > lineCurrentIndex) {
        lineElements.push(lineText.slice(lineCurrentIndex, matchIndex))
      }

      const matchedText = match[0]

      // Handle code blocks
      if (matchedText.startsWith('`') && matchedText.endsWith('`')) {
        const code = matchedText.slice(1, -1)
        lineElements.push(
          <code
            key={`code-${key++}`}
            className='bg-muted rounded-sm px-1.5 py-0.5 font-mono text-xs'
          >
            {code}
          </code>
        )
      }
      // Handle bold text
      else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
        const bold = matchedText.slice(1, -1)
        lineElements.push(
          <strong key={`bold-${key++}`} className='font-semibold'>
            {bold}
          </strong>
        )
      }
      // Handle links
      else if (matchedText.startsWith('<') && matchedText.includes('|')) {
        const linkMatch = matchedText.match(/<([^|>]+)\|([^>]+)>/)
        if (linkMatch) {
          const [, url, linkText] = linkMatch
          lineElements.push(
            <a
              key={`link-${key++}`}
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:text-primary/80 underline underline-offset-4'
            >
              {linkText}
            </a>
          )
        }
      }

      lineCurrentIndex = matchIndex + matchedText.length
    })

    // Add any remaining text
    if (lineCurrentIndex < lineText.length) {
      lineElements.push(lineText.slice(lineCurrentIndex))
    }

    return lineElements
  }

  return elements
}
