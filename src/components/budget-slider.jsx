import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useSelector, useDispatch } from "react-redux";
import { setBudget } from "@/form-filter/filterSlice";

export default function BudgetSlider() {
  const min_price = 200
  const max_price = 20000


  // 2. Get the dispatch function
  const dispatch = useDispatch();

  // 3. Read the budget value from the Redux store instead of useState
  // We use 'state.filter' because you named the slice "filter"
  // in your store configuration (see next step).
  const value = useSelector((state) => state.filter.budget);

  const formatPrice = (price) => {
    return price === max_price
      ? `$${price.toLocaleString()}+`
      : `$${price.toLocaleString()}`;
  }

  // 5. Create a handler function to dispatch the new value
  // This function will be called by the Slider's onValueChange
  const handleValueChange = (newValue) => {
    // This sends the 'newValue' (e.g., [3100, 7900])
    // as the 'action.payload' to your 'setBudget' reducer
    dispatch(setBudget(newValue));
  };

  return (
    <div className="*:not-first:mt-3 p-3">
      <Label className="tabular-nums text-sm">
        From {formatPrice(value[0])} to {formatPrice(value[1])}
      </Label>
      <div className="flex items-center gap-4 ">
        <Slider
          value={value}
          onValueChange={handleValueChange}
          min={min_price}
          max={max_price}
          step={100}
          aria-label="Price range slider" />
      </div>
    </div>
  );
}
