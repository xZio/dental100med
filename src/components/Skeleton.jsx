export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-2xl p-6 animate-pulse ${className}`}>
      <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-4" />
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
  );
}

export function SkeletonRow({ className = '' }) {
  return (
    <div className={`flex justify-between items-center px-6 py-4 animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="h-4 bg-slate-200 rounded w-20" />
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="text-center py-12">
      <p className="text-slate-500 mb-3">Не удалось загрузить данные</p>
      {message && <p className="text-xs text-slate-400 mb-4">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn-outline text-sm">
          Попробовать снова
        </button>
      )}
    </div>
  );
}
