import Github from "./icons/Github";
import Linkedin from "./icons/Linkedin";
import Whatsapp from "./icons/Whatsapp";

export default function Sidebar() {
  return (
    <aside className="p-4 min-h-screen flex flex-col justify-between absolute left-0 top-0">
      <h2 className="text-white">Bikin</h2>
      <ul className="list-none space-y-6 p-4">
        <li>
          <a href="#" className="text-white hover:text-blue-500">
            <Linkedin/>
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-blue-500">
            <Whatsapp/>
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-blue-500">
            <Github/>
          </a>
        </li>
      </ul>
    </aside>
  );
}

