import { ReactNode } from 'react';

export default function PhaseShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-indigo-950 via-purple-950 to-fuchsia-950 text-white">
      <div className="max-w-lg mx-auto p-4 pb-24">
        <header className="mb-6 mt-4">
          <h1 className="text-2xl font-black">{title}</h1>
          {subtitle && <p className="text-white/60 text-sm mt-1">{subtitle}</p>}
        </header>
        {children}
      </div>
    </div>
  );
}