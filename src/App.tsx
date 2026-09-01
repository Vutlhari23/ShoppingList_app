import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Profile } from './pages/Profile/Profile';
import { Home } from './pages/Home/Home';
import { ShoppingLists } from '../src/pages/Home/ShoppingList';
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/home/:listId" element={<Home />} />
        <Route path="/shoppinglist" element={<ShoppingLists />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/shoppinglist" replace />} />
    </Routes>
  );
}

export default App;
