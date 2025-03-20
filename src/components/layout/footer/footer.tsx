import { ModeToggle } from '@/components/theme-toggle'
import { FullscreenToggle } from '@/components/layout/header/fullscreen-toggle';

export default function Footer() {
  return (
    <footer className="flex justify-center md:border-t w-full md:h-16">
      <div className="md:flex justify-end items-center gap-x-4 hidden px-4 w-full max-w-4xl h-full">
        <FullscreenToggle />
        <ModeToggle />
      </div>
    </footer>
  );
}
