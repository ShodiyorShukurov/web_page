import { useState, useEffect } from "react";
import MaskedInput from "react-text-mask";
import { notification } from "antd";
import "./ObunaPay.css";
import { useNavigate, useParams } from "react-router-dom";

const ObunaPay = () => {
  const { id } = useParams();
  localStorage.setItem("obunaPay", id);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const cardFilled = cardNumber.length === 19;
    const expiryFilled = expiryDate.length === 5;
    return cardFilled && expiryFilled;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notification.error({
        message: "Xatolik",
        description: "Karta ma'lumotlarini qayta tekshiring",
      });
      return;
    }

    setLoading(true);
    const formattedCardNumber = cardNumber.replace(/\s+/g, "");

    try {
      const response = await fetch(
        "https://b2b0-84-54-78-192.ngrok-free.app/api/initializeCardBinding?userId=" +
          localStorage.getItem("obunaPay"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            card_number: formattedCardNumber,
            expiry: expiryDate,
          }),
        }
      );

      const data = await response.json();

      if (data.phone == null || data.phone == "null") {
        console.log("Error:", data);
        notification.error({
          message: "Xatolik",
          description: "Iltimos, nomerga ulangan kartani kiriting!",
        });
      } else {
        localStorage.setItem("transaction_id", data.transaction_id);
        localStorage.setItem("phone", data.phone);
        navigate("/sms-verification");
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Xatolik",
        description: "Iltimos, boshqa karta kiriting!",
      });
    } finally {
      setLoading(false);
    }
  };

  // MainButton-ni sozlash
  useEffect(() => {
    if (window.Telegram) {
      window.Telegram.WebApp.MainButton.setText("Tasdiqlash")
        .show()
        .onClick(handleSubmit);
    } else {
      console.log("Telegram WebApp SDK yuklanmagan");
    }

    return () => {
      // Component unmounted bo'lganda tugmani yashirish
      if (window.Telegram) {
        window.Telegram.WebApp.MainButton.hide();
      }
    };
  }, []); // Faqat birinchi yuklashda chaqiriladi

  return (
    <div className="container">
      {/* Form Section */}
      <div className="form-section">
        <h1>Bank kartasi ma&apos;lumotlarini kiriting</h1>
        <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default ObunaPay;
