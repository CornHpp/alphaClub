import React from "react";

interface SpaceButtonProps {
  // Add your prop types here
  clickButton?: () => void;
  children: React.ReactNode;
}

const SpaceButton: React.FC<SpaceButtonProps> = (props) => {
  const { children, clickButton } = props;
  // Add your component logic here

  return (
    <div
      onClick={clickButton}
      className="w-[125px] h-[42px] rounded-[21px] flex items-center justify-center 
      text-[#333333] font-bold
      "
      style={{
        background:
          "linear-gradient(134.77deg, #FFEB99 0%, #FFD11A 46.96%, #FFF6D1 100%)",
        boxShadow: "0px 2px 12px  #FFC917",
      }}
    >
      {children}
    </div>
  );
};

export default SpaceButton;
