import { BreadcrumbType } from "@/components/breadcrumbs"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//? dirtyFields => form.formState.dirtyFields
export function isFormDirty(dirtyFields: unknown[]) {
  //* use some to identify any field returning true
  return Object.values(dirtyFields).some((field): boolean | unknown => {
    // check if boolean to directly return its value
    if (typeof field === "boolean") return field
    // if field is an object it could be an array or a object
    if (typeof field === "object" && field != null) {
      // if it is an array we want to know if any of its values is true and pass it to this function
      if (Array.isArray(field)) {
        return isFormDirty(field)
      } else {
        // if the field is an object we want to check if the values of this object contains any boolean values of false
        return isFormDirty(Object.values(field))
      }
    }
  })
}

//* get time passed from passed string to now in a generalized format
// export function old_timeElapsed(date: Date): string {
//   const now = new Date();
//   const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//   if (seconds < 60) {
//     return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
//   }

//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) {
//     return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
//   }

//   const hours = Math.floor(minutes / 60);
//   const days = Math.floor(hours / 24);
//   if (days < 1) {
//     return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
//   }

//   if (days < 7) {
//     return `${days} day${days !== 1 ? "s" : ""} ago`;
//   }

//   return date.toLocaleDateString();
// }
export function timeElapsed(date: Date, inSeconds: boolean = false): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (inSeconds) return `${seconds}`;

  if (seconds < 60) {
    // return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    return `just now`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days < 1) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  // if (days < 7) {
  //   return `${days} day${days !== 1 ? "s" : ""} ago`;
  // }

  return date.toLocaleDateString("de-DE", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour12: false
  });
}

//* mock longer loading times
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isToday(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dateCopy = new Date(date)
  dateCopy.setHours(0, 0, 0, 0)

  return dateCopy.getTime() === today.getTime()
}

//* create and return a nav trail from a string (eg. pathname)
export const getNavTrailFromString = (str: string): BreadcrumbType[] => {
  const strSplit = [...str.matchAll(/\/([^/]+)/g)]

  const autoNavTrail: BreadcrumbType[] = []
  strSplit.reduce((accumulator, currentValue) => {
    const href = accumulator + currentValue[0]
    const name = currentValue[1].charAt(0).toUpperCase() + currentValue[1].slice(1)
    autoNavTrail.push({ name, href })
    return href
  }, "");

  return autoNavTrail
}

// export function debounce<T extends (...args: any[]) => void>(
//   func: T,
//   delay: number
// ): (...args: Parameters<T>) => void {
//   let timer: ReturnType<typeof setTimeout>;

//   return (...args: Parameters<T>) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => func(...args), delay);
//   };
// }

export const limitCharacters = (longString: string | undefined, charLimit: number = 11) => {
  if (typeof longString === "undefined") return undefined

  const shortenedString = longString.length > charLimit
    ? `${longString.slice(0, charLimit + 1).trim()}...`
    : longString

  return shortenedString
}