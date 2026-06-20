import { FileText, Sparkles, Tags } from "lucide-react";

interface Props {
  totalNotes: number;
  aiUsageCount: number;
  totalTags: number;
}

export default function StatsCards({
  totalNotes,
  aiUsageCount,
  totalTags,
}: Props) {
  const cards = [
    {
      title: "Total Notes",
      value: totalNotes,
      icon: FileText,
    },
    {
      title: "AI Usage",
      value: aiUsageCount,
      icon: Sparkles,
    },
    {
      title: "Top Tags",
      value: totalTags,
      icon: Tags,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">{card.title}</p>

                <h3 className="mt-3 text-4xl font-bold tracking-tight">
                  {card.value}
                </h3>
              </div>

              <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-3">
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
