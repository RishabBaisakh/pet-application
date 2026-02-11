"use client";

import Image from "next/image";
import CatPlaceholder from "@/assets/images/cat-placeholder.png";
import {
  BookOpen,
  Users,
  Settings,
  MessageCircle,
  Map,
  LogOut,
} from "@deemlol/next-icons";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const routes = [
    { name: "Feeds", path: "/feeds", icon: BookOpen },
    { name: "Friends", path: "/friends", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageCircle },
    { name: "Explore", path: "/explore", icon: Map },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="sidebar flex flex-col w-80 p-8">
      <Image
        src={CatPlaceholder}
        alt="Profile Logo"
        width={128}
        height={128}
        className="mb-4 mx-auto rounded-full border-2 border-gray-400 shadow-lg"
        priority
      />
      <p className="text-center font-bold text-xl">Pet Name</p>
      <p className="text-gray-500 text-center mb-8">@username</p>
      <nav className="flex flex-col space-y-2 flex-1">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={clsx(
              "px-4 py-3 flex items-center gap-4 font-bold rounded-xl active:scale-95 transition-transform",
              pathname === route.path
                ? "bg-black text-white"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-200",
            )}>
            <route.icon size={30} />
            {route.name}
          </Link>
        ))}
        <Link
          key="logout"
          href="/logout"
          className={clsx(
            "px-4 py-3 flex items-center gap-4 font-bold rounded-xl active:scale-95 transition-transform mt-auto",
            "text-gray-700 hover:text-gray-900 hover:bg-gray-200",
          )}>
          <LogOut size={30} />
          Logout
        </Link>
      </nav>
    </div>
  );
}
