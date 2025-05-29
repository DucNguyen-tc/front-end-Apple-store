import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerRoutes from "./routes/CustomerRoutes";
import AdminRoutes from "./routes/AdminRoutes";


function App() {
  return (

      <Router>
        <Routes>
          <Route path="/*" element={<CustomerRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Router>

  );
}

export default App;
