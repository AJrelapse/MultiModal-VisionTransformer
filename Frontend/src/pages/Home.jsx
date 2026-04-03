import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ImageGrid from "../components/ImageGrid";

function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div>
      <h1 className="text-center text-3xl mt-5 font-bold">
        Multimodal Image Search
      </h1>

      <SearchBar onSearch={handleSearch} />

      {loading && (
        <p className="text-center mt-5">Loading...</p>
      )}

      <ImageGrid images={images} />
    </div>
  );
}

export default Home;