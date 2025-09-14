import { MainNav, MobileNav } from '@/components/layout/header/nav';
import { WebIcon } from '@/components/layout/header/web-icon';


import { User } from './user';
import { cn } from '@/lib/utils';


export default function Header() {
  const withBackdrop = false
  return (
    <header
      className={cn(
        "top-0 z-50 sticky flex justify-center border-b h-16",
        withBackdrop
          ? "bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur"
          : "bg-background"
      )}
    >
      <div className="flex justify-between items-center gap-x-8 px-4 w-full max-w-4xl h-full">

        {/* Mobile Nav */}
        <MobileNav />

        {/* Web icon */}
        <WebIcon />

        {/* Main Nav */}
        <MainNav />

        {/* user icon */}
        <User />

      </div>
    </header>
  );
}
