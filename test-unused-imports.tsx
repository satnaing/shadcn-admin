import React from 'react'
import { useState } from 'react'

// Only using useState from the imports above
export function TestComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
