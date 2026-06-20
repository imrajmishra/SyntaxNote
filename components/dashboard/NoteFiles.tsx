"use client";

interface NoteGroup {
  title: string;
  notes: string[];
}

const noteGroups: NoteGroup[] = [
  {
    title: "This Month",
    notes: ["Authentication"],
  },
  {
    title: "Older",
    notes: [
      "Backend Notes",
      "CSS Notes",
      "HTML Notes",
      "MySQL Notes",
    ],
  },
];

export default function NoteFile() {
  return (
    <div className="min-h-60 flex flex-col overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {noteGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <h3 className="text-zinc-500 text-sm font-medium mb-4 uppercase tracking-wide">
              {group.title}
            </h3>

            <div className="space-y-2">
              {group.notes.map((note) => (
                <button
                  key={note}
                  className="
                    w-full
                    text-left
                    rounded-lg
                    px-3
                    py-2
                    text-zinc-200
                    hover:bg-zinc-900
                    transition-colors
                  "
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
