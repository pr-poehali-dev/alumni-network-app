import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { fetchPosts, createPost, toggleLike, fetchComments, addComment, type Post, type Comment } from "@/lib/api";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [postText, setPostText] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [loadingComments, setLoadingComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => showToast("Ошибка загрузки постов"))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleLike = async (id: number) => {
    // Оптимистичное обновление
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
    try {
      const result = await toggleLike(id);
      setPosts((prev) =>
        prev.map((p) => p.id === id ? { ...p, liked: result.liked, likes: result.likes } : p)
      );
    } catch {
      // Откат при ошибке
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
        )
      );
    }
  };

  const handlePublish = async () => {
    if (!postText.trim() || publishing) return;
    setPublishing(true);
    try {
      const post = await createPost(postText.trim());
      if (post) {
        setPosts((prev) => [post, ...prev]);
        setPostText("");
        showToast("Публикация опубликована!");
      }
    } catch {
      showToast("Ошибка публикации");
    } finally {
      setPublishing(false);
    }
  };

  const handleOpenComments = async (postId: number) => {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }
    setOpenComments(postId);
    if (!comments[postId]) {
      setLoadingComments(postId);
      try {
        const result = await fetchComments(postId);
        setComments((prev) => ({ ...prev, [postId]: result }));
      } catch {
        setComments((prev) => ({ ...prev, [postId]: [] }));
      } finally {
        setLoadingComments(null);
      }
    }
  };

  const handleSendComment = async (postId: number) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    try {
      const comment = await addComment(postId, text);
      if (comment) {
        setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
        setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
      }
    } catch {
      showToast("Ошибка отправки комментария");
    }
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
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handlePublish(); }}
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
            onClick={handlePublish}
            disabled={!postText.trim() || publishing}
            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            {publishing && <Icon name="Loader2" size={14} className="animate-spin" />}
            Опубликовать
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={28} className="text-primary animate-spin" />
        </div>
      )}

      {/* Posts */}
      {posts.map((post, idx) => (
        <div
          key={post.id}
          className="glass glass-hover rounded-2xl p-5 space-y-4 animate-slide-up"
          style={{ animationDelay: `${idx * 0.08}s` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3 items-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${post.color || colors[idx % colors.length]} flex items-center justify-center shrink-0`}>
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
              onClick={() => handleToggleLike(post.id)}
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
              onClick={() => handleOpenComments(post.id)}
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
                showToast("Скопировано!");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ml-auto"
            >
              <Icon name="Share2" size={16} />
              Поделиться
            </button>
          </div>

          {openComments === post.id && (
            <div className="space-y-3 pt-2 border-t border-border/40">
              {loadingComments === post.id && (
                <div className="flex justify-center py-3">
                  <Icon name="Loader2" size={18} className="text-primary animate-spin" />
                </div>
              )}
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
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendComment(post.id); }}
                    placeholder="Написать комментарий..."
                    className="flex-1 bg-secondary/60 rounded-xl px-3 py-2 text-xs outline-none placeholder:text-muted-foreground border border-border/50 focus:border-primary/50 transition-colors"
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
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

      {!loading && posts.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="FileText" size={36} className="mx-auto mb-3 opacity-30" />
          <div className="text-sm">Пока нет публикаций — будьте первым!</div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-foreground text-background text-sm font-medium shadow-xl animate-fade-in whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
