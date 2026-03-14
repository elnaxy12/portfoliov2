import { Palette_Mosaic } from "next/font/google";

const palette_mosaic = Palette_Mosaic({
  subsets: ["latin"],
  weight: "400",
});

import Github from "./icons/Github";
import Linkedin from "./icons/Linkedin";
import Whatsapp from "./icons/Whatsapp";

export default function Sidebar() {
  return (
    <aside className="p-4 h-screen flex items-center flex-col justify-between absolute left-0 top-0">
      <h2 className={`${palette_mosaic.className} text-white text-4xl font-semibold`}>
        G
      </h2>{" "}
      <div
        className="h-70 w-[1px]"
        style={{ backgroundColor: "rgb(74, 85, 101)" }}
      ></div>
      <ul className="list-none space-y-6 p-4">
        <li>
          <a href="#" className="text-white hover:text-blue-500">
            <Linkedin />
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-blue-500">
            <Whatsapp />
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-blue-500">
            <Github />
          </a>
        </li>
      </ul>
    </aside>
  );
}
