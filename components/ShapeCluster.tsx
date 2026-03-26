import React from "react";

interface ShapeProps {
  size?: number;
  colorStart?: string;
  colorEnd?: string;
  shape?: "diamond" | "circle" | "rounded"; // jenis bentuk
  top?: number;
  left?: number;
  className?: string;
}

const Shape: React.FC<ShapeProps> = ({
  size = 100,
  colorStart = "#f5c0f7",
  colorEnd = "#59d5f9",
  shape = "diamond",
  top = 0,
  left = 0,
}) => {
  let borderRadiusStyle = "0";
  let transformStyle = "";

  switch (shape) {
    case "diamond":
      transformStyle = "rotate(45deg)";
      break;
    case "circle":
      borderRadiusStyle = "50%";
      break;
    case "rounded":
      borderRadiusStyle = "20%";
      break;
  }

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        top,
        left,
        transform: transformStyle,
        background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
        borderRadius: borderRadiusStyle,
      }}
    />
  );
};

const ShapeCluster: React.FC = () => {
  return (
    <div
      className="
  fixed left-1/2 -translate-x-1/2 bottom-48
  md:absolute md:left-auto md:translate-x-0 md:bottom-auto
  bg-black w-50 h-125 p-6 rounded-t-full overflow-hidden"
    >
      <Shape shape="circle" size={128} top={-30} left={60} />
      <Shape shape="diamond" size={88} top={10} left={-10} />
      <Shape shape="rounded" size={76} top={30} left={80} />
      <Shape shape="diamond" size={60} top={30} left={20} />
      <Shape shape="circle" size={56} top={20} left={110} />
    </div>
  );
};

export default ShapeCluster;
