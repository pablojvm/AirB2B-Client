import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/Navbar";
import Carousel1 from './components/Carousel1';
import Carousel2 from './components/Carousel2'
import Carousel3 from './components/Carousel3';
import Carousel4 from './components/Carousel4'
import Footer from './components/Footer';

function App() {

  return (
    <>
    <NavBar></NavBar>
    <Carousel1></Carousel1>
    <Carousel2></Carousel2>
    <Carousel3></Carousel3>
    <Carousel4></Carousel4>
    <Footer></Footer>
    </>
  )
}

export default App
