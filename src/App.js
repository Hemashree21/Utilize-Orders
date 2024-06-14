import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './Auth'
import Home from './Home'
import CreateOrder from './CreateOrder'
import ProtectedRoute from './ProtectedRoute'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Auth/>}/>
      <Route path='/home' element={<ProtectedRoute element={<Home/>}/>}/>
      <Route path='/createorder' element={<ProtectedRoute element={<CreateOrder/>}/>}/>
      <Route path='/editorder/:id' element={<ProtectedRoute element={<CreateOrder/>}/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App