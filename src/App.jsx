import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/Navbar";
import Carousel1 from "./components/Carousel1";
import Carousel2 from "./components/Carousel2";
import Carousel3 from "./components/Carousel3";
import Carousel4 from "./components/Carousel4";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import HousingDetailsPage from "./pages/HousingDetailsPage";
import FavoritesHousingPage from "./pages/FavoritesHousingPage";
import Page500 from "./pages/Page500";

function App() {

  return (
    <>
      <NavBar></NavBar>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Carousel1 />
              <Carousel2 />
              <Carousel3 />
              {/* <Carousel4 /> */}
            </>
          }
        />
        <Route path="/housingdetails/:accommodationId" element={<HousingDetailsPage />} />
        <Route path="/favoriteshousing" element={<FavoritesHousingPage />} />
        <Route path="/500" element={<Page500/>}/>
      </Routes>

      <Footer></Footer>
    </>
  );
}

export default App;