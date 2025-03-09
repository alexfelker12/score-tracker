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
