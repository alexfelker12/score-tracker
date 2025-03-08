import Link from "next/link";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";

import { MenuIcon } from "lucide-react";

export const MainNav = () => {
  return (
    <nav className="md:flex gap-4 hidden">
      {NAV_LINKS.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.text}
        </Link>
      ))}
    </nav>
  );
}

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="block md:hidden">

        {/* Menu Button */}
        <Button variant="outline" size="icon">
          <MenuIcon className="size-5" />
        </Button>
        
      </SheetTrigger>
      <SheetContent side="left">

        {/* header */}
        <SheetHeader>
          <SheetTitle className="text-lg">Menu</SheetTitle>
          <SheetDescription>Find all important links here</SheetDescription>
        </SheetHeader>

        {/* main section */}
        <nav className="flex flex-col gap-4 px-4">
          {NAV_LINKS.map((item) => (
            <SheetClose key={item.href} asChild>
              <Link href={item.href} className="font-semibold">
                {item.text}
              </Link>
            </SheetClose>
          ))}
        </nav>

        {/* footer */}
        <SheetFooter className="items-end">
          <ModeToggle />
        </SheetFooter>

      </SheetContent>
    </Sheet>

  );
}

export type NavLinkItem = {
  href: string
  text: string
}

export const NAV_LINKS: NavLinkItem[] = [
  {
    href: "/games",
    text: "Games"
  },
  {
    href: "/leaderboards",
    text: "Leaderboards"
  },
]
