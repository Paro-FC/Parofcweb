export default function Loader({ fullScreen = false }: { fullScreen?: boolean }) {
  const wrapperClass = fullScreen
    ? "fixed inset-0 z-[100] flex items-center justify-center bg-dark-charcoal"
    : "flex min-h-[50vh] items-center justify-center py-24";

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <img
            src="/assets/paro.png"
            alt="Paro FC"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div className="mt-4 h-1 w-20 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-full animate-shimmer rounded-full bg-gradient-to-r from-transparent via-tiger-yellow to-transparent" />
        </div>
      </div>
    </div>
  );
}
