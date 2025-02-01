import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Funnel from "./pages/funnel";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/funnel" element={<Funnel />} />
      </Routes>
    </Router>
  );
}

export default App;
