import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import TextToImage from "./pages/TextToImage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/text-to-image" element={<TextToImage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;