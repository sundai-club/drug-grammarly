import React from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            MedSafety
          </Link>
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Home
            </Link>
            <Link href="/patient-profile" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Profile
            </Link>
            <Link href="/drug-check" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Drug Check
            </Link>
          </nav>
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} MedSafety. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Always consult with a healthcare professional before making decisions about your medications.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
