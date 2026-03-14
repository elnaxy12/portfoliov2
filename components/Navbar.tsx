export default function Navbar() {
  return (
    <nav className="p-4 flex justify-end">
      <div className="flex items-center">
        <a href="/" className="text-white hover:text-blue-500 mx-4">
          Home
        </a>
        <a href="/about" className="text-white hover:text-blue-500 mx-4">
          About
        </a>
        <a href="/certified" className="text-white hover:text-blue-500 mx-4">
          Certified
        </a>
        <a href="/contact" className="text-white hover:text-blue-500 mx-4">
          Contact
        </a>
      </div>
    </nav>
  );
}
