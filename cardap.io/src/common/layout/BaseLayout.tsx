import React from "react";
import { Outlet } from "react-router-dom";
import { Cart } from "../../domains/Cart/cart";

const Layout: React.FC = () => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, padding: "16px" }}>
        <Outlet />
      </div>
      <div>
        <Cart />
      </div>
    </div>
  );
};

export default Layout;
