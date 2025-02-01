import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Funnel from "./pages/funnel";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Suggestion from "./pages/suggestion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/funnel" element={<Funnel />} />
        <Route path="/:pageName" element={<Suggestion />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
