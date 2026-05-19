import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Carousel1 from "./components/Carousel1";
import Carousel2 from "./components/Carousel2";
import Carousel3 from "./components/Carousel3";
import Carousel4 from "./components/Carousel4";
import HousingDetailsPage from "./pages/HousingDetailsPage";
import FavoritesHousingPage from "./pages/FavoritesHousingPage";
import Page500 from "./pages/Page500";
import Page404 from "./pages/Page404";
import NewHousePage from "./pages/NewHousePage";
import YourHouses from "./pages/YourHouses";
import ProfilePage from "./pages/ProfilPage";
import EditProfilePage from "./pages/EditProfilePage";
import ModalLogin from "./components/ModalLogin";
import OnlyPrivate from "./components/OnlyPrivate";
import MyBookingsPage from "./pages/MyBookingsPage";
import PaymentPage from "./pages/PaymentPage";
import MyReviewsPage from "./pages/MyReviewsPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaginaResultados from "./pages/PaginaResultados";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="app-shell">
      <ModalLogin
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
      />
      <NavBar />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Carousel1 setShowLoginModal={setShowLoginModal} />
                <Carousel2 setShowLoginModal={setShowLoginModal} />
                <Carousel3 setShowLoginModal={setShowLoginModal} />
                <Carousel4 setShowLoginModal={setShowLoginModal} />
              </>
            }
          />
          <Route
            path="/housingdetails/:accommodationId"
            element={<HousingDetailsPage />}
          />
          <Route path="/search" element={<PaginaResultados />} />
          <Route
            path="/favoriteshousing"
            element={
              <OnlyPrivate>
                <FavoritesHousingPage />
              </OnlyPrivate>
            }
          />
          <Route
            path="/newHouse"
            element={
              <OnlyPrivate>
                <NewHousePage />
              </OnlyPrivate>
            }
          />
          <Route
            path="/myHouses"
            element={
              <OnlyPrivate>
                <YourHouses />
              </OnlyPrivate>
            }
          />
          <Route
            path="/myProfile"
            element={
              <OnlyPrivate>
                <ProfilePage />
              </OnlyPrivate>
            }
          />
          <Route
            path="/editProfile"
            element={
              <OnlyPrivate>
                <EditProfilePage />
              </OnlyPrivate>
            }
          />
          <Route
            path="/myBookings"
            element={
              <OnlyPrivate>
                <MyBookingsPage />
              </OnlyPrivate>
            }
          />
          <Route
            path="/myReviews"
            element={
              <OnlyPrivate>
                <MyReviewsPage />
              </OnlyPrivate>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <OnlyPrivate>
                <PaymentPage />
              </OnlyPrivate>
            }
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* /500 va ANTES del catch-all para que pueda renderizarse */}
          <Route path="/500" element={<Page500 />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
