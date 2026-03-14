"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="px-8 py-4 flex justify-end items-center absolute top-0 right-0 left-0 z-50">
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-2 backdrop-blur-sm bg-black/20 border border-white/10 shadow-lg p-2 rounded-full">
        <a
          href="/"
          className="text-white hover:text-gray-400 text-sm px-4 py-2"
        >
          Home
        </a>
        <a
          href="/about"
          className="text-white hover:text-gray-400 text-sm px-4 py-2"
        >
          About
        </a>
        <a
          href="/certified"
          className="text-white hover:text-gray-400 text-sm px-4 py-2"
        >
          Certified
        </a>
        <a
          href="/contact"
          className="text-white hover:text-gray-400 text-sm bg-black border border-white/10 shadow-lg px-8 py-3 rounded-full"
        >
          Contact
        </a>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white backdrop-blur-sm bg-black/20 border border-white/10 p-3 rounded-full"
      >
        <div
          className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
        />
        <div
          className={`w-5 h-0.5 bg-white my-1 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
        />
        <div
          className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
        />
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-20 right-4 left-4 backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col p-4 gap-2">
          <a
            href="/"
            className="text-white hover:text-gray-400 text-sm px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-white hover:text-gray-400 text-sm px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            About
          </a>
          <a
            href="/certified"
            className="text-white hover:text-gray-400 text-sm px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Certified
          </a>
          <a
            href="/contact"
            className="text-white text-sm px-4 py-3 rounded-xl bg-black border border-white/10 text-center mt-2"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
