import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import PhoneFlipLanding from './pages/MainScreen';
import Login from './pages/LoginCard';
import BrandSelection from './pages/BrandSelection';
import ModelSelection from './pages/ModelSelection';
import ConditionSelection from './pages/Conditionselection';
import Storageselection from './pages/Storageselection';
import HowItWorks from './pages/HowItWork';
import Userdata from './pages/form';
import DeviceAssessmentForm from './pages/deviceassesment';
import PendingPage from './pages/pending';
import OfferAcceptancePage from './pages/acceptRejectOffer';
import NotFound from './pages/NotFound';
import RejectionPage from './pages/NotAccepted';
import CarrierSelection from './pages/Phonecarrier';
import ContactUs from './pages/contactus';
import AboutUs from './pages/About';
import MobileCart from './pages/Mobilecart';
import CashMishForgotPassword from './pages/forgetPassword';
import ResetPassword from './pages/confirmpassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordNew from './pages/ResetPassword';
import PriceResult from './pages/priceresult';
import CartLogin from './pages/Cartlogin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import FAQs from './pages/FAQs';
import Reviews from './pages/Reviews';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import SellMobile from './pages/SellMobile';
import InstantQuote from './pages/InstantQuote';
import FreePickup from './pages/FreePickup';

// Layout Components
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

// Context
import { WalletProvider } from './contexts/Walletcontext';

function App() {
  return (
    <WalletProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </WalletProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooterOn = ['/login', '/cartlogin', '/signup']; // signup add kiya for future safety
  const shouldHideFooter = hideFooterOn.includes(location.pathname);

  return (
    <div className={shouldHideFooter ? "" : "pt-16"}>
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/" element={<PhoneFlipLanding />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/about" element={<AboutUs isPage={true} />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/sell-mobile" element={<SellMobile />} />
        <Route path="/instant-quote" element={<InstantQuote />} />
        <Route path="/free-pickup" element={<FreePickup />} />
        {/* <Route path="/bulk-selling" element={<BulkSelling />} /> */}

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<CashMishForgotPassword />} />
        <Route path='/confirm-password' element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordNew />} />

        {/* Trade-in Funnel */}
        <Route path="/brandselection" element={<BrandSelection />} />
        <Route path="/modelselection" element={<ModelSelection />} />
        <Route path="/carrierselection" element={<CarrierSelection />} />
        <Route path="/storageselection" element={<Storageselection />} />
        <Route path="/conditionselection" element={<ConditionSelection />} />

        {/* Assessment & Conversion */}
        <Route path='/priceresult' element={<PriceResult />} />
        <Route path="/deviceassessment" element={<DeviceAssessmentForm />} />
        <Route path="/userdata" element={<Userdata />} />
        <Route path="/offeracceptance" element={<OfferAcceptancePage />} />
        <Route path="/cart" element={<MobileCart />} />
        <Route path='/cartlogin' element={<CartLogin />} />

        {/* Status Pages */}
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/notaccepted" element={<RejectionPage />} />

        {/* Policy Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
