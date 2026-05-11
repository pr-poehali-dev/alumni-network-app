import { useState } from "react";
import Icon from "@/components/ui/icon";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Search from "@/pages/Search";
import Admin from "@/pages/Admin";

type Page = "feed" | "profile" | "messages" | "search";

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "feed", label: "Главная", icon: "Home" },
  { id: "search", label: "Поиск", icon: "Search" },
  { id: "messages", label: "Сообщения", icon: "MessageCircle" },
  { id: "profile", label: "Профиль", icon: "User" },
];

const ADMIN_PASSWORD = "admin123";

export default function App() {
  const [page, setPage] = useState<Page>("feed");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const loginAdmin = () => {
    if (adminPwd === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPwd("");
      setPwdError(false);
    } else {
      setPwdError(true);
      setTimeout(() => setPwdError(false), 2000);
    }
  };

  // Admin view
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600/10 blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-pink-600/8 blur-[60px]" />
        </div>
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center">
                <Icon name="Shield" size={15} className="text-white" />
              </div>
              <span className="font-bold text-base">
                <span className="text-rose-400">Администратор</span>
                <span className="text-muted-foreground"> · Выпускники</span>
              </span>
            </div>
            <button
              onClick={() => setIsAdmin(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              <Icon name="LogOut" size={14} />
              Выйти
            </button>
          </div>
        </header>
        <main className="pt-14 pb-6 min-h-screen">
          <Admin />
        </main>
      </div>
    );
  }

  // Main app view
  return (
    <div className="min-h-screen bg-background">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/10 blur-[80px]" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-pink-600/8 blur-[60px]" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-indigo-600/8 blur-[70px]" />
      </div>

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center glow-violet-sm">
              <span className="text-white text-sm font-black">В</span>
            </div>
            <span className="font-bold text-base tracking-tight">
              <span className="gradient-text">Выпускники</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setNotifications(0)}
              className="relative w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center"
            >
              <Icon name="Bell" size={18} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1">
                  {notifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center"
              title="Панель администратора"
            >
              <Icon name="Settings" size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-14 pb-20 min-h-screen">
        {page === "feed" && <Feed />}
        {page === "profile" && <Profile />}
        {page === "messages" && <Messages />}
        {page === "search" && <Search />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex h-16">
            {navItems.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
                  )}
                  <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-primary/15" : ""}`}>
                    <Icon name={item.icon} size={20} />
                  </div>
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Admin login modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowAdminLogin(false); setAdminPwd(""); setPwdError(false); }}
          />
          <div className="relative glass rounded-3xl p-6 w-full max-w-sm space-y-5 border border-border animate-fade-in">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center mx-auto mb-3">
                <Icon name="Shield" size={24} className="text-white" />
              </div>
              <h2 className="font-bold text-lg">Панель администратора</h2>
              <p className="text-xs text-muted-foreground mt-1">Введите пароль для входа</p>
            </div>
            <div className="space-y-2">
              <input
                type="password"
                value={adminPwd}
                onChange={(e) => { setAdminPwd(e.target.value); setPwdError(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") loginAdmin(); }}
                placeholder="Пароль администратора"
                className={`w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground border transition-colors ${
                  pwdError ? "border-red-500/60" : "border-border/50 focus:border-primary/50"
                }`}
                autoFocus
              />
              {pwdError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 px-1">
                  <Icon name="AlertCircle" size={12} />
                  Неверный пароль
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAdminLogin(false); setAdminPwd(""); setPwdError(false); }}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={loginAdmin}
                disabled={!adminPwd.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
              >
                Войти
              </button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">Подсказка: admin123</p>
          </div>
        </div>
      )}
    </div>
  );
}
