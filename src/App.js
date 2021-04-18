import "./App.css";

import { NavBar } from "./components/NavBar";
import { Content } from "./components/Content";
function App() {
  return (
    <div className='layout'>
      <NavBar />
      <Content />
    </div>
  );
}

export default App;
