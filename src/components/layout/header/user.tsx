import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { UserIcon } from 'lucide-react';

export const User = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="size-9">
          <AvatarImage></AvatarImage>
          <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        Content
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 