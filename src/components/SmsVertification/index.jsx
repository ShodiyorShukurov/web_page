import {  useEffect } from "react";
import { notification } from "antd";
import MaskedInput from "react-text-mask";
import "../CardData/ObunaPay.css";

const ConfirmationCode = () => {
  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: type,
      description: message,
    });
  };

  // Tasdiqlash funksiyasi
  const handleConfirm = async (code) => {
    try {
      const response = await fetch(
        "https://b2b0-84-54-78-192.ngrok-free.app/api/confirmCardBinding?userId=" +
          localStorage.getItem("obunaPay"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: code,
            transaction_id: localStorage.getItem("transaction_id"),
          }),
        }
      );

      const data = await response.json();
      if (data.card_id != null) {
        window.Telegram.WebApp.close();
      } else {
        openNotificationWithIcon("error", "Boshqa kartani kiriting!");
      }
    } catch (error) {
      console.log(error);
      openNotificationWithIcon(
        "error",
        "Xatolik yuz berdi, qayta urinib ko'ring!"
      );
    }
  };

  const validateCode = (code) => {
    return code && code.length === 6;
  };

  useEffect(() => {
    if (window.Telegram) {
      window.Telegram.WebApp.MainButton.setText("Tasdiqlash").show();

      window.Telegram.WebApp.MainButton.onClick(() => {
        const code = document.getElementById("code").value;
        if (validateCode(code)) {
          handleConfirm(code);
        } else if (!validateCode(code)) {
          notification.error({
            message: "Xatolik",
            description:
              "Iltimos telefon raqamingizga borgan 6 xonali kodni kiriting!",
          });
        }
      });
      return () => {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.MainButton.hide();
        }
      };
    }
  }, []);

  return (
    <div className="container">
      <h1 style={{ marginBottom: "20px", fontSize: "18px" }}>
        {localStorage.getItem("phone").slice(0, 1) === "+"
          ? localStorage.getItem("phone").slice(0, 5) +
            "****" +
            localStorage.getItem("phone").slice(-4)
          : "+" +
            localStorage.getItem("phone").slice(0, 5) +
            "****" +
            localStorage.getItem("phone").slice(-4)}{" "}
        raqamiga yuborilgan tasdiqlash kodini kiriting
      </h1>
      <form>
        <MaskedInput
          id="code"
          mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
          placeholder="000000"
        />
      </form>
    </div>
  );
};

export default ConfirmationCode;
