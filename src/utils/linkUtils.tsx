import React, { ReactNode } from 'react';

export const processTextWithLinks = (text: string | undefined | null): ReactNode => {
  if (!text) return '';
  
  const urlRegex = /(?<!<)(https?:\/\/[^\s<>]+)(?!>)/g;
  
  if (!text.match(urlRegex)) {
    return <span>{text}</span>;
  }

  const parts = text.split(urlRegex);
  const matches: string[] = Array.from(text.matchAll(urlRegex), m => m[0]);
  
  return (
    <>
      {parts.map((part, i) => {
        if (matches.includes(part)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}; 