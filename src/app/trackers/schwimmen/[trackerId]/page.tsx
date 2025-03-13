export default async function TrackerSessionPage({
  params,
}: {
  params: Promise<{ trackerSessionId: string }>
}) {
  const { trackerSessionId } = await params

  return (
    <main>
      trackerSessionId: {trackerSessionId}
    </main>
  );
}
