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

function App() {
  return (
    // <GoogleOAuthProvider clientId="452861807173-7hjq7d43ajl2mqkq4jdkn71boqsef023.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<PhoneFlipLanding />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/brandselection" element={<BrandSelection />} />
          <Route path="/modelselection" element={<ModelSelection />} />
          <Route path="/conditionselection" element={<ConditionSelection />} />
          <Route path="/storageselection" element={<Storageselection />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/Userdata" element={<Userdata />} />
          <Route path="/deviceassessment" element={<DeviceAssessmentForm />} />
          <Route path="/offeracceptance" element={<OfferAcceptancePage />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/notaccepted" element={<RejectionPage />} />
          <Route path="/carrierselection" element={<CarrierSelection />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/About" element={<AboutUs />} />
          <Route path="/cart" element={<MobileCart />} />
          <Route path="/forget-password" element={<CashMishForgotPassword />} />
          <Route path='/confirm-password' element={<ResetPassword/>}/>
        </Routes>
      </Router>
    // </GoogleOAuthProvider>
  );
}

export default App;