import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FavoriteList from './pages/FavoriteList';
import TaskDetailPage from './pages/TaskDetailPage';
import SkippedList from './pages/SkippedList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/favorites" element={<FavoriteList />} />
        <Route path="/task/:id" element={<TaskDetailPage />} />
        <Route path="/skipped" element={<SkippedList />} />
      </Routes>
    </Router>
  );
}

export default App;
