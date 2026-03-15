import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "../pages/LandingPage"
import HomePage from "../pages/Home"
import EditorPage from "../pages/EditorPage"
import { Toaster } from "react-hot-toast"
import './App.css'

function App() {

  return (
    <>

      <div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0e1117",
              color: "#e2eaf4",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            },
            success: { iconTheme: { primary: "#4f8eff", secondary: "#0e1117" } },
            error: { iconTheme: { primary: "#f87171", secondary: "#0e1117" } },
          }}
        />
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
