import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Root } from "./routes/root";
import { Patients } from "./routes/patients";
import { AddPatient } from "./routes/add_patient";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/patients",
    element: <Patients />,
  },
  {
    path: "/add_patient",
    element: <AddPatient />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);