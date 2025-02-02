import { SnackbarProvider } from "notistack";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { BusinessProvider } from "./context/BusinessContext";
import Funnel from "./pages/funnel";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Suggestion from "./pages/suggestion";

function App() {
  return (
    <SnackbarProvider>
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
    </SnackbarProvider>
  );
}

export default App;
