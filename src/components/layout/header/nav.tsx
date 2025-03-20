import Link from "next/link";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";

import { MenuIcon } from "lucide-react";
import { FullscreenToggle } from "./fullscreen-toggle";

export const MainNav = () => {
  return (
    <nav className="md:flex gap-6 hidden">
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
        <SheetFooter className="gap-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Toggle fullscreen</span>
            <FullscreenToggle />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Toggle theme</span>
            <ModeToggle />
          </div>
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
    href: "/trackers",
    text: "Trackers"
  },
  {
    href: "/leaderboards",
    text: "Leaderboards"
  },
]
