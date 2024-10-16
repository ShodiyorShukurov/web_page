import React, { useState } from "react";
import MaskedInput from "react-text-mask";
import { Modal, Button } from "antd"; 
import "./ObunaPay.css";
import { useNavigate } from "react-router-dom";

const ObunaPay = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const navigate = useNavigate()

  const validateForm = () => {
    const cardFilled = cardNumber.length === 19; 
    const expiryFilled = expiryDate.length === 5; 
    return cardFilled && expiryFilled;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setIsModalVisible(true); 
      return;
    }

    setLoading(true); 

    const formattedCardNumber = cardNumber.replace(/\s+/g, ""); // Remove the '/'
if(formattedCardNumber && expiryDate) navigate("/sms-verification");
    // try {
    //   // Send data to backend
    //   const response = await fetch("YOUR_BACKEND_URL", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       formattedCardNumber,
    //       expiryDate, // In MMYY format
    //     }),
    //   });

    //   const data = await response.json();

    //   if (response.status === 200) {
    //     console.log("Success:", data);
    //     // Handle success, show confirmation or redirect
    //   } else {
    //     console.log("Error:", data);
    //     // Handle error cases
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // } finally {
    //   setLoading(false); // Stop loader after backend response
    // }
  };

  const handleModalOk = () => {
    setIsModalVisible(false); // Close modal on OK
  };

  return (
    <div className="container">
      {/* Form Section */}
      <div className="form-section">
        <h1>Bank kartasi ma&apos;lumotlarini kiriting</h1>
        <form onSubmit={handleSubmit}>
          {/* Masked Input for Card Number */}
          <MaskedInput
            mask={[
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]}
            className="card-number"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />

          <MaskedInput
            mask={[/\d/, /\d/, "/", /\d/, /\d/]}
            className="card-expiry"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
          <p>
            To&apos;lovlar faqatgina UzCard va Humo kartalari orqali amalga
            oshiriladi.
          </p>
        </form>
      </div>

      {/* Security Information Section */}
      <div className="security-info">
        <p>
          Xavfsizlik maqsadida sizning bank kartangiz ma&apos;lumotlari PayMe
          xizmatining serverlarida saqlanadi.
        </p>
        <p>
          Obuna xizmati sizning shaxsingizga oid hech qanday ma&apos;lumot
          saqlamaydi.
        </p>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <div className="payme-logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Payme_Logo.png/800px-Payme_Logo.png"
            alt="Payme"
          />
        </div>
      </div>

      {/* Sticky Button with Loader */}
      <div className="sticky-button">
        <button
          type="submit"
          className="confirm-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <div className="loader"></div> : "Tasdiqlash kodini olish"}
        </button>
      </div>

      {/* Modal for Error Message */}
      <Modal
        title="Xatolik"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalOk}>
            OK
          </Button>,
        ]}
      >
        <p>Karta ma&apos;lumotlarini qayta tekshiring</p>
      </Modal>
    </div>
  );
};

export default ObunaPay;
