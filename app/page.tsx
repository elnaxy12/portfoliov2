import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ParallaxHero from "../components/ParallaxHero";

export default function Home() {
  return (
    <div>
      <div className="flex-1">
        <ParallaxHero />
        <Navbar />
        <section className="h-[200vh] flex items-center justify-center text-4xl">
          Scroll Content
        </section>
        <aside className="w-64">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
