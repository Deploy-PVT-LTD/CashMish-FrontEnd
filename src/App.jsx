import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhoneFlipLanding from './components/MainScreen'; // import your landing page
import Login from './components/LoginCard'; // import your login component
import BrandSelection from './components/BrandSelection'; // import your brand selection
import ModelSelection from './components/ModelSelection'
import ConditionSelection from './components/Conditionselection'; // import your condition selection
import Storageselection from './components/Storageselection'; // import your storage selection
import HowItWorks from './components/HowItWork'; // import your how it works
import Userdata from './components/form'; // import your user data form
import DeviceAssessmentForm from './components/deviceassesment';
import PendingPage from './components/pending';
import OfferAcceptancePage from './components/acceptRejectOffer';
import NotFound from './components/NotFound'; // import your 404 Not Found component
import RejectionPage from './components/NotAccepted'; // import your rejection page
import CarrierSelection from './components/Phonecarrier';
import ContactUs from './components/contactus.jsx';
import AboutUs from './components/About';
// import PriceResult from './components/priceresult.jsx';
import MobileCart from './components/Mobilecart.jsx';



function App() {
  return (
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
        {/* <Route path="/priceresult" element={<PriceResult />} /> */}
        <Route path="/cart" element={<MobileCart />} />
       

        

      </Routes>
    </Router>
  );
}

export default App;
