interface Props {
  notes: {
    id: string;
    title: string;
    updatedAt: string;
  }[];
}

export default function RecentNotes({ notes }: Props) {
  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Recent Notes</h2>

        <p className="mt-1 text-sm text-zinc-500">Recently edited notes.</p>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <h3 className="font-medium">{note.title}</h3>

            <p className="mt-1 text-sm text-zinc-500">
              Updated {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
