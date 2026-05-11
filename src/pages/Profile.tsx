import { useState } from "react";
import Icon from "@/components/ui/icon";

const wallPosts = [
  {
    id: 1,
    author: "Максим Воронов",
    initials: "МВ",
    color: "from-pink-500 to-rose-600",
    time: "3 дня назад",
    text: "Алин, поздравляю с новой работой! Ты молодец, гордимся тобой 🎉",
    likes: 12,
  },
  {
    id: 2,
    author: "Дарья Климова",
    initials: "ДК",
    color: "from-teal-400 to-cyan-600",
    time: "неделю назад",
    text: "Помнишь нашу контрольную по физике? Я до сих пор вспоминаю как мы зубрили формулы 😂",
    likes: 5,
  },
];

const photos = [
  "from-violet-400 to-purple-600",
  "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-teal-400 to-cyan-500",
  "from-indigo-400 to-blue-500",
  "from-green-400 to-emerald-500",
];

const friends = [
  { name: "Максим В.", initials: "МВ", color: "from-pink-500 to-rose-600" },
  { name: "Дарья К.", initials: "ДК", color: "from-teal-400 to-cyan-600" },
  { name: "Игорь П.", initials: "ИП", color: "from-amber-400 to-orange-500" },
  { name: "Света Л.", initials: "СЛ", color: "from-indigo-500 to-blue-600" },
  { name: "Рома С.", initials: "РС", color: "from-green-400 to-emerald-500" },
  { name: "Катя Н.", initials: "КН", color: "from-violet-500 to-purple-700" },
];

export default function Profile() {
  const [tab, setTab] = useState<"wall" | "photos" | "friends">("wall");
  const [wallText, setWallText] = useState("");
  const [likedWall, setLikedWall] = useState<Record<number, boolean>>({});

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Cover */}
      <div className="relative h-44 rounded-b-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-pink-600" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)"
        }} />
        <button className="absolute top-3 right-3 glass px-3 py-1.5 rounded-xl text-white text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <Icon name="Camera" size={13} />
          Обложка
        </button>
      </div>

      {/* Avatar + Info */}
      <div className="px-5 pb-5 glass rounded-b-2xl border-t-0" style={{ borderTop: 'none' }}>
        <div className="flex items-end justify-between -mt-12 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center border-4 border-background glow-violet-sm">
              <span className="text-white text-2xl font-bold">АС</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary flex items-center justify-center hover:opacity-90 transition-opacity">
              <Icon name="Camera" size={12} className="text-primary-foreground" />
            </button>
          </div>
          <div className="flex gap-2 mb-1">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              <Icon name="Edit3" size={14} />
              Редактировать
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-foreground">Алина Соколова</h1>
          <p className="text-sm text-primary mt-0.5">Школа №47, выпуск 2018</p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Дизайнер интерьеров · Москва · Любит путешествия и кофе ☕
          </p>
        </div>

        <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
          {[
            { label: "Друзья", val: "124" },
            { label: "Выпусков", val: "1" },
            { label: "Публикации", val: "47" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold text-foreground">{s.val}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mt-4 pt-4 border-t border-border/50">
          {[
            { key: "wall", label: "Стена", icon: "LayoutList" },
            { key: "photos", label: "Фото", icon: "Images" },
            { key: "friends", label: "Друзья", icon: "Users" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon name={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 px-4 space-y-4">
        {tab === "wall" && (
          <>
            {/* Post on wall */}
            <div className="glass rounded-2xl p-4 space-y-3">
              <textarea
                value={wallText}
                onChange={(e) => setWallText(e.target.value)}
                placeholder="Напишите что-нибудь на стене..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[56px] leading-relaxed"
                rows={2}
              />
              <div className="flex justify-end border-t border-border/50 pt-2">
                <button
                  disabled={!wallText.trim()}
                  className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
                >
                  Написать
                </button>
              </div>
            </div>

            {wallPosts.map((post, idx) => (
              <div key={post.id} className="glass glass-hover rounded-2xl p-4 space-y-3 animate-slide-up" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${post.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-semibold">{post.initials}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{post.author}</div>
                    <div className="text-xs text-muted-foreground">{post.time}</div>
                  </div>
                  <button className="ml-auto text-muted-foreground hover:text-foreground">
                    <Icon name="MoreHorizontal" size={16} />
                  </button>
                </div>
                <p className="text-sm text-foreground/85">{post.text}</p>
                <div className="flex gap-2 pt-1 border-t border-border/40">
                  <button
                    onClick={() => setLikedWall((p) => ({ ...p, [post.id]: !p[post.id] }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
                      likedWall[post.id] ? "text-pink-400 bg-pink-500/10" : "text-muted-foreground hover:text-pink-400 hover:bg-pink-500/10"
                    }`}
                  >
                    <Icon name="Heart" size={14} className={likedWall[post.id] ? "fill-pink-400" : ""} />
                    {post.likes + (likedWall[post.id] ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                    <Icon name="Reply" size={14} />
                    Ответить
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "photos" && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((c, i) => (
              <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${c} cursor-pointer hover:scale-[1.03] transition-transform`} />
            ))}
          </div>
        )}

        {tab === "friends" && (
          <div className="grid grid-cols-2 gap-3">
            {friends.map((f) => (
              <div key={f.name} className="glass glass-hover rounded-2xl p-4 flex items-center gap-3 cursor-pointer">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-sm font-semibold">{f.initials}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold">{f.name}</div>
                  <div className="text-xs text-muted-foreground">Выпуск 2018</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-8" />
    </div>
  );
}
