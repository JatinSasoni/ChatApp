import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "../Store/store.tsx";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { SocketContextProvider } from "../ContextForSocket/context.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <SocketContextProvider>
    <Provider store={store}>
      <Toaster position="bottom-center" reverseOrder={false} />
      <App />
    </Provider>
  </SocketContextProvider>
);
