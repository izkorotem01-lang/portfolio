import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const GlobalBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(0, 0, 0)"
        gradientBackgroundEnd="rgb(20, 20, 20)"
        firstColor="240, 123, 0"
        secondColor="217, 47, 15"
        thirdColor="147, 0, 97"
        fourthColor="32, 0, 155"
        fifthColor="0, 0, 0"
        pointerColor="217, 47, 15"
        size="150%"
        blendingValue="screen"
        interactive={true}
        containerClassName="absolute inset-0"
        className="opacity-80"
      />
    </div>
  );
};

export default GlobalBackground;
