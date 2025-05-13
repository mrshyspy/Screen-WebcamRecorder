import { useState } from "react"
import React from "react"

export function Slider({ value = [0], max = 100, step = 1, onValueChange }) {
  const [val, setVal] = useState(value[0])

  const handleChange = (e) => {
    const newVal = parseFloat(e.target.value)
    setVal(newVal)
    onValueChange([newVal])
  }

  return (
    <input
      type="range"
      value={val}
      max={max}
      step={step}
      onChange={handleChange}
      className="w-full mt-4"
    />
  )
}
