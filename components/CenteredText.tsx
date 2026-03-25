// app/components/CenteredText.tsx
import React from "react";

interface CenteredTextProps {
  text: string;
  className?: string;
}

const CenteredText: React.FC<CenteredTextProps> = ({
  text,
  className = "",
}) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-4">
      <h1 className={`text-2xl md:text-4xl text-white ${className}`}>{text}</h1>
    </div>
  );
};

export default CenteredText;
