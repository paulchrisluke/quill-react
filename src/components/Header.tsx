import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="flex justify-center">
          <Image
            src="/logo.webp"
            alt="Tiffy Cooks Logo"
            width={200}
            height={80}
            priority
            className="h-20 w-auto"
          />
        </Link>
      </div>
    </header>
  );
} 