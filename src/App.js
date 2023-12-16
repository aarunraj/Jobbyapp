import {Routes, Route, Navigate} from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Login from './components/Login'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'

import './App.css'

const App = () => (
  <Routes>
    <Route path="/login"  element={<Login/>} />
    <Route element={<ProtectedRoute/>}>
        <Route index element={<Home/>} />
        <Route path="/jobs"  element={<Jobs/>} />
        <Route path="/Jobs/:id" element={<JobItemDetails/>} />
    </Route>
    <Route exact path="/not-found" element={<NotFound/>} />
    <Route path="*" element={<Navigate to="/not-found"/>} />
  </Routes>
)

export default App
