import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import PhoneFlipLanding from './components/MainScreen';
import Login from './components/LoginCard';
import BrandSelection from './components/BrandSelection';
import ModelSelection from './components/ModelSelection'
import ConditionSelection from './components/Conditionselection';
import Storageselection from './components/Storageselection';
import HowItWorks from './components/HowItWork';
import Userdata from './components/form';
import DeviceAssessmentForm from './components/deviceassesment';
import PendingPage from './components/pending';
import OfferAcceptancePage from './components/acceptRejectOffer';
import NotFound from './components/NotFound';
import RejectionPage from './components/NotAccepted';
import CarrierSelection from './components/Phonecarrier';
import ContactUs from './components/contactus.jsx';
import AboutUs from './components/About';
import MobileCart from './components/Mobilecart.jsx';
import CashMishForgotPassword from './components/forgetPassword.jsx'
import ResetPassword from './components/confirmpassword.jsx'
import PriceResult from './components/priceresult.jsx'
import CartLogin from './components/Cartlogin.jsx'
import { WalletProvider } from './components/Walletcontext.jsx';
import Footer from './components/Footer.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import TermsOfService from './components/TermsOfService.jsx';
import CookiePolicy from './components/CookiePolicy.jsx';
import FAQs from './components/FAQs.jsx';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<PhoneFlipLanding />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faqs" element={<FAQs />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<CashMishForgotPassword />} />
          <Route path='/confirm-password' element={<ResetPassword />} />

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
          <Route path='/cartlogin' element={<CartLogin />} /> {/* Ensure 'cart' is capitalized in its file */}

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
        <Footer />
      </Router>
    </WalletProvider>
  );
}

export default App;