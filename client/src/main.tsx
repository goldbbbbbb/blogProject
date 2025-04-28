import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Signin from './Signin';
import Homepage from './pages/Homepage';
import Registerpage from './pages/Register';
import Successpage from './pages/Successpage';
import Uploadpage from './pages/Upload';
import Content from './pages/Content';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signin />}/>
        <Route path='/register' element={<Registerpage />}/>
        <Route path='/homepage' element={<Homepage />}/>
        <Route path='/success' element={<Successpage />}/>
        <Route path='/upload' element={<Uploadpage />}/>
        <Route path='/content/:topic' element={<Content />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)