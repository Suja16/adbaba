import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Funnel from "./pages/funnel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Funnel />} />
      </Routes>
    </Router>
  );
}

export default App;
