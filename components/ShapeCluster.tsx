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
    <div className="absolute left-2 bottom-16">
      <Shape shape="diamond" size={120} top={50} left={50} />
      <Shape shape="circle" size={80} top={50} left={150} />
      <Shape shape="rounded" size={100} top={30} left={80} />
      <Shape shape="rounded" size={90} top={30} left={200} />
      {/* Bisa ditambah lagi sesuka hati */}
    </div>
  );
};

export default ShapeCluster;
