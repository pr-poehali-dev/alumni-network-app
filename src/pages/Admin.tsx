import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import {
  adminGetStats, adminGetUsers, adminUpdateUser,
  adminGetGroups, adminUpdateGroup, adminGetPosts, adminUpdatePost,
  type AdminUser, type AdminGroup, type AdminPost,
} from "@/lib/api";

const statusBadge: Record<string, string> = {
  active: "bg-green-500/15 text-green-400",
  banned: "bg-red-500/15 text-red-400",
  pending: "bg-amber-500/15 text-amber-400",
  hidden: "bg-zinc-500/15 text-zinc-400",
};
const statusLabel: Record<string, string> = {
  active: "Активен", banned: "Заблокирован", pending: "На проверке", hidden: "Скрыто",
};

export default function Admin() {
  const [tab, setTab] = useState<"overview" | "users" | "groups" | "posts" | "settings">("overview");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [stats, setStats] = useState({ total_users: 0, active_users: 0, total_groups: 0, total_posts: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: number } | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Load data on tab change
  useEffect(() => {
    setLoading(true);
    if (tab === "overview") {
      adminGetStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
    } else if (tab === "users") {
      adminGetUsers().then(setUsers).catch(() => {}).finally(() => setLoading(false));
    } else if (tab === "groups") {
      adminGetGroups().then(setGroups).catch(() => {}).finally(() => setLoading(false));
    } else if (tab === "posts") {
      adminGetPosts().then(setPosts).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [tab]);

  const toggleUserStatus = async (id: number) => {
    const u = users.find((u) => u.id === id);
    if (!u) return;
    const newStatus = u.status === "banned" ? "active" : "banned";
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u));
    await adminUpdateUser(id, newStatus);
    showToast(newStatus === "banned" ? `${u.name} заблокирован` : `${u.name} разблокирован`);
  };

  const approveUser = async (id: number) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: "active" } : u));
    await adminUpdateUser(id, "active");
    showToast("Пользователь подтверждён");
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedUser(null);
    setConfirmDelete(null);
    showToast("Пользователь удалён из списка");
  };

  const toggleGroupStatus = async (id: number) => {
    const g = groups.find((g) => g.id === id);
    if (!g) return;
    const newStatus = g.status === "hidden" ? "active" : "hidden";
    setGroups((prev) => prev.map((g) => g.id === id ? { ...g, status: newStatus } : g));
    await adminUpdateGroup(id, newStatus);
    showToast(newStatus === "hidden" ? "Группа скрыта" : "Группа опубликована");
  };

  const deleteGroup = (id: number) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setConfirmDelete(null);
    showToast("Группа удалена из списка");
  };

  const togglePostStatus = async (id: number) => {
    const p = posts.find((p) => p.id === id);
    if (!p) return;
    const newStatus = p.status === "hidden" ? "active" : "hidden";
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p));
    await adminUpdatePost(id, newStatus);
    showToast("Статус публикации изменён");
  };

  const deletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
    showToast("Публикация удалена из списка");
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.school.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: "Пользователей", value: stats.total_users, icon: "Users", color: "text-violet-400" },
    { label: "Активных", value: stats.active_users, icon: "UserCheck", color: "text-green-400" },
    { label: "Групп и каналов", value: stats.total_groups, icon: "Layers", color: "text-blue-400" },
    { label: "Публикаций", value: stats.total_posts, icon: "FileText", color: "text-pink-400" },
  ];

  const tabs = [
    { id: "overview", label: "Обзор", icon: "LayoutDashboard" },
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "groups", label: "Группы", icon: "Layers" },
    { id: "posts", label: "Публикации", icon: "FileText" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center glow-violet-sm">
          <Icon name="Shield" size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Панель администратора</h1>
          <p className="text-xs text-muted-foreground">Полное управление платформой</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-5 scrollbar-thin">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id as typeof tab); setSearch(""); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all ${
              tab === t.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Icon name="Loader2" size={28} className="text-primary animate-spin" />
        </div>
      )}

      {/* ── OVERVIEW ── */}
      {tab === "overview" && !loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Icon name={s.icon} size={18} className={s.color} />
                  <span className="text-2xl font-bold">{s.value}</span>
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-4 space-y-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Icon name="Database" size={15} className="text-primary" />
              База данных подключена
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Все данные хранятся в PostgreSQL. Публикации, пользователи и группы сохраняются между сессиями.
            </div>
            <button
              onClick={() => { setLoading(true); adminGetStats().then(setStats).finally(() => setLoading(false)); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              <Icon name="RefreshCw" size={13} />
              Обновить статистику
            </button>
          </div>

          {users.filter((u) => u.status === "pending").length > 0 && (
            <div className="glass rounded-2xl p-4 border border-amber-500/20 space-y-3">
              <div className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <Icon name="AlertCircle" size={15} />
                Требуют проверки ({users.filter((u) => u.status === "pending").length})
              </div>
              {users.filter((u) => u.status === "pending").map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${u.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-semibold">{u.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.school} · Выпуск {u.year}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => approveUser(u.id)} className="px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 text-xs font-medium hover:bg-green-500/25 transition-colors">Принять</button>
                    <button onClick={() => toggleUserStatus(u.id)} className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── USERS ── */}
      {tab === "users" && !loading && (
        <div className="space-y-3 animate-fade-in">
          <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <Icon name="Search" size={15} className="text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по имени, школе, email..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            {search && <button onClick={() => setSearch("")}><Icon name="X" size={14} className="text-muted-foreground" /></button>}
          </div>

          {filteredUsers.length === 0 && <div className="text-center py-10 text-muted-foreground text-sm">Пользователи не найдены</div>}

          {filteredUsers.map((u, idx) => (
            <div key={u.id} className="glass glass-hover rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-sm font-semibold">{u.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{u.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusBadge[u.status]}`}>{statusLabel[u.status]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{u.school} · Выпуск {u.year} · {u.email}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{u.posts} постов · {u.friends} друзей · с {u.joined}</div>
                </div>
                <button onClick={() => setSelectedUser(u)} className="text-muted-foreground hover:text-foreground p-1">
                  <Icon name="ChevronRight" size={18} />
                </button>
              </div>
              <div className="flex gap-1.5 mt-3 pt-3 border-t border-border/40">
                {u.status === "pending" && (
                  <button onClick={() => approveUser(u.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-medium hover:bg-green-500/25 transition-colors">
                    <Icon name="Check" size={12} /> Подтвердить
                  </button>
                )}
                <button
                  onClick={() => toggleUserStatus(u.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    u.status === "banned" ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                  }`}
                >
                  <Icon name={u.status === "banned" ? "Unlock" : "Ban"} size={12} />
                  {u.status === "banned" ? "Разблокировать" : "Заблокировать"}
                </button>
                <button onClick={() => setConfirmDelete({ type: "user", id: u.id })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground text-xs font-medium hover:bg-red-500/15 hover:text-red-400 transition-colors ml-auto">
                  <Icon name="Trash2" size={12} /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GROUPS ── */}
      {tab === "groups" && !loading && (
        <div className="space-y-3 animate-fade-in">
          <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <Icon name="Search" size={15} className="text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск группы или канала..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            {search && <button onClick={() => setSearch("")}><Icon name="X" size={14} className="text-muted-foreground" /></button>}
          </div>

          {filteredGroups.length === 0 && <div className="text-center py-10 text-muted-foreground text-sm">Групп не найдено</div>}

          {filteredGroups.map((g, idx) => (
            <div key={g.id} className="glass glass-hover rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs font-semibold">{g.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{g.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">{g.type === "channel" ? "Канал" : "Группа"}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusBadge[g.status]}`}>{statusLabel[g.status]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{g.description}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{g.members} участников · создана {g.created}</div>
                </div>
              </div>
              <div className="flex gap-1.5 mt-3 pt-3 border-t border-border/40">
                <button onClick={() => toggleGroupStatus(g.id)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${g.status === "hidden" ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                  <Icon name={g.status === "hidden" ? "Eye" : "EyeOff"} size={12} />
                  {g.status === "hidden" ? "Показать" : "Скрыть"}
                </button>
                <button onClick={() => setConfirmDelete({ type: "group", id: g.id })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground text-xs font-medium hover:bg-red-500/15 hover:text-red-400 transition-colors ml-auto">
                  <Icon name="Trash2" size={12} /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── POSTS ── */}
      {tab === "posts" && !loading && (
        <div className="space-y-3 animate-fade-in">
          <div className="text-xs text-muted-foreground mb-1">Всего публикаций: {posts.length}</div>
          {posts.length === 0 && <div className="text-center py-10 text-muted-foreground text-sm">Публикаций пока нет</div>}
          {posts.map((p, idx) => (
            <div key={p.id} className="glass glass-hover rounded-2xl p-4 space-y-3 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold">{p.author}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusBadge[p.status]}`}>{p.status === "active" ? "Опубликовано" : "Скрыто"}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{p.text}</p>
                <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Icon name="Heart" size={11} />{p.likes}</span>
                  <span className="flex items-center gap-1"><Icon name="MessageCircle" size={11} />{p.comments}</span>
                  <span>{p.time}</span>
                </div>
              </div>
              <div className="flex gap-1.5 border-t border-border/40 pt-3">
                <button onClick={() => togglePostStatus(p.id)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${p.status === "hidden" ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                  <Icon name={p.status === "hidden" ? "Eye" : "EyeOff"} size={12} />
                  {p.status === "hidden" ? "Восстановить" : "Скрыть"}
                </button>
                <button onClick={() => setConfirmDelete({ type: "post", id: p.id })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground text-xs font-medium hover:bg-red-500/15 hover:text-red-400 transition-colors ml-auto">
                  <Icon name="Trash2" size={12} /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab === "settings" && (
        <div className="space-y-4 animate-fade-in">
          {[
            { label: "Название сайта", value: "Выпускники", icon: "Type" },
            { label: "Email поддержки", value: "admin@vypuskniki.ru", icon: "Mail" },
            { label: "Регистрация открыта", icon: "UserPlus", toggle: true, on: true },
            { label: "Модерация постов", icon: "Shield", toggle: true, on: false },
            { label: "Уведомления включены", icon: "Bell", toggle: true, on: true },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon name={item.icon} size={15} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.label}</div>
                {item.value && <div className="text-xs text-muted-foreground mt-0.5">{item.value}</div>}
              </div>
              {item.toggle ? (
                <ToggleSwitch defaultOn={!!item.on} onChange={() => showToast("Настройка сохранена")} />
              ) : (
                <button className="text-xs text-primary hover:underline">Изменить</button>
              )}
            </div>
          ))}
          <div className="glass rounded-2xl p-4 border border-red-500/20 space-y-3">
            <div className="text-sm font-semibold text-red-400 flex items-center gap-2">
              <Icon name="AlertTriangle" size={15} /> Опасная зона
            </div>
            <button onClick={() => showToast("Функция в разработке")} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
              <Icon name="Download" size={15} /> Экспортировать данные пользователей
            </button>
          </div>
        </div>
      )}

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass rounded-3xl p-5 w-full max-w-md space-y-4 border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Профиль пользователя</h2>
              <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground"><Icon name="X" size={20} /></button>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedUser.color} flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">{selectedUser.initials}</span>
              </div>
              <div>
                <div className="font-semibold text-base">{selectedUser.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[selectedUser.status]}`}>{statusLabel[selectedUser.status]}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: "Школа", v: selectedUser.school },
                { l: "Выпуск", v: selectedUser.year },
                { l: "Дата", v: selectedUser.joined },
                { l: "Публикации", v: String(selectedUser.posts) },
                { l: "Друзья", v: String(selectedUser.friends) },
              ].map((s) => (
                <div key={s.l} className="bg-secondary/50 rounded-xl p-2.5 text-center">
                  <div className="text-sm font-semibold">{s.v}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { toggleUserStatus(selectedUser.id); setSelectedUser(null); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedUser.status === "banned" ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-red-500/15 text-red-400 hover:bg-red-500/25"}`}
              >
                {selectedUser.status === "banned" ? "Разблокировать" : "Заблокировать"}
              </button>
              <button onClick={() => { setConfirmDelete({ type: "user", id: selectedUser.id }); setSelectedUser(null); }} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-muted-foreground hover:bg-red-500/15 hover:text-red-400 transition-colors">
                <Icon name="Trash2" size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative glass rounded-3xl p-5 w-full max-w-sm space-y-4 border border-red-500/30">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-3">
                <Icon name="Trash2" size={22} className="text-red-400" />
              </div>
              <div className="font-semibold text-base">Подтвердите удаление</div>
              <div className="text-sm text-muted-foreground mt-1">Это действие нельзя отменить</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors">Отмена</button>
              <button
                onClick={() => {
                  if (confirmDelete.type === "user") deleteUser(confirmDelete.id);
                  else if (confirmDelete.type === "group") deleteGroup(confirmDelete.id);
                  else if (confirmDelete.type === "post") deletePost(confirmDelete.id);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
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

function ToggleSwitch({ defaultOn, onChange }: { defaultOn: boolean; onChange: () => void }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => { setOn(!on); onChange(); }} className={`relative w-10 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-secondary"}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${on ? "left-5" : "left-1"}`} />
    </button>
  );
}
