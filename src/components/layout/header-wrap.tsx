"use client"

import { useMediaQuery } from 'usehooks-ts'

import { WebIcon } from '@/components/layout/web-icon';
import { MainNav, MobileNav } from '@/components/layout/nav';
import { User } from '@/components/layout/user';

export const HeaderWrap = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)', {
    initializeWithValue: false
  })

  return (
    <div className="flex justify-between items-center gap-x-8 px-4 w-full max-w-4xl h-full">

      {//* conditionally render order of header components
        isDesktop ?
          <>
            {/* Web icon */}
            <WebIcon />
            {/* Nav */}
            <MainNav />
          </>
          :
          <>
            {/* Nav */}
            <MobileNav />
            {/* Web icon */}
            <WebIcon />
          </>
      }

      {/* user icon */}
      <User />

    </div>
  );
}
