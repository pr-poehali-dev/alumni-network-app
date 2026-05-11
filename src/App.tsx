import { useState } from "react";
import Icon from "@/components/ui/icon";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Search from "@/pages/Search";

type Page = "feed" | "profile" | "messages" | "search";

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "feed", label: "Главная", icon: "Home" },
  { id: "search", label: "Поиск", icon: "Search" },
  { id: "messages", label: "Сообщения", icon: "MessageCircle" },
  { id: "profile", label: "Профиль", icon: "User" },
];

export default function App() {
  const [page, setPage] = useState<Page>("feed");

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
            <button className="relative w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center">
              <Icon name="Bell" size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <button className="w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center">
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
                  {item.id === "messages" && (
                    <span className="absolute top-2.5 right-[calc(50%-14px)] w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                      16
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
