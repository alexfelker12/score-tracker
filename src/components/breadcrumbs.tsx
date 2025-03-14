import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HouseIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export type BreadcrumbType = {
  name: string
  href?: string
}

export type BreadcrumbsProps = {
  navTrail: BreadcrumbType[]
}

export const Breadcrumbs = ({ navTrail }: BreadcrumbsProps) => {
  //* helper function to determine if crumb is last item of navTrail
  const isLastCrumb = React.useCallback((idx: number) => {
    return navTrail.length === idx + 1
  }, [navTrail])

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
        {navTrail.map((crumb, idx) => {
          const lastCrumb = isLastCrumb(idx)
          return (
            <React.Fragment key={`${crumb.name}-${idx}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {/* if href was passed and not last crumb, treat crumb item as link */}
                {crumb.href && !lastCrumb ?
                  <BreadcrumbLink asChild>
                    <Link href="/trackers">{crumb.name}</Link>
                  </BreadcrumbLink>
                  :
                  // if last crumb render <BreadCrumbPage />, else a simple span
                  lastCrumb
                    ? <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                    : <span>{crumb.name}</span>
                }
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}

      </BreadcrumbList>
    </Breadcrumb >
  )
}
