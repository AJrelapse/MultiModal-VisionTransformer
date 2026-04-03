import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import TextToImage from "./pages/TextToImage";
import ImageToText from "./pages/ImageToText";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/text-to-image" element={<TextToImage />} />
        <Route path="/image-to-text" element={<ImageToText />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;