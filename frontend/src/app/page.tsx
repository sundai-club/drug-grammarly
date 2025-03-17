"use client"; 
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-600 flex flex-col items-center p-6 font-sans">
      {/* Company Name */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center max-w-4xl mb-5 mt-30"
      >
        <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-8xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">
          AurumRx
        </h1>

          <p className="mt-4 text-3xl text-gray-200 max-w-3xl font-light leading-snug">
            Your AI-powered drug safety companion. Instantly detect medication conflicts with your history.
          </p>
          
          {/* Start Button Properly Positioned */}
          <Link href="/history">
            <Button className="mt-6 px-12 py-4 text-2xl bg-gray-700 text-white rounded-lg shadow-xl hover:bg-gray-700 transition-transform transform hover:scale-105">
              Start Now
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-70 text-white text-center text-lg">
        <p>&copy; 2025 AurumRx. All rights reserved.</p>
      </footer>
    </div>
  );
}
