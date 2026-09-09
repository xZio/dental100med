import { useId } from 'react';
/**
 * Значок награды «Хорошее место» — тот же, что Яндекс Карты рисуют на карточке
 * организации. Разметка снята со страницы организации на Яндекс Картах.
 */
export default function GoodPlaceBadge({ className = '' }) {
  // На странице значок встречается несколько раз; с одинаковыми id градиенты и clipPath
  // ссылались бы на первый экземпляр — а он на узких экранах скрыт, и значок пропадал
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="24"
      viewBox="0 0 42 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <g clipPath={`url(#${uid}-clip)`}>
        {/* laurel wreath — right side */}
        <path fill={`url(#${uid}-l1)`} d="M29.39 21.952c1.328-1.422 5.014-3.72 9.024-.22-2.152 2.389-5.849 3.197-9.025.22" />
        <path fill={`url(#${uid}-l2)`} d="M33.78 18.193c1.084-3.457 4.66-4.615 7.54-2.892-.763 2.998-4.333 4.858-7.54 2.892" />
        <path fill={`url(#${uid}-l3)`} d="M36.495 13.755c-.46-4.054 2.148-6.265 5.328-6.066.735 3.569-1.942 6.22-5.328 6.066" />
        <path fill={`url(#${uid}-l4)`} d="M36.714 8.498q-3.432-4.767 1.336-8.2 3.432 4.768-1.336 8.2" />
        {/* laurel wreath — left side */}
        <path fill={`url(#${uid}-r1)`} d="M12.61 21.952c-1.328-1.422-5.014-3.72-9.024-.22 2.152 2.389 5.849 3.197 9.025.22" />
        <path fill={`url(#${uid}-r2)`} d="M8.219 18.193c-1.083-3.457-4.66-4.615-7.54-2.892.763 2.998 4.334 4.858 7.54 2.892" />
        <path fill={`url(#${uid}-r3)`} d="M5.505 13.755C5.965 9.701 3.357 7.49.177 7.69c-.735 3.569 1.942 6.22 5.328 6.066" />
        <path fill={`url(#${uid}-r4)`} d="M5.286 8.498Q8.718 3.731 3.95.298q-3.432 4.768 1.336 8.2" />
        {/* pin */}
        <path
          fill={`url(#${uid}-pin)`}
          d="M21 1a9.002 9.002 0 0 0-6.366 15.362c1.63 1.63 5.466 3.988 5.693 6.465.033.37.303.673.673.673s.64-.303.673-.673c.227-2.477 4.06-4.831 5.689-6.46A9.002 9.002 0 0 0 21 1"
        />
        <path fill="#fff" d="M21 13.079a3.079 3.079 0 1 1 0-6.158 3.079 3.079 0 0 1 0 6.158" />
      </g>
      <defs>
        <linearGradient id={`${uid}-l1`} x1="38.386" x2="29.381" y1="22.046" y2="22.388" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fc0" />
          <stop offset="1" stopColor="#fe9b21" />
        </linearGradient>
        <linearGradient id={`${uid}-l2`} x1="41.312" x2="33.951" y1="15.31" y2="18.668" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fc0" />
          <stop offset="1" stopColor="#fe9b21" />
        </linearGradient>
        <linearGradient id={`${uid}-l3`} x1="41.712" x2="36.973" y1="7.609" y2="14.165" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fc0" />
          <stop offset="1" stopColor="#fe9b21" />
        </linearGradient>
        <linearGradient id={`${uid}-l4`} x1="37.979" x2="37.305" y1=".297" y2="8.595" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fc0" />
          <stop offset="1" stopColor="#fe9b21" />
        </linearGradient>
        <linearGradient id={`${uid}-r1`} x1="3.614" x2="12.619" y1="22.046" y2="22.388" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fc0" />
          <stop offset="1" stopColor="#fe9b21" />
        </linearGradient>
        <linearGradient id={`${uid}-r2`} x1=".688" x2="8.049" y1="15.31" y2="18.668" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fc0" />
          <stop offset="1" stopColor="#fe9b21" />
        </linearGradient>
        <linearGradient id={`${uid}-r3`} x1=".288" x2="5.027" y1="7.609" y2="14.165" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fc0" />
          <stop offset="1" stopColor="#fe9b21" />
        </linearGradient>
        <linearGradient id={`${uid}-r4`} x1="4.021" x2="4.695" y1=".297" y2="8.595" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fc0" />
          <stop offset="1" stopColor="#fe9b21" />
        </linearGradient>
        <linearGradient id={`${uid}-pin`} x1="21" x2="21" y1="1" y2="23.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff6122" />
          <stop offset="1" stopColor="#f22411" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path fill="#fff" d="M0 0h42v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
