import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "../Store/store.tsx";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { SocketContextProvider } from "../ContextForSocket/context.tsx";

createRoot(document.getElementById("root")!).render(
  <SocketContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </SocketContextProvider>
);
