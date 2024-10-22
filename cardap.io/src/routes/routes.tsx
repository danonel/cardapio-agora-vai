import { RouteObject } from "react-router-dom";
import { Home } from "../pages/home";
import { Table } from "../pages/table";
import Layout from "../common/layout/BaseLayout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/table",
        element: <Table />,
      },
    ],
  },
];

export default routes;
