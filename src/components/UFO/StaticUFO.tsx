import React from "react";
import Image from "next/image";

interface StaticUFOProps {
  width: number;
  height: number;
  onPress?: () => void;
}

export const StaticUFO: React.FC<StaticUFOProps> = ({
  width,
  height,
  onPress,
}) => {
  return (
    <Image
      src="/spaceship.png"
      alt=""
      width={width}
      height={height}
      className="cursor-pointer select-none"
      onClick={onPress}
    />
  );
};
