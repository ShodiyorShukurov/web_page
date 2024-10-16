import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CardForm from "./components/CardData";
import SMSVerification from "./components/SmsVertification";
import SuccessPage from "./components/SuccesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardForm />} />
        <Route path="/sms-verification" element={<SMSVerification />} />
        <Route
          path="/success-page"
          element={<SuccessPage/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
