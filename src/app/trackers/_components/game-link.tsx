import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export type GameLinkProps = {
  name: string
  href: string
  description: string
  categories: string[]
}

export const GameLink = ({ name, href, description, categories }: GameLinkProps) => {
  return (
    <Link href={href} className="group">
      <Card className="group-hover:bg-accent justify-between gap-4 py-4 w-full h-full transition-all">
        <CardHeader className="px-4">

          {/* heading + description */}
          <CardTitle className="text-lg leading-none">{name}</CardTitle>
          <CardDescription className="leading-none">{description}</CardDescription>

        </CardHeader>
        <CardContent className="gap-4 grid grid-cols-[1fr_1.5rem] px-4">

          {/* category */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, idx) => (
              <Badge key={idx}>{category}</Badge>
            ))}
          </div>

          {/* extra link to tracker */}
          <div className="flex items-center">
            <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}