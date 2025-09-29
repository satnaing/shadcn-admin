/**
 * Formats action plan text by replacing tag syntax with human-readable names
 * Converts ${type:id:label}$ to just the label
 * Example: ${user:cmdg34z290006canqiims21e0:Ido Goldberg (ido@getswan.com)}$ becomes "Ido Goldberg (ido@getswan.com)"
 */
export function formatActionPlanForDisplay(text: string): string {
  if (!text) return ''

  // Match both ${type:value}$ and ${type:value:label}$ formats
  const variableRegex = /\$\{([^:]+):([^:}]+)(?::([^}]+))?\}\$/g

  return text.replace(variableRegex, (_match, _type, value, label) => {
    // If there's a label, use it. Otherwise, use the value
    return label || value
  })
}
