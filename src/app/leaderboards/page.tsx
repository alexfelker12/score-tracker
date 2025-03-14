import { Breadcrumbs, BreadcrumbType } from "@/components/breadcrumbs";

const navTrail: BreadcrumbType[] = [
  {
    name: "leaderboards",
  }
]

export default function Leaderboards() {
  return (
    <main className="flex flex-col gap-6">
      <Breadcrumbs navTrail={navTrail} />
      Leaderboards
      <br />
    </main>
  );
}
