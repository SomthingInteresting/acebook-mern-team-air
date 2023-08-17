import './App.css';
import LoginForm from '../auth/LoginForm'
import SignUpForm from '../user/SignUpForm'
import UserForm from '../updates/UserForm'
import GoodbyeForm from '../delete/GoodbyeForm';
import React, { useState } from 'react';
import Feed from '../feed/Feed'
import {
  useNavigate,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Navigation from '../nav_bar/nav_bar';

import logo from './smbg.png'

const App = () => {
    return (
      <>
      <div className='background'>
      <div className='logo' />
      <Navigation />
        <Routes>
          <Route path='/' element={<Navigate to="/signup" />} />
          <Route path='/posts'  element={<Feed navigate={ useNavigate() }/>}/>
          <Route path='/login'  element={<LoginForm  navigate={ useNavigate() }/>}/>
          <Route path='/signup' element={<SignUpForm navigate={ useNavigate() }/>}/>
          <Route path='/profile' element={<UserForm navigate={useNavigate()} />} />
          <Route path='/goodbye' element={<GoodbyeForm navigate={useNavigate()} />} />
        </Routes>
      </div>
      </>
    );
}

export default App;
