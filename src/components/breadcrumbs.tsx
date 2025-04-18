"use client"

//* react/next
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

//* lib
import { getNavTrailFromString } from "@/lib/utils";

//* icons
import { HouseIcon } from "lucide-react";

//* components
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";


type SingleBreadcrumb = {
  dropdown?: false
  name: string
  href?: string
}

type DropdownBreadcrumb = {
  dropdown: true
  dropdownCrumbs: Required<Omit<SingleBreadcrumb, "dropdown">>[]
}

export type BreadcrumbType = SingleBreadcrumb | DropdownBreadcrumb

export type BreadcrumbsProps = {
  navTrail?: BreadcrumbType[]
  lastTrail?: BreadcrumbType
}

export const Breadcrumbs = ({ navTrail, lastTrail }: BreadcrumbsProps) => {
  const pathname = usePathname()

  const crumbs: BreadcrumbType[] = navTrail || getNavTrailFromString(pathname)

  //* helper function to determine if crumb is last item of navTrail
  const isLastCrumb = (crumbs: BreadcrumbType[], idx: number) => {
    return crumbs.length === idx + 1
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>

        {/* base home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/"><HouseIcon className="size-5" /></Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* for every crumb in the nav trail render a separator and crumb item */}
        {crumbs.map((crumb, idx) => {
          const lastCrumb = isLastCrumb(crumbs, idx)
          //* if last trail is provided, overwrite last iteration with last trail
          const dynLastCrumb = lastCrumb && lastTrail ? lastTrail : false
          const thisCrumb = dynLastCrumb || crumb

          return (
            <React.Fragment key={idx}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {/* determine if crumbItem is a dropdown */}
                {thisCrumb.dropdown
                  ?
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="w-4 h-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {thisCrumb.dropdownCrumbs.map((dropdownCrumb, idx) => (
                        <DropdownMenuItem key={idx} asChild>
                          <Link href={dropdownCrumb.href}> {/* href of breadcrumb */}
                            {dropdownCrumb.name} {/* name of breadcrumb */}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  :
                  /* if href was passed and not last crumb, treat crumb item as link */
                  thisCrumb.href && !lastCrumb ?
                    <BreadcrumbLink asChild>
                      <Link href={thisCrumb.href}>{thisCrumb.name}</Link>
                    </BreadcrumbLink>
                    :
                    // if last crumb render <BreadCrumbPage />, else a simple span
                    lastCrumb
                      ? <BreadcrumbPage>{thisCrumb.name}</BreadcrumbPage>
                      : <span>{thisCrumb.name}</span>
                }
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}

      </BreadcrumbList>
    </Breadcrumb >
  )
}
