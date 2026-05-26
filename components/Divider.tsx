import React from "react";

type DividerProps = {
  className?: string;
};

const Divider: React.FC<DividerProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-[1px] bg-black/10 ${className}`} />
  );
};

export default Divider;