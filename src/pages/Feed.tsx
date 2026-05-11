import { useState } from "react";
import Icon from "@/components/ui/icon";

type Post = {
  id: number; author: string; initials: string; school: string;
  time: string; text: string; likes: number; comments: number; liked: boolean;
};

type Comment = { id: number; author: string; initials: string; text: string; time: string };

const initPosts: Post[] = [
  { id: 1, author: "Алина Соколова", initials: "АС", school: "Школа №47, выпуск 2018", time: "2 часа назад", text: "Не верится, что прошло уже 6 лет с выпускного! 🎓 Кто помнит, как мы отмечали на крыше Коли? Лучший вечер в жизни", likes: 34, comments: 1, liked: false },
  { id: 2, author: "Максим Воронов", initials: "МВ", school: "Школа №47, выпуск 2018", time: "5 часов назад", text: "Ребята, организую встречу выпускников в июне! Кто за? Планирую в кафе «Летний» на Садовой. Пишите в личку или комментируйте", likes: 51, comments: 19, liked: true },
  { id: 3, author: "Дарья Климова", initials: "ДК", school: "Школа №47, выпуск 2019", time: "вчера", text: "Нашла старые фотки с последнего звонка 📸 Какие же мы были маленькие! Время летит невероятно быстро. Всех люблю ♥", likes: 88, comments: 24, liked: false },
];

const initComments: Record<number, Comment[]> = {
  1: [{ id: 1, author: "Игорь П.", initials: "ИП", text: "Да, я тоже помню! Было незабываемо 🔥", time: "1 час назад" }],
  2: [],
  3: [],
};

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

const commentColors = [
  "from-teal-400 to-cyan-600",
  "from-pink-500 to-rose-600",
  "from-amber-400 to-orange-500",
  "from-indigo-500 to-blue-600",
];

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(initPosts);
  const [comments, setComments] = useState<Record<number, Comment[]>>(initComments);
  const [postText, setPostText] = useState("");
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const publishPost = () => {
    if (!postText.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: "Я",
      initials: "Я",
      school: "Школа №47, выпуск 2018",
      time: "только что",
      text: postText.trim(),
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setComments((prev) => ({ ...prev, [newPost.id]: [] }));
    setPostText("");
    showToast("Публикация опубликована!");
  };

  const sendComment = (postId: number) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    const newComment: Comment = {
      id: Date.now(),
      author: "Я",
      initials: "Я",
      text,
      time: "только что",
    };
    setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  const deletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    showToast("Публикация удалена");
  };

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
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) publishPost(); }}
            placeholder="Что нового, выпускник? (Ctrl+Enter для публикации)"
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
            onClick={publishPost}
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
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[(post.id) % colors.length]} flex items-center justify-center shrink-0`}>
                <span className="text-white text-sm font-semibold">{post.initials}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{post.author}</div>
                <div className="text-xs text-muted-foreground">{post.school} · {post.time}</div>
              </div>
            </div>
            <button
              onClick={() => deletePost(post.id)}
              className="text-muted-foreground hover:text-red-400 transition-colors p-1"
              title="Удалить публикацию"
            >
              <Icon name="Trash2" size={16} />
            </button>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">{post.text}</p>

          <div className="flex items-center gap-1 pt-1 border-t border-border/40">
            <button
              onClick={() => toggleLike(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all ${
                post.liked
                  ? "text-pink-400 bg-pink-500/10"
                  : "text-muted-foreground hover:text-pink-400 hover:bg-pink-500/10"
              }`}
            >
              <Icon name="Heart" size={16} className={post.liked ? "fill-pink-400" : ""} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => setOpenComments(openComments === post.id ? null : post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all ${
                openComments === post.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              <Icon name="MessageCircle" size={16} />
              <span>{post.comments}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(post.text).catch(() => {});
                showToast("Ссылка скопирована");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ml-auto"
            >
              <Icon name="Share2" size={16} />
              Поделиться
            </button>
          </div>

          {openComments === post.id && (
            <div className="space-y-3 pt-2 border-t border-border/40">
              {(comments[post.id] || []).map((c, ci) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c.initials === "Я" ? "from-violet-500 to-purple-700" : commentColors[ci % commentColors.length]} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-[10px] font-bold">{c.initials}</span>
                  </div>
                  <div className="glass rounded-xl px-3 py-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{c.author}</span>
                      <span className="text-[10px] text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-xs text-foreground/80 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">Я</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    value={commentText[post.id] || ""}
                    onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") sendComment(post.id); }}
                    placeholder="Написать комментарий..."
                    className="flex-1 bg-secondary/60 rounded-xl px-3 py-2 text-xs outline-none placeholder:text-muted-foreground border border-border/50 focus:border-primary/50 transition-colors"
                  />
                  <button
                    onClick={() => sendComment(post.id)}
                    disabled={!commentText[post.id]?.trim()}
                    className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
                  >
                    <Icon name="Send" size={14} className="text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-foreground text-background text-sm font-medium shadow-xl animate-fade-in whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
