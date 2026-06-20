interface Props {
  tags: {
    name: string;
    count: number;
  }[];
}

export default function TopTags({ tags }: Props) {
  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Top Tags</h2>

        <p className="mt-1 text-sm text-zinc-500">Most frequently used tags.</p>
      </div>

      <div className="space-y-4">
        {tags.map((tag) => (
          <div
            key={tag.name}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white" />

              <p className="font-medium">#{tag.name}</p>
            </div>

            <span className="text-sm text-zinc-500">{tag.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
