import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import Signin from './Signin';
import Homepage from './pages/Homepage';
import Registerpage from './pages/Register';
import Successpage from './pages/Successpage';
import Uploadpage from './pages/Upload';
import Usersettingpage from './pages/Setting';
import Content from './pages/Content';
import Searchtopic from './pages/Search';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to ='/' replace />;
  }
  return <Outlet />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signin />}/>
        <Route path='/register' element={<Registerpage />}/>
        <Route element={<ProtectedRoute />}>
          <Route path='/homepage' element={<Homepage />}/>
          <Route path='/success' element={<Successpage />}/>
          <Route path='/upload/:id?' element={<Uploadpage />}/>
          <Route path='/setting' element={<Usersettingpage />}/>
          <Route path='/content/:id' element={<Content />}/>
          <Route path='/search/:searchKeyword' element={<Searchtopic />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)