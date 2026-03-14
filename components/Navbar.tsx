export default function Navbar() {
  return (
    <nav className="px-8 py-4 flex justify-end items-center absolute top-0 right-0 left-0">
      <div className="flex items-center gap-5 backdrop-blur-xs bg-black/20 border-b border-white/10 shadow-lg p-2 rounded-full">
        <a href="/" className="text-white hover:text-gray-400 text-sm mx-4">
          Home
        </a>
        <a
          href="/about"
          className="text-white hover:text-gray-400 text-sm mx-4"
        >
          About
        </a>
        <a
          href="/certified"
          className="text-white hover:text-gray-400 text-sm mx-4"
        >
          Certified
        </a>
        <a
          href="/contact"
          className="text-white hover:text-gray-400 text-sm mx-4 bg-black border border-white/10 shadow-lg px-8 py-3 rounded-full"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
