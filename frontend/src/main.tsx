import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "../Store/store.tsx";
import { Provider } from "react-redux";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
