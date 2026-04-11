import { Menu, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 border-b border-white/10 bg-[#0a0a0f]">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-gray-400" onClick={onMenuClick}>
          <Menu />
        </button>
        <h2 className="text-white font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-4 relative">
        <Bell className="text-gray-400" />

        <button
          className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg"
          onClick={() => setOpen(!open)}
        >
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
            {user?.name?.[0] || "U"}
          </div>
          <span className="text-white hidden sm:block">{user?.name}</span>
          <ChevronDown size={14} />
        </button>

        {open && (
          <div className="absolute right-0 top-12 bg-[#111] rounded-lg p-2 w-40">
            <p className="text-sm text-white">{user?.email}</p>
          </div>
        )}
      </div>
    </header>
  );
}