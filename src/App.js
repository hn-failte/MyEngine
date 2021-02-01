import "./App.css";
import Engine from "./Engine";

const template = {
  key: "root",
  widget: "Text"
};

function App() {
  return (
    <div className="App">
      <Engine template={template} />
    </div>
  );
}

export default App;
