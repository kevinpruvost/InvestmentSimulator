import Hero from "./components/Hero";
import Simulator from "./components/Simulator";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  return (
    <div className="antialiased bg-gray-100 min-h-screen">
      <Hero />
      <Simulator />
      <Footer />
    </div>
  );
}

export default App;