import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Dayview from './Dayview';
import HomeView from './HomeView';
import Navbar from './Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/day" element={<Dayview />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
