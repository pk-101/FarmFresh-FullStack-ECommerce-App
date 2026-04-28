import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./cart/CartContext";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
        <AppRoutes />
  );
}

export default App;