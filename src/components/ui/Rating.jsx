/**
 * @fileoverview Rating - Star rating with numeric value, in academic gold tone.
 */

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function Rating({ value = 0, showValue = true, size = 'sm' }) {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.3;
  const iconSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className={`text-accent-light ${iconSize}`} />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} className={`text-accent-light ${iconSize}`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`text-border-strong ${iconSize}`} />);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{stars}</div>
      {showValue && (
        <span className="text-text-secondary font-semibold text-sm">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
}
