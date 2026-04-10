import { forwardRef, useImperativeHandle, useRef } from "react";
import TextReveal, { TextRevealHandle } from "./TextReveal";

const offerings = [
  {
    num: "01",
    title: "Full-Stack Development",
    text: "Building end-to-end web solutions from frontend to backend.",
  },
  {
    num: "02",
    title: "Clean Code",
    text: "Writing structured and maintainable code following best practices.",
  },
  {
    num: "03",
    title: "Communication",
    text: "Explaining technical concepts clearly to any audience.",
  },
  {
    num: "04",
    title: "Collaboration",
    text: "Working effectively in teams and meeting deadlines.",
  },
  {
    num: "05",
    title: "Problem Solving",
    text: "Delivering efficient solutions while continuously learning.",
  },
];

export interface OfferingsHandle {
  play: () => void;
  reset: () => void;
}

const Offerings = forwardRef<OfferingsHandle>((_, ref) => {
  const revealRefs = useRef<(TextRevealHandle | null)[]>([]);

  useImperativeHandle(ref, () => ({
    play() {
      revealRefs.current.forEach((r) => r?.play());
    },
    reset() {
      revealRefs.current.forEach((r) => r?.reset());
    },
  }));

  return (
    <section className="w-full min-h-screen p-6 flex flex-col justify-center text-black">
      <style>{`
        .font-monospace {
          font-family: monospace; 
        } 
        `}
      </style>
      {/* Header kiri atas */}
      <div className="mb-10 flex flex-col justify-start items-start">
        <div className="text-[22px] md:text-[32px] font-medium leading-[1.1]">
          <TextReveal
            ref={(el) => {
              revealRefs.current[0] = el;
            }}
            lines={["Gilang Arya Leksana"]}
            />
          </div>
        <div className="text-[rgba(0,0,0,0.45)] text-[22px] md:text-[32px] font-medium leading-[1.1] italic">
          <TextReveal
            ref={(el) => {
              revealRefs.current[1] = el;
            }}
            lines={["Full-Stack Developer"]}
            />
        </div>
      </div>

      {/* Grid offerings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center items-center">
        {offerings.map((item, i) => {
          // Hanya gunakan positioning untuk desktop
          const positions = [
            "",
            "md:col-start-2",
            "md:col-start-3",
            "md:col-start-1 md:row-start-2",
            "md:col-start-3 md:row-start-2", // skip tengah
          ];

          return (
            <div key={item.num} className={`text-center font-monospace flex flex-col gap-2 text-sm ${positions[i]}`}>
              <div className="text-[rgba(0,0,0,0.45)]">
                <TextReveal
                  ref={(el) => { revealRefs.current[i * 3 + 2] = el; }}
                  lines={[item.num]}
                />
              </div>
              <div>
                <TextReveal
                  ref={(el) => { revealRefs.current[i * 3 + 3] = el; }}
                  lines={[item.title]}
                />
              </div>
              <div className="text-[rgba(0,0,0,0.45)]">
                <TextReveal
                  ref={(el) => { revealRefs.current[i * 3 + 4] = el; }}
                  lines={[item.text]}
                 />  
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default Offerings;
