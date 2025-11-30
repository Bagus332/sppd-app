"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  FileTextIcon,
  ArchiveIcon,
  PersonIcon,
  ExitIcon,
} from "@radix-ui/react-icons";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Buat Surat", href: "/perjalanan-dinas", icon: FileTextIcon },
  { name: "Arsip Surat", href: "/daftar-surat", icon: ArchiveIcon },
  { name: "Data Pegawai", href: "/pegawai", icon: PersonIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-neutral-200 shadow-sm z-40">
      {/* Logo Area */}
      <div className="p-6 border-b border-neutral-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-[#5c7a54] tracking-tight">SPPD App</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-[#5c7a54]/10 text-[#5c7a54]"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-[#5c7a54]"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-[#5c7a54]" : "text-neutral-400 group-hover:text-[#5c7a54]")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-neutral-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <ExitIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
