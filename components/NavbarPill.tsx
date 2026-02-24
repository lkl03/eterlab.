export default function NavbarPill() {
  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(980px,calc(100%-2rem))] -translate-x-1/2 wide:w-[min(1200px,calc(100%-3rem))]">
      <div className="relative flex items-center justify-center rounded-full border border-zinc-200 bg-mist/70 px-6 py-3 backdrop-blur-md shadow-sm">
        <span className="font-title text-xs sm:text-sm font-semibold tracking-[0.32em] uppercase text-ink">
          eterlab
        </span>
      </div>
    </header>
  );
}
