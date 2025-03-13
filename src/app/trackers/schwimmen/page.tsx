import { ParticipantsForm } from "./_components/participants-form";

export default function Schwimmen() {
  return (
    <main className="flex flex-col gap-6">
      <div>
        {/* heading + description */}
        <h1 className="text-2xl">Schwimmen</h1>
        <p className="text-muted-foreground text-sm">Choose all players participating in this round</p>
      </div>

      {/* form - main content */}
      <ParticipantsForm minPlayers={2} maxPlayers={9} />
    </main>
  );
}
