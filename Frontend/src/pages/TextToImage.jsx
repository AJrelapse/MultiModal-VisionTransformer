import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ImageGrid from "../components/ImageGrid";
import DarkVeil from "../components/DarkVeil";
import Navbar from "../components/Navbar";

function TextToImage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("text", query);

    const res = await fetch("http://127.0.0.1:8000/text-to-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImages(data.images);
    setLoading(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">

      <div className="absolute inset-0 z-0 opacity-60">
        <DarkVeil
          hueShift={320}
          noiseIntensity={0.02}
          scanlineIntensity={0.05}
          scanlineFrequency={2}
          warpAmount={0.2}
          speed={0.3}
        />
      </div>

      <Navbar />

      <div className="relative z-10 flex flex-col items-center pt-28 px-6">

        <h1 className="text-white text-3xl md:text-5xl font-semibold text-center max-w-3xl">
          Text → Image Understanding
        </h1>

        <div className="w-full max-w-2xl mt-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading && (
          <div className="mt-6 text-white/70 animate-pulse">
            Generating results...
          </div>
        )}

        <div className="mt-10 w-full max-w-6xl">
          <ImageGrid images={images} />
        </div>
      </div>
    </div>
  );
}

export default TextToImage;