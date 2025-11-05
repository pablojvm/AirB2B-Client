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
import NewHousePage from "./pages/NewHousePage";
import YourHouses from "./pages/YourHouses";
import ProfilePage from "./pages/ProfilPage";
import EditProfilePage from "./pages/EditProfilePage";
import ModalLogin from "./components/ModalLogin";
import { useState } from "react";
import OnlyPrivate from "./components/OnlyPrivate";
import MyBookingsPage from "./pages/MyBookingsPage";
import PaymentPage from "./pages/PaymentPage";
import MyReviewsPage from "./pages/MyReviewsPage";

function App() {

  const [showLoginModal, setShowLoginModal] = useState(false);


  return (
    <>

      <ModalLogin show={showLoginModal} handleClose={() => setShowLoginModal(false)} />
      <NavBar/>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Carousel1 />
              <Carousel2 />
              <Carousel3 />
              <Carousel4 />
            </>
          }
        />
        <Route path="/housingdetails/:accommodationId" element={<HousingDetailsPage />} />
        <Route path="/favoriteshousing" element={<OnlyPrivate><FavoritesHousingPage/></OnlyPrivate>} />
        <Route path="/newHouse" element={<OnlyPrivate><NewHousePage/></OnlyPrivate>}/>
        <Route path="/myHouses" element={<OnlyPrivate><YourHouses/></OnlyPrivate>}/>
        <Route path="/myProfile" element={<OnlyPrivate><ProfilePage/></OnlyPrivate>}/>
        <Route path="/editProfile" element={<OnlyPrivate><EditProfilePage/></OnlyPrivate>}/>
        <Route path="/myBookings" element={<OnlyPrivate><MyBookingsPage/></OnlyPrivate>}/>
        <Route path="/myReviews" element={<OnlyPrivate><MyReviewsPage/></OnlyPrivate>}/>
        <Route path="/payment/:bookingId" element={<OnlyPrivate><PaymentPage/></OnlyPrivate>}/>
        <Route path="/500" element={<Page500/>}/>
      </Routes>

      <Footer/>
    </>
  );
}

export default App;