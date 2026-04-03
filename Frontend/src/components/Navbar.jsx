import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-white"
      : "text-white/60 hover:text-white";

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
      
      <div className="flex items-center justify-between px-6 py-3 rounded-2xl
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-lg shadow-black/30">

        <div
          onClick={() => navigate("/")}
          className="text-white text-lg font-semibold tracking-wide cursor-pointer hover:opacity-80 transition"
        >
          PixSense
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <button
            onClick={() => navigate("/text-to-image")}
            className={`${isActive("/home")} transition`}
          >
            Text → Image
          </button>

          <button
            onClick={() => navigate("/image-to-text")}
            className={`${isActive("/image-to-text")} transition`}
          >
            Image → Text
          </button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;