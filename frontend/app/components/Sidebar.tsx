"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  DashboardIcon,
  FileTextIcon,
  ArchiveIcon,
  PersonIcon,
  ExitIcon,
  BarChartIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Buat Surat", href: "/perjalanan-dinas", icon: FileTextIcon },
  { name: "Arsip Surat", href: "/daftar-surat", icon: ArchiveIcon },

  {
    name: "Laporan",
    icon: BarChartIcon,
    children: [
      { name: "Surat Tugas", href: "/laporan/surat-tugas" },
      { name: "SPD", href: "/laporan/spd" },
    ],
  },

  { name: "Data Pegawai", href: "/pegawai", icon: PersonIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false); // default open

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-neutral-200 shadow-sm z-40">
      
      {/* Logo */}
      <div className="p-6 border-b border-neutral-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-[#5c7a54] tracking-tight">
          SPPD App
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          // =====================
          // 🔥 Menu dengan Submenu
          // =====================
          if (item.children) {
            const activeParent = item.children.some(
              (child) => child.href === pathname
            );

            return (
              <div key={item.name}>
                {/* Parent */}
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all",
                    activeParent
                      ? "bg-[#5c7a54]/10 text-[#5c7a54]"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-[#5c7a54]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>

                  <ChevronDownIcon
                    className={cn(
                      "w-4 h-4 transition-transform",
                      openMenu && "rotate-180"
                    )}
                  />
                </button>

                {/* Submenu */}
                {openMenu && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-neutral-200 pl-3">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block py-2 text-sm rounded-md transition",
                            isChildActive
                              ? "text-[#5c7a54] font-medium"
                              : "text-neutral-600 hover:text-[#5c7a54]"
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // =====================
          // 🔥 Menu Biasa
          // =====================
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-[#5c7a54]/10 text-[#5c7a54]"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-[#5c7a54]"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-[#5c7a54]" : "text-neutral-400"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
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
