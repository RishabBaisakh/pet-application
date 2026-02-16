import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-900 p-4 md:h-64">
        <div className="flex flex-row items-center leading-none text-white">
          <p className="text-[44px]">Pet Application</p>
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            Connect and share the pawsome moments of your pets with a fun and
            friendly community of pet lovers
          </p>
          <div className="flex">
            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-950 md:text-base">
              <span>Log in</span>
            </Link>
            <Link
              href="/signup"
              className="flex ml-4 items-center gap-5 self-start rounded-lg bg-orange-400 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500 md:text-base">
              <span>Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
