import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MedSafety - Drug Interaction Analyzer",
  description: "Analyze potential drug interactions and ensure medication safety",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">MedSafety</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Your Personal Drug Interaction Analyzer</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Patient Profile</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Create and manage your medical profile with your health history, medications, and conditions.</p>
            <Link href="/patient-profile" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors">
              Create Profile
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Drug Interaction Check</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Check for potential interactions between medications to ensure your safety.</p>
            <Link href="/drug-check" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors">
              Check Medications
            </Link>
          </div>
        </main>

        <section className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-blue-500 font-bold text-xl mb-2">1</div>
              <p className="text-gray-600 dark:text-gray-300">Enter your medical information and current medications</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-blue-500 font-bold text-xl mb-2">2</div>
              <p className="text-gray-600 dark:text-gray-300">Add new medications you&apos;re considering</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-blue-500 font-bold text-xl mb-2">3</div>
              <p className="text-gray-600 dark:text-gray-300">Get instant alerts for potential drug interactions</p>
            </div>
          </div>
        </section>

        <footer className="mt-20 text-center text-gray-500 dark:text-gray-400">
          <p>{new Date().getFullYear()} MedSafety. All rights reserved.</p>
          <p className="mt-2 text-sm">Always consult with a healthcare professional before making decisions about your medications.</p>
        </footer>
      </div>
    </div>
  );
}
