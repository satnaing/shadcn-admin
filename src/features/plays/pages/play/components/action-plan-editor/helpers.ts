export function parseContent(text: string): any {
  if (!text) return ''

  // Split text by double newlines to preserve paragraph structure
  const paragraphs = text.split('\n\n').filter((p) => p !== undefined)

  const parseParagraph = (paragraphText: string) => {
    // Match both ${type:value}$ and ${type:value:label}$ formats
    const variableRegex = /\$\{([^:]+):([^:}]+)(?::([^}]+))?\}\$/g
    let lastIndex = 0
    const content: any[] = []

    let match
    while ((match = variableRegex.exec(paragraphText)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const textContent = paragraphText.slice(lastIndex, match.index)
        if (textContent) {
          content.push({
            type: 'text',
            text: textContent,
          })
        }
      }

      // Add the tag node
      const [, type, value, label] = match
      content.push({
        type: 'tag',
        attrs: {
          id: value,
          type: type === 'slack-channel' || type === 'hubspot-list' ? 'channel' : type,
          subtype: type === 'slack-channel' || type === 'hubspot-list' ? type : undefined,
          label: label || value, // Use the label if provided, otherwise fallback to value
          value: value,
        },
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < paragraphText.length) {
      const remainingText = paragraphText.slice(lastIndex)
      if (remainingText) {
        content.push({
          type: 'text',
          text: remainingText,
        })
      }
    }

    return content
  }

  // Filter out completely empty paragraphs and create paragraph nodes
  const contentParagraphs = paragraphs
    .map((p) => {
      const content = parseParagraph(p)
      if (content.length > 0 || p === '') {
        return {
          type: 'paragraph',
          content: content.length > 0 ? content : [],
        }
      }
      return null
    })
    .filter((p) => p !== null)

  // Ensure at least one paragraph exists
  if (contentParagraphs.length === 0) {
    contentParagraphs.push({
      type: 'paragraph',
      content: [],
    })
  }

  return {
    type: 'doc',
    content: contentParagraphs,
  }
}
