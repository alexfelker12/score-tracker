import type { TrackerLinkProps } from "@/components/trackers/tracker-link";
import { TrackerType } from "@prisma/client";

export const PATH_TO_TRACKERPROPS = {
  "schwimmen": {
    title: "Schwimmen",
    trackerType: "SCHWIMMEN" as TrackerType
  }
}

export const TRACKERS: TrackerLinkProps[] = [
  {
    name: "Schwimmen",
    href: "/schwimmen",
    description: "Achieve the highest amount of points with 3 cards.",
    categories: ["Cards", "2-9 Players"]
  },
]

export const SCHWIMMENLOCALSTORAGEBASEKEY = "schwimmen-tracker-base"

//* these are abstract sizes, exact sizes are in button.tsx under buttonVariants
export const SCHWIMMEN_TOP_ICON_SIZE_MAP = [
  "XS",
  "SM",
  "MD",
  "LG",
  "XL",
] as const

//* these are literal sizes because the components using it are custom and not shadcn-ui components
export const SCHWIMMEN_PLAYER_TEXT_SIZE_MAP = [
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
] as const

export const SCHWIMMEN_PLAYER_IMG_SIZE_MAP = [
  "size-8",
  "size-9",
  "size-10",
  "size-11",
  "size-12",
] as const

export const SCHWIMMEN_PLAYER_FALLBACK_SIZE_MAP = [
  "size-4",
  "size-5",
  "size-6",
  "size-7",
  "size-8",
] as const

export const SCHWIMMEN_PLAYER_CARD_PADDING_SIZE_MAP = [
  "p-1.5",
  "p-2",
  "p-2",
  "p-3",
  "p-3",
] as const

export const SCHWIMMEN_GAME_ICON_SIZE_MAP = [
  "size-7",
  "size-8",
  "size-9",
  "size-10",
  "size-11",
] as const

export const IGNORED_HREFS = [
  "/user",
]
