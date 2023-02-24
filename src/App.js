import "./App.css";
import Canvas from "./Canvas";
function App() {
  return (
    <div className="App">
      <header className="App-header">Canvas</header>
      <Canvas />

      <div className="desc">
        <p>POC of drawing rectangle polygons on a Canvas. Each polygon comes with a number field on top. It only accepts 2-digit numbers.</p>
        <p>Each rectangle will generate another field on the right-side panel which the number labels for both are synced.</p>
        <p>You can also write a short description for each rectangle on the side panel. </p>
        <p>You can drag and drop them anywhere in the canvas.</p>
        <p>You can delete the rectangle either by clicking on the "x" on top of it or from the side panel.</p>
      </div>
    </div>
  );
}

export default App;
