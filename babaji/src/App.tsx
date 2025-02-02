import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Funnel from "./pages/funnel";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Suggestion from "./pages/suggestion";
import { BusinessProvider } from "./context/BusinessContext";

function App() {
  return (
    <BusinessProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/funnel" element={<Funnel />} />
          <Route path="/:pageName" element={<Suggestion />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </BusinessProvider>
  );
}

export default App;
