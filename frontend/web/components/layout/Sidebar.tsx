import Image from "next/image";
import CatPlaceholder from "@/assets/images/cat-placeholder.png";
import {
  BookOpen,
  Users,
  Settings,
  MessageCircle,
  Map,
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
        className="mb-2 mx-auto rounded-full border-2 border-gray-400 shadow-lg"
      />
      <p className="text-gray-500 text-center text-sm mb-8">@username</p>
      <nav className="flex flex-col space-y-2">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={clsx(
              "px-4 py-2 flex items-center gap-4 font-bold rounded-md active:scale-95 transition-transform",
              pathname === route.path
                ? "bg-black text-white"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-200",
            )}>
            <route.icon size={30} />
            {route.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
