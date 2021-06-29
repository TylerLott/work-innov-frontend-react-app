import React, { useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"
import Table from "./components/Table"
import ReactGa from "react-ga"

function App() {
  useEffect(() => {
    ReactGa.initialize("UA-199888472-2")
    ReactGa.pageview(window.location.pathname + window.location.search)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>OCR Table Reader</p>
      </header>
      <div>
        <Table />
      </div>
    </div>
  )
}

export default App
