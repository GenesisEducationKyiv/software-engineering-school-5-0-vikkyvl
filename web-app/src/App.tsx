import React from 'react';
import './App.css';
import SubscriptionForm from "./pages/SubscriptionForm";
import ConfirmPage from "./pages/ConfirmPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
      <div className="App">
          <Router>
              <Routes>
                  <Route path="/" element={<SubscriptionForm />} />
                  <Route path="/confirm/:token" element={<ConfirmPage />} />
                  <Route path="/unsubscribe/:token" element={<UnsubscribePage />} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
