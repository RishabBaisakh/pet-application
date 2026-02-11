import CatPlaceholder from "@/assets/images/cat-placeholder.png";
import Image from "next/image";

const suggestions = [
  { name: "Fluffy the cat", username: "@fluffy" },
  { name: "Buddy the dog", username: "@buddy" },
  { name: "Charlie the rabbit", username: "@charlie" },
];

export default function RightSidebar() {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Suggestions</h2>

      <ul className="space-y-4">
        {suggestions.map((user) => (
          <li key={user.username} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={CatPlaceholder}
                alt={user.name}
                className="rounded-full"
                width={45}
                height={45}
              />
              <div className="flex flex-col">
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-gray-500">{user.username}</span>
              </div>
            </div>

            <button className="cursor-pointer rounded-md text-white bg-black px-4 py-2 text-sm font-bold active:scale-95 transition-transform">
              Follow
            </button>
          </li>
        ))}
      </ul>

      <span className="text-gray-500 block mt-4 cursor-pointer hover:underline">
        See all
      </span>
    </>
  );
}
