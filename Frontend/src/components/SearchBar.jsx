import { useState } from "react";

function SearchBar({ onSearch }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    onSearch(text);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 justify-center mt-10">
      <input
        type="text"
        placeholder="Search images..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border px-4 py-2 w-96 rounded"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </form>
  );
}

export default SearchBar;