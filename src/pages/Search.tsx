import { useState } from "react";
import Icon from "@/components/ui/icon";

const allPeople = [
  { id: 1, name: "Александр Петров", school: "Школа №47", year: "2018", initials: "АП", color: "from-amber-400 to-orange-500", mutual: 12 },
  { id: 2, name: "Мария Новикова", school: "Школа №15", year: "2019", initials: "МН", color: "from-pink-500 to-rose-600", mutual: 3 },
  { id: 3, name: "Дмитрий Кузнецов", school: "Школа №47", year: "2018", initials: "ДК", color: "from-indigo-500 to-blue-600", mutual: 8 },
  { id: 4, name: "Екатерина Смирнова", school: "Школа №3", year: "2020", initials: "ЕС", color: "from-green-400 to-emerald-500", mutual: 1 },
  { id: 5, name: "Роман Сидоров", school: "Школа №47", year: "2017", initials: "РС", color: "from-teal-400 to-cyan-600", mutual: 5 },
  { id: 6, name: "Анна Фёдорова", school: "Школа №15", year: "2018", initials: "АФ", color: "from-violet-500 to-purple-700", mutual: 7 },
];

const tags = ["Выпуск 2018", "Школа №47", "Москва", "Выпуск 2019", "IT-специалисты"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = allPeople.filter((p) => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.school.toLowerCase().includes(query.toLowerCase());
    const matchTag = !activeTag || (activeTag.includes("2018") && p.year === "2018") || (activeTag.includes("47") && p.school.includes("47"));
    return matchQ && matchTag;
  });

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Поиск</h1>

      {/* Search bar */}
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 mb-4 border border-border/50 focus-within:border-primary/50 transition-colors">
        <Icon name="Search" size={18} className="text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Имя, школа, город..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-thin">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTag === tag
                ? "bg-primary text-primary-foreground"
                : "glass text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results */}
      {query || activeTag ? (
        <div>
          <div className="text-xs text-muted-foreground mb-3">Найдено: {filtered.length}</div>
          <div className="space-y-2">
            {filtered.map((p, idx) => (
              <div
                key={p.id}
                className="glass glass-hover rounded-2xl p-4 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-sm font-semibold">{p.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.school} · Выпуск {p.year}</div>
                  {p.mutual > 0 && (
                    <div className="text-xs text-primary mt-0.5">{p.mutual} общих друга</div>
                  )}
                </div>
                <button
                  onClick={() => setAdded((prev) => {
                    const n = new Set(prev);
                    if (n.has(p.id)) n.delete(p.id); else n.add(p.id);
                    return n;
                  })}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    added.has(p.id)
                      ? "bg-secondary text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {added.has(p.id) ? "Заявка отправлена" : "Добавить"}
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="SearchX" size={32} className="mx-auto mb-3 opacity-40" />
                <div className="text-sm">Никого не найдено</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Suggestions */}
          <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Возможно знакомые</div>
          <div className="space-y-2">
            {allPeople.slice(0, 4).map((p, idx) => (
              <div
                key={p.id}
                className="glass glass-hover rounded-2xl p-4 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-sm font-semibold">{p.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.school} · Выпуск {p.year}</div>
                  {p.mutual > 0 && (
                    <div className="text-xs text-primary mt-0.5">{p.mutual} общих друга</div>
                  )}
                </div>
                <button
                  onClick={() => setAdded((prev) => {
                    const n = new Set(prev);
                    if (n.has(p.id)) n.delete(p.id); else n.add(p.id);
                    return n;
                  })}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    added.has(p.id)
                      ? "bg-secondary text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {added.has(p.id) ? "Отправлено" : "Добавить"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
