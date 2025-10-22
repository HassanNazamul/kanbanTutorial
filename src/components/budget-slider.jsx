"use client"

import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function BudgetSlider() {
  const min_price = 200
  const max_price = 20000
  const [value, setValue] = useState([3000 , 8000])

  const formatPrice = (price) => {
    return price === max_price
      ? `$${price.toLocaleString()}+`
      : `$${price.toLocaleString()}`;
  }

  return (
    <div className="*:not-first:mt-3 p-3">
      <Label className="tabular-nums text-sm">
        From {formatPrice(value[0])} to {formatPrice(value[1])}
      </Label>
      <div className="flex items-center gap-4 ">
        <Slider
          value={value}
          onValueChange={setValue}
          min={min_price}
          max={max_price}
          step={100}
          aria-label="Price range slider" />
      </div>
    </div>
  );
}
