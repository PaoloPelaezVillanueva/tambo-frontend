
import { ToastContainer } from "react-toastify";
import PosPage from "./pages/PosPage";

function App() {
  return (
    <>
      <PosPage />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        theme="light"
      />
    </>
  );
}

export default App;