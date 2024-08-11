import React from 'react'
import Signin from './components/Signin'
import Login from './components/Login'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import ProfileForm from './components/ProfileForm';
import Chat from './chat/Chat';
const App = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Signin/>}   />
          <Route path="/login" element={<Login/>}   />
          <Route path="/profileform" element={<ProfileForm/>}   />
          <Route path="/chat" element={<Chat/>}/>
        </Routes>
      </Router>
      

    </div>
  )
}

export default App