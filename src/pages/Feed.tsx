import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const posts = [
  {
    id: 1,
    author: "Алина Соколова",
    avatar: "",
    initials: "АС",
    school: "Школа №47, выпуск 2018",
    time: "2 часа назад",
    text: "Не верится, что прошло уже 6 лет с выпускного! 🎓 Кто помнит, как мы отмечали на крыше Коли? Лучший вечер в жизни",
    likes: 34,
    comments: 8,
    liked: false,
    image: "",
  },
  {
    id: 2,
    author: "Максим Воронов",
    avatar: "",
    initials: "МВ",
    school: "Школа №47, выпуск 2018",
    time: "5 часов назад",
    text: "Ребята, организую встречу выпускников в июне! Кто за? Планирую в кафе «Летний» на Садовой. Пишите в личку или комментируйте",
    likes: 51,
    comments: 19,
    liked: true,
    image: "",
  },
  {
    id: 3,
    author: "Дарья Климова",
    avatar: "",
    initials: "ДК",
    school: "Школа №47, выпуск 2019",
    time: "вчера",
    text: "Нашла старые фотки с последнего звонка 📸 Какие же мы были маленькие! Время летит невероятно быстро. Всех люблю ♥",
    likes: 88,
    comments: 24,
    liked: false,
    image: "",
  },
];

const stories = [
  { name: "Моя история", initials: "Я", isAdd: true },
  { name: "Алина С.", initials: "АС" },
  { name: "Максим В.", initials: "МВ" },
  { name: "Дарья К.", initials: "ДК" },
  { name: "Игорь П.", initials: "ИП" },
  { name: "Света Л.", initials: "СЛ" },
];

const colors = [
  "from-violet-500 to-purple-700",
  "from-pink-500 to-rose-600",
  "from-teal-400 to-cyan-600",
  "from-amber-400 to-orange-500",
  "from-indigo-500 to-blue-600",
];

export default function Feed() {
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>(
    posts.reduce((a, p) => ({ ...a, [p.id]: p.liked }), {})
  );
  const [postText, setPostText] = useState("");
  const [openComments, setOpenComments] = useState<number | null>(null);

  const toggleLike = (id: number) =>
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-5 animate-fade-in">
      {/* Stories */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {stories.map((s, i) => (
          <div key={s.name} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center transition-transform group-hover:scale-105`}>
              {s.isAdd ? (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Plus" size={12} className="text-background" />
                </div>
              ) : (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/60 ring-offset-1 ring-offset-background" />
              )}
              <span className="text-white text-sm font-semibold">{s.initials}</span>
            </div>
            <span className="text-[11px] text-muted-foreground w-14 text-center truncate">{s.name}</span>
          </div>
        ))}
      </div>

      {/* Create post */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">Я</span>
          </div>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Что нового, выпускник?"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[48px] leading-relaxed"
            rows={2}
          />
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex gap-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs">
              <Icon name="Image" size={15} />
              Фото
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs">
              <Icon name="MapPin" size={15} />
              Место
            </button>
          </div>
          <button
            disabled={!postText.trim()}
            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            Опубликовать
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post, idx) => (
        <div
          key={post.id}
          className="glass glass-hover rounded-2xl p-5 space-y-4 animate-slide-up"
          style={{ animationDelay: `${idx * 0.08}s` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3 items-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[(post.id + 1) % colors.length]} flex items-center justify-center shrink-0`}>
                <span className="text-white text-sm font-semibold">{post.initials}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{post.author}</div>
                <div className="text-xs text-muted-foreground">{post.school} · {post.time}</div>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <Icon name="MoreHorizontal" size={18} />
            </button>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">{post.text}</p>

          <div className="flex items-center gap-1 pt-1 border-t border-border/40">
            <button
              onClick={() => toggleLike(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all ${
                likedPosts[post.id]
                  ? "text-pink-400 bg-pink-500/10"
                  : "text-muted-foreground hover:text-pink-400 hover:bg-pink-500/10"
              }`}
            >
              <Icon name={likedPosts[post.id] ? "Heart" : "Heart"} size={16} className={likedPosts[post.id] ? "fill-pink-400" : ""} />
              <span>{post.likes + (likedPosts[post.id] && !post.liked ? 1 : 0)}</span>
            </button>
            <button
              onClick={() => setOpenComments(openComments === post.id ? null : post.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Icon name="MessageCircle" size={16} />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ml-auto">
              <Icon name="Share2" size={16} />
              Поделиться
            </button>
          </div>

          {openComments === post.id && (
            <div className="space-y-3 pt-2 border-t border-border/40">
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">ИП</span>
                </div>
                <div className="glass rounded-xl px-3 py-2 flex-1">
                  <span className="text-xs font-semibold text-foreground">Игорь П.</span>
                  <p className="text-xs text-foreground/80 mt-0.5">Да, я тоже помню! Было незабываемо 🔥</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">Я</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    placeholder="Написать комментарий..."
                    className="flex-1 bg-secondary/60 rounded-xl px-3 py-2 text-xs outline-none placeholder:text-muted-foreground border border-border/50 focus:border-primary/50 transition-colors"
                  />
                  <button className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Icon name="Send" size={14} className="text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
