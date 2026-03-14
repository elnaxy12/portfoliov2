import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex-1">
        <main>
          <h1></h1>
        </main>
        <aside className="w-64">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}