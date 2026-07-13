import Link from 'next/link';

import { BrandMark } from '@/components/brand-mark';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-zinc-950 p-10 text-white lg:flex">
        <BrandMark inverted />
        <div className="space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed text-zinc-300">
              &ldquo;Qualti transformed how we run quality inspections across 12 manufacturing
              sites. Template versioning alone saved us weeks of rework.&rdquo;
            </p>
            <footer className="text-sm text-zinc-500">
              — Quality Director, Apex Manufacturing
            </footer>
          </blockquote>
        </div>
        <p className="text-sm text-zinc-500">
          Enterprise inspection &amp; audit workflow platform
        </p>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="text-marketing-ink">
            <BrandMark compact />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
