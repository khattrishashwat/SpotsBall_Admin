import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import routes from './routes/index'
import './styles/style.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Loader from "./components/loader/Loader";




function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={routes} />
    </Suspense>
  );
}

export default App;
