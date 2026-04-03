import React from "react";
import { useNavigate } from "react-router-dom";
import LightPillar from "../components/LightPillar";
import Navbar from "../components/Navbar";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      <div className="absolute inset-0 z-0">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      <Navbar />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        
        <h1 className="text-white text-4xl md:text-6xl font-semibold max-w-3xl leading-tight">
          Multi Modal Vision Transformer with Image-Text Understanding
        </h1>

        <div className="flex gap-4 mt-8">
          
          <button
            onClick={() => navigate("/home")}
            className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:scale-105 transition"
          >
            Text to Image
          </button>

          <button className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full text-sm hover:bg-white/20 transition">
            Image to Text
          </button>

        </div>
      </div>
    </div>
  );
};

export default Landing;