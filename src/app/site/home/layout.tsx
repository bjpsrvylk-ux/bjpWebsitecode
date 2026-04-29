// src/app/site/home/layout.tsx
import React from 'react';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children}
    </main>
  );
}