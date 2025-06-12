import { Route, Routes } from "react-router-dom";
import MovieDetails from "./pages/MovieDetails";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

const routes = [
  { path: "/", component: <HomePage /> },
  { path: "/movie/:id", component: <MovieDetails /> },
  { path: "*", component: <NotFound /> },
];

const App = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
};

export default App;
