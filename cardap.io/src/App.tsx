import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { CartProvider } from "./providers/CartProvider";

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />;
    </CartProvider>
  );
}

export default App;
