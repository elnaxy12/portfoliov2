export default function Navbar() {
  return (
    <nav className="p-8 flex justify-end items-center absolute top-0 right-0">
      <div className="flex items-center gap-5">
        <a href="/" className="text-white hover:text-gray-600 text-base mx-4">
          Home
        </a>
        <a href="/about" className="text-white hover:text-gray-600 text-base mx-4">
          About
        </a>
        <a href="/certified" className="text-white hover:text-gray-600 text-base mx-4">
          Certified
        </a>
        <a href="/contact" className="text-white hover:text-gray-600 text-base mx-4">
          Contact
        </a>
      </div>
    </nav>
  );
}
