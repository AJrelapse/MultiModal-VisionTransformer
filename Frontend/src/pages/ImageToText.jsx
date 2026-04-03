import { useState } from "react";
import Navbar from "../components/Navbar";
import DarkVeil from "../components/DarkVeil";

function ImageToText() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("http://127.0.0.1:8000/image-to-text", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.captions);
    setLoading(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">

      <div className="absolute inset-0 z-0 opacity-60">
        <DarkVeil
          hueShift={260}
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
          Image → Text Understanding
        </h1>

        <div className="mt-10 w-full max-w-xl">

          <label className="flex flex-col items-center justify-center 
            border border-white/20 bg-white/5 backdrop-blur-md 
            rounded-2xl p-8 cursor-pointer hover:bg-white/10 transition">

            <span className="text-white/70 text-sm mb-2">
              Click to upload image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>

        </div>

        {preview && (
          <div className="mt-6">
            <img
              src={preview}
              alt="preview"
              className="w-64 h-64 object-cover rounded-xl border border-white/10"
            />
          </div>
        )}

        {image && (
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition"
          >
            Generate Description
          </button>
        )}

        {loading && (
          <div className="mt-6 text-white/70 animate-pulse">
            Analyzing image...
          </div>
        )}

        {result && (
          <div className="mt-8 max-w-2xl text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <p className="text-white/90">{result}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ImageToText;