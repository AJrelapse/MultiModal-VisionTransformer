import React from "react";

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-5 z-20">
      <div className="text-white text-xl font-semibold tracking-wide">
        PixSense
      </div>

      <div className="flex gap-8 text-white/80 text-sm">
        <a href="#home" className="hover:text-white transition">
          Home
        </a>
        <a href="#docs" className="hover:text-white transition">
          Docs
        </a>
      </div>
    </div>
  );
};

export default Navbar;