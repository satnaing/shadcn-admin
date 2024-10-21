import { useState } from 'react'

export default function useCandidateNameForm({}: {}) {
  const [isInput, setIsInput] = useState(false)

  return { isInput, setIsInput }
}
