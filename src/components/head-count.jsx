// This file is now fixed
import {
  MinusIcon,
  PlusIcon,
  UserIcon,
  UsersIcon,
  UserXIcon,
  UserPlusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
// STEP 1: Correct imports
import { useSelector, useDispatch } from "react-redux";
import { setHeadCount } from "@/form-filter/filterSlice"; // <-- Make sure this path is correct!

export default function HeadCount() {
  // STEP 2: Initialize dispatch
  const dispatch = useDispatch();

  // STEP 2: Fix useSelector
  const userHeadCount = useSelector((state) => state.filter.headCount);

  // These functions are now correct
  const decreaseHeadCount = () => dispatch(setHeadCount(Math.max(0, userHeadCount - 1)));
  const increaseHeadCount = () => dispatch(setHeadCount(Math.min(20, userHeadCount + 1)));

  // This logic was already perfect
  const Icon =
    userHeadCount === 0
      ? UserXIcon
      : userHeadCount === 1
        ? UserIcon
        : userHeadCount === 2
          ? UsersIcon
          : UserPlusIcon;

  return (
    <div
      className="inline-flex items-center"
      role="group"
      // STEP 3: Fix accessibility label
      aria-labelledby="headcount-control"
    >
      <span id="headcount-control" className="sr-only">
        Headcount Control
      </span>
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        aria-label="Decrease user head count"
        onClick={decreaseHeadCount}
        // STEP 3: Fix disabled logic
        disabled={userHeadCount === 0}
      >
        <MinusIcon size={16} aria-hidden="true" />
      </Button>
      <div
        className="flex items-center px-3 text-sm font-medium tabular-nums"
        aria-live="polite"
      >
        <Icon className="opacity-60" size={16} aria-hidden="true" />
        <span
          className="ms-2"
          aria-label={`Current user head count is ${userHeadCount}`}
        >
          {userHeadCount}
        </span>
      </div>
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        aria-label="Increase user head count"
        onClick={increaseHeadCount}
        // STEP 3: Add disabled logic for max value
        disabled={userHeadCount === 20}
      >
        <PlusIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}