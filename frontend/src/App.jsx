import React, { useContext, useState } from 'react'
import './index.css'
import Chatbot from './components/Chatbot.jsx'
// export const AppRoute = 'http://localhost:1234/'
export const AppRoute = '/'



export default function App() {

  return (
    <>
<div className="App">
      <Chatbot/>
    </div>

    </>
  )
}
