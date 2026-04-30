/**
 * @fileoverview Loader - Spinning loader for async operations.
 */

export default function Loader({ size = 'md', text = 'Loading…' }) {
  const sizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3" role="status" aria-live="polite">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <p className="text-text-muted text-sm font-medium">{text}</p>}
    </div>
  );
}
