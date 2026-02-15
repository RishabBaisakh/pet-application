"use client";

import Image from "next/image";
import CatPlaceholder from "@/assets/images/cat-placeholder.png";
import { LogOut } from "@deemlol/next-icons";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Icon from "@/components/common/Icon";
import * as RadixIcons from "@radix-ui/react-icons";
import MoreOptions from "./MoreOptions";

type RouteItemType = {
  name: string;
  path: string;
  icon: keyof typeof RadixIcons;
};

export default function LeftSidebar() {
  const pathname = usePathname();
  const routes: RouteItemType[] = [
    { name: "Feeds", path: "/feeds", icon: "ActivityLogIcon" },
    { name: "Friends", path: "/profile", icon: "PersonIcon" },
    { name: "Messages", path: "/messages", icon: "ChatBubbleIcon" },
    { name: "Explore", path: "/explore", icon: "GlobeIcon" },
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
            <Icon name={route.icon} />
            {route.name}
          </Link>
        ))}
      </nav>
      <MoreOptions />
    </div>
  );
}
