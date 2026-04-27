// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Camera,
//   ShieldAlert,
//   Video,
//   Crosshair,
//   BarChart3,
//   Bell,
//   Users,
//   User,
//   LogOut,
//   X,
//   ChevronRight,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// export default function Sidebar({ isOpen, setIsOpen }) {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const menuItems = [
//     { label: "Dashboard", icon: Home, path: "/dashboard" },
//     { label: "Cameras", icon: Camera, path: "/cameras" },
//     { label: "Crimes", icon: ShieldAlert, path: "/crimes" },
//     { label: "Detect Video", icon: Video, path: "/video-detect" },
//     { label: "Predict Risk", icon: Crosshair, path: "/predict-risk" },
//     { label: "Analytics", icon: BarChart3, path: "/analytics" },
//     { label: "Alerts", icon: Bell, path: "/alerts" },
//     ...(user?.role === "admin"
//       ? [{ label: "Users", icon: Users, path: "/users" }]
//       : []),
//     { label: "Profile", icon: User, path: "/profile" },
//   ];

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       <aside
//         className={`fixed top-0 left-0 w-64 h-full bg-[#0a0a0f] border-r border-white/5 transition-transform ${
//           isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-white/10">
//           <h1 className="font-bold text-white">CRIME AI</h1>
//           <button
//             className="lg:hidden text-gray-400"
//             onClick={() => setIsOpen(false)}
//           >
//             <X />
//           </button>
//         </div>

//         <nav className="p-4 space-y-1">
//           {menuItems.map((item) => {
//             const active = location.pathname === item.path;

//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setIsOpen(false)}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
//                   active
//                     ? "bg-purple-600/20 text-purple-300"
//                     : "text-gray-400 hover:bg-white/5"
//                 }`}
//               >
//                 <item.icon size={16} />
//                 <span>{item.label}</span>
//                 {active && (
//                   <ChevronRight size={14} className="ml-auto text-purple-400" />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
//           <button
//             onClick={() => {
//               logout();
//               navigate("/login");
//             }}
//             className="flex items-center gap-3 text-red-400 text-sm"
//           >
//             <LogOut size={16} /> Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }



import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Camera,
  ShieldAlert,
  Video,
  Crosshair,
  BarChart3,
  Bell,
  Users,
  User,
  LogOut,
  X,
  ChevronRight,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 ADMIN MENU
  const adminMenu = [
    { label: "Admin Dashboard", icon: Home, path: "/admin" },
    { label: "Cameras", icon: Camera, path: "/cameras" },
    { label: "Manage Cameras", icon: Settings, path: "/admin/cameras" },
    { label: "Crimes", icon: ShieldAlert, path: "/crimes" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Alerts", icon: Bell, path: "/alerts" },
    { label: "Users", icon: Users, path: "/users" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  // 🔥 NORMAL USER MENU
  const userMenu = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Cameras", icon: Camera, path: "/cameras" },
    { label: "Crimes", icon: ShieldAlert, path: "/crimes" },
    { label: "Detect Video", icon: Video, path: "/video-detect" },
    { label: "Predict Risk", icon: Crosshair, path: "/predict-risk" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Alerts", icon: Bell, path: "/alerts" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  // 🔥 SELECT MENU BASED ON ROLE
  const menuItems = user?.role === "admin" ? adminMenu : userMenu;

  return (
    <>
      {/* 🔲 MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🧱 SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-[#0a0a0f] border-r border-white/5 transition-transform z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h1 className="font-bold text-white">CRIME AI</h1>
            {user?.role === "admin" && (
              <p className="text-xs text-purple-400">ADMIN</p>
            )}
          </div>

          <button
            className="lg:hidden text-gray-400"
            onClick={() => setIsOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* 📌 NAVIGATION */}
        <nav className="p-4 space-y-1">

          {/* 🔥 ADMIN LABEL */}
          {user?.role === "admin" && (
            <p className="text-xs text-gray-500 px-2 mb-2">
              ADMIN PANEL
            </p>
          )}

          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>

                {active && (
                  <ChevronRight
                    size={14}
                    className="ml-auto text-purple-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 🔻 FOOTER */}
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">

          {/* 👤 USER INFO */}
          <div className="mb-3">
            <p className="text-sm text-white">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>

          {/* 🚪 LOGOUT */}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-3 text-red-400 text-sm hover:text-red-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}