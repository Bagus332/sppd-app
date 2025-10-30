'use client';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">SPPD</span>
            <div className="ml-10 hidden space-x-8 lg:block">
              <a href="/" className="text-base font-medium text-gray-700 hover:text-blue-600">
                Beranda
              </a>
              <a href="#" className="text-base font-medium text-gray-700 hover:text-blue-600">
                Riwayat Surat
              </a>
              <a href="#" className="text-base font-medium text-gray-700 hover:text-blue-600">
                Panduan
              </a>
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <span className="inline-flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Administrator
              </span>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}