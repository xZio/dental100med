import { useEffect } from 'react';

export function useSEO({ title, description }) {
  useEffect(() => {
    const siteName = 'ДенталстоМед — стоматология в Подольске';
    document.title = title ? `${title} | ${siteName}` : siteName;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    if (description) meta.setAttribute('content', description);

    return () => {
      document.title = siteName;
    };
  }, [title, description]);
}
