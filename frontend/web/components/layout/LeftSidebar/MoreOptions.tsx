"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/common/Icon";
import * as RadixIcons from "@radix-ui/react-icons";

type MenuItemType = {
  label: string;
  icon: keyof typeof RadixIcons;
};

export default function MoreOptions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems: MenuItemType[] = [
    { label: "Logout", icon: "ExitIcon" },
    { label: "Settings", icon: "GearIcon" },
    { label: "Switch Pet Account", icon: "SwitchIcon" },
    { label: "Switch Appearance", icon: "SunIcon" },
    { label: "Report a Problem", icon: "ExclamationTriangleIcon" },
  ];

  return (
    <div ref={ref} className="relative mt-auto p-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="px-4 py-3 flex items-center gap-3 cursor-pointer font-bold rounded-xl active:scale-95 transition-transform text-gray-700 hover:text-gray-900 hover:bg-gray-200 w-full">
        <Icon name="HamburgerMenuIcon" />
        More
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-68 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-200 font-bold rounded-xl active:scale-95 transition-transform"
              onClick={() => {
                console.log(item.label);
                setOpen(false);
              }}>
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
