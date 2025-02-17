import Link from 'next/link';

export const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">SVG Tools</h1>
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Halftone Generator
          </Link>
          <Link href="/svg-merge" className="text-white hover:text-gray-300">
            SVG Merger
          </Link>
        </div>
      </div>
    </nav>
  );
}; 