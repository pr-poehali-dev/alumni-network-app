import { useState } from "react";
import Icon from "@/components/ui/icon";

const conversations = [
  {
    id: 1,
    name: "Максим Воронов",
    initials: "МВ",
    color: "from-pink-500 to-rose-600",
    lastMsg: "Ок, договорились! Жду тебя в 7 вечера",
    time: "18:42",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Дарья Климова",
    initials: "ДК",
    color: "from-teal-400 to-cyan-600",
    lastMsg: "Слушай, ты не знаешь Игоря?",
    time: "16:10",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Выпуск 2018 🎓",
    initials: "ВП",
    color: "from-violet-500 to-purple-700",
    lastMsg: "Макс: Все помним о встрече в субботу!",
    time: "Вчера",
    unread: 14,
    online: false,
    isGroup: true,
  },
  {
    id: 4,
    name: "Игорь Петров",
    initials: "ИП",
    color: "from-amber-400 to-orange-500",
    lastMsg: "Отлично выглядишь на новых фото!",
    time: "Вчера",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "Света Лебедева",
    initials: "СЛ",
    color: "from-indigo-500 to-blue-600",
    lastMsg: "Помогла мне с рецептом, спасибо 😊",
    time: "2 дня",
    unread: 0,
    online: false,
  },
];

const chatMessages = [
  { id: 1, from: "Максим Воронов", mine: false, text: "Привет! Как дела? Давно не виделись", time: "18:30" },
  { id: 2, from: "Я", mine: true, text: "Всё отлично! Работаю над новым проектом", time: "18:31" },
  { id: 3, from: "Максим Воронов", mine: false, text: "Класс! Слушай, помнишь мы говорили про встречу выпускников?", time: "18:35" },
  { id: 4, from: "Я", mine: true, text: "Конечно! Когда планируешь?", time: "18:37" },
  { id: 5, from: "Максим Воронов", mine: false, text: "В эту субботу, в кафе «Летний». Придёшь?", time: "18:40" },
  { id: 6, from: "Я", mine: true, text: "Да, буду! Во сколько?", time: "18:41" },
  { id: 7, from: "Максим Воронов", mine: false, text: "Ок, договорились! Жду тебя в 7 вечера", time: "18:42" },
];

export default function Messages() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [msgText, setMsgText] = useState("");
  const activePerson = conversations.find((c) => c.id === activeChat);

  if (activeChat && activePerson) {
    return (
      <div className="flex flex-col h-[calc(100vh-72px)] max-w-2xl mx-auto animate-fade-in">
        {/* Chat header */}
        <div className="glass border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActiveChat(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activePerson.color} flex items-center justify-center shrink-0`}>
            <span className="text-white text-xs font-semibold">{activePerson.initials}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{activePerson.name}</div>
            <div className="text-xs text-primary">{activePerson.online ? "онлайн" : "был(а) вчера"}</div>
          </div>
          <button className="text-muted-foreground hover:text-foreground p-1">
            <Icon name="Phone" size={18} />
          </button>
          <button className="text-muted-foreground hover:text-foreground p-1">
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.mine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "glass rounded-bl-sm text-foreground"
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 ${msg.mine ? "text-primary-foreground/60 text-right" : "text-muted-foreground"}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="glass border-t border-border/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground hover:text-primary transition-colors p-1.5">
              <Icon name="Paperclip" size={18} />
            </button>
            <input
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setMsgText("")}
              placeholder="Написать сообщение..."
              className="flex-1 bg-secondary/60 rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground border border-border/50 focus:border-primary/50 transition-colors"
            />
            <button className="text-muted-foreground hover:text-primary transition-colors p-1.5">
              <Icon name="Smile" size={18} />
            </button>
            <button
              disabled={!msgText.trim()}
              className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              <Icon name="Send" size={16} className="text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Сообщения</h1>
        <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
          <Icon name="PenSquare" size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="glass rounded-2xl px-3 py-2.5 flex items-center gap-2 mb-4">
        <Icon name="Search" size={16} className="text-muted-foreground" />
        <input placeholder="Поиск по диалогам..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>

      <div className="space-y-1">
        {conversations.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setActiveChat(c.id)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl glass-hover transition-all text-left animate-slide-up"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                <span className="text-white text-sm font-semibold">{c.initials}</span>
              </div>
              {c.online && !c.isGroup && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-background" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold truncate">{c.name}</span>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">{c.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-muted-foreground truncate">{c.lastMsg}</span>
                {c.unread > 0 && (
                  <span className="ml-2 shrink-0 min-w-[20px] h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
