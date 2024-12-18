import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { api } from "./api/index.js";
import DataSheet from './components/DataSheet.jsx';

function App() {
  // useEffect(() => {
  //   api.get(`/api/courses`).then(res => console.log(res.data));
  // }, [])

  return (
    <>
      <DataSheet />
    </>
  )
}

export default App
