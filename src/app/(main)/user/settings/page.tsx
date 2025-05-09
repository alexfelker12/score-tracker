import { Breadcrumbs } from "@/components/breadcrumbs";

export default async function UserProfile() {
  return (
    <main className="flex flex-col space-y-4 h-full">
      <Breadcrumbs />

      <div>
        {/* heading + description */}
        <h1 className="text-2xl">Settings</h1>
        <p className="text-muted-foreground text-sm italic">Cooming soon...</p>
      </div>
    </main>
  );
}
