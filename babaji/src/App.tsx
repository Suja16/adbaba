import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Funnel from "./pages/funnel";
import Home from "./pages/home";
import Sidebar from "./component/sidenav";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/funnel" element={<Funnel />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
