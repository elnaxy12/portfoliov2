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
    <div className="absolute bottom-8 left-8">
      <h1
        style={{ lineHeight: "1.5" }}
        className={`text-sm md:text-xl text-white max-w-lg leading-tight ${className}`}
      >
        {text}
      </h1>
    </div>
  );
};

export default CenteredText;
