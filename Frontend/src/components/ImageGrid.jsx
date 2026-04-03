function ImageGrid({ images }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-10 px-10">
      {images.map((img, index) => (
        <img
          key={index}
          src={`http://127.0.0.1:8000${img}`}
          alt="result"
          className="w-full h-60 object-cover rounded shadow"
        />
      ))}
    </div>
  );
}

export default ImageGrid;