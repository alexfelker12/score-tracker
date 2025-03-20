import Image from "next/image";
import Link from "next/link";

export const WebIcon = () => {
  return (
    <Link href="/" className="flex items-center gap-1.5 p-1 -translate-x-1">
      <Image
        src="/favicon-32x32.png"
        alt="Icon" width={32} height={32} quality={100}
        className="size-6"
      />
      <span className="text-muted-foreground italic">BW</span>
    </Link>
  );
} 