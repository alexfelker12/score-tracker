import { TrackerLinkProps } from "@/app/trackers/_components/tracker-link";

export const TRACKERS: TrackerLinkProps[] = [
  {
    name: "Schwimmen",
    href: "/schwimmen",
    description: "Achieve the highest amount of points with 3 cards.",
    categories: ["Cards", "2-9 Players"]
  },
]

export const SCHWIMMENLOCALSTORAGEBASEKEY = "schwimmen-tracker-base"


export const SCHWIMMEN_ICON_SIZE_MAP = [
  "size-6",
  "size-7",
  "size-8",
  "size-9",
  "size-10",
] as const

export const SCHWIMMEN_TEXT_SIZE_MAP = [
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
] as const
