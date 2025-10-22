import { useState } from "react"
import {
  MinusIcon,
  PlusIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeXIcon,
  UserIcon,     // 1 person
  UsersIcon,    // 2 people
  UserXIcon,    // 0 people
  UserPlusIcon, // 3+ people (or "add more")
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function HeadCount() {
  const [userHeadCount, setUserHeadCount] = useState(1) // Initialize user head count state (0-9)

  const decreaseHeadCount = () => setUserHeadCount((prev) => Math.max(0, prev - 1))
  const increaseHeadCount = () => setUserHeadCount((prev) => Math.min(20, prev + 1))

  const Icon =
    userHeadCount === 0
      ? UserXIcon     // 0 users
      : userHeadCount === 1
        ? UserIcon    // 1 user
        : userHeadCount === 2
          ? UsersIcon   // 2 users
          : UserPlusIcon  // 3 or more users

  return (
    <div
      className="inline-flex items-center"
      role="group"
      aria-labelledby="volume-control">
      <span id="volume-control" className="sr-only">
        Volume Control
      </span>
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        aria-label="Decrease user head count"
        onClick={decreaseHeadCount}
        disabled={userHeadCount === 1}>
        <MinusIcon size={16} aria-hidden="true" />
      </Button>
      <div
        className="flex items-center px-3 text-sm font-medium tabular-nums"
        aria-live="polite">
        <Icon className="opacity-60" size={16} aria-hidden="true" />
        <span className="ms-2" aria-label={`Current user head count is ${userHeadCount}`}>
          {userHeadCount}
        </span>
      </div>
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        aria-label="Increase user head count"
        onClick={increaseHeadCount}>
        <PlusIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}
