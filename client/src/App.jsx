import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UsersList from './pages/UsersList';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/users" element={<UsersList />} /> 
    </Routes>
    </BrowserRouter>
  )
}

export default App
