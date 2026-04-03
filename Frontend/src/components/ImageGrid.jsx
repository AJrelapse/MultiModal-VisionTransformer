import { useState } from "react";

function ImageGrid({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images.length) return null;

  const getGridCols = () => {
    if (images.length === 1) return "grid-cols-1";
    if (images.length === 2) return "grid-cols-1 sm:grid-cols-2";
    if (images.length === 3) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  return (
    <>
      <div className="mt-10 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div
            className={`grid ${getGridCols()} gap-6 justify-items-center`}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className="group relative w-full max-w-xs rounded-2xl overflow-hidden 
                bg-white/5 backdrop-blur-md border border-white/10 
                hover:scale-[1.03] transition duration-300 ease-out cursor-pointer"
                onClick={() =>
                  setSelectedImage(`http://127.0.0.1:8000${img}`)
                }
              >
                <img
                  src={`http://127.0.0.1:8000${img}`}
                  alt="result"
                  loading="lazy"
                  className="w-full h-64 object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <p className="text-white text-sm opacity-80">
                    View Image
                  </p>
                </div>

                <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-purple-500/40 transition"></div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="full"
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

export default ImageGrid;