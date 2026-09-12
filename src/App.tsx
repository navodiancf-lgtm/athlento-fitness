import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import WorkoutDetail from "@/pages/WorkoutDetail";
import CategoryPage from "@/pages/CategoryPage";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/workouts/:slug" element={<WorkoutDetail />} />
      <Route path="/workouts" element={<CategoryPage />} />
      <Route path="/training-plans" element={<CategoryPage />} />
      <Route path="/programs" element={<CategoryPage />} />
      <Route path="/challenges" element={<CategoryPage />} />
      <Route path="/guides" element={<CategoryPage />} />
      <Route path="/collections" element={<CategoryPage />} />
    </Routes>
  );
}
