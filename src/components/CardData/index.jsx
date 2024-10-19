import { useEffect } from "react";
import MaskedInput from "react-text-mask";
import { notification } from "antd";
import "./ObunaPay.css";
import { useNavigate, useParams } from "react-router-dom";

const ObunaPay = () => {
  const { id } = useParams();
  localStorage.setItem("obunaPay", id);
  const navigate = useNavigate();

  const validateCardNumber = (value) => {
    return value && value.length === 19;
  };

  const validateExpiryDate = (value) => {
    return value && /^(0[1-9]|1[0-2])\/(\d{2})$/.test(value);
  };



  const handleSubmit = async (cardNumber, expiryDate) => {
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

      if (data.phone == null || data.phone === "null") {
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
    }
  };


    useEffect(() => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.MainButton.setText("Tasdiqlash").show();
        window.Telegram.WebApp.MainButton.onClick(() => {
          const cardNumber = document.querySelector(".card-number").value;
          const expiryDate = document.querySelector(".card-expiry").value;

          if (
            validateCardNumber(cardNumber) &&
            validateExpiryDate(expiryDate)
          ) {
            handleSubmit(cardNumber, expiryDate);
          } else {
            if (!validateCardNumber(cardNumber)) {
              notification.error({
                message: "Xatolik",
                description: "Karta raqamini to'g'ri kiriting!",
              });
            }
            if (!validateExpiryDate(expiryDate)) {
              notification.error({
                message: "Xatolik",
                description:
                  "Kartangizning amal qilish muddatini to'g'ri kiriting! (MM/YY formatida)",
              });
            }
          }
        });
      } else {
        console.log("Telegram WebApp SDK yuklanmagan");
      }

      return () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.MainButton.hide();
        }
      };
    }, []);

  return (
    <div className="container">
      <div className="form-section">
        <h1>Bank kartasi ma&apos;lumotlarini kiriting</h1>
        <form>
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
            required
          />
          <MaskedInput
            id="card-number"
            mask={[/\d/, /\d/, "/", /\d/, /\d/]}
            className="card-expiry"
            placeholder="MM/YY"
            required
          />
          <p>
            To&apos;lovlar faqatgina UzCard va Humo kartalari orqali amalga
            oshiriladi.
          </p>
        </form>
      </div>

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
