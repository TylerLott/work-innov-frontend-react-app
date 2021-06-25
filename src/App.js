import logo from "./logo.svg"
import "./App.css"
import Table from "./components/Table"

function App() {
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
