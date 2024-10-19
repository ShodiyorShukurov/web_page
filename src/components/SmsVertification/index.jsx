import { useState, useEffect } from "react";
import { Form, notification } from "antd";
import MaskedInput from "react-text-mask";
import "../CardData/ObunaPay.css";

const ConfirmationCode = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.Telegram) {
      window.Telegram.WebApp.MainButton.setText("Tasdiqlash").show().onClick(); 
      // Tugmaga handleConfirm funksiyasini bog'lash
      window.Telegram.WebApp.MainButton.onClick(handleConfirm);
      return () => {
        // Component unmounted bo'lganda tugmani yashirish
        window.Telegram.WebApp.MainButton.hide();
      };
    }
  }, [confirmationCode]); // confirmationCode o'zgarsa tugmani yangilash

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: type,
      description: message,
    });
  };

  // Tasdiqlash funksiyasi
  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true); // Yuklanmoqda belgisini ko'rsatish
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
            otp: confirmationCode,
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
    } finally {
      setLoading(false); // Yuklanmoqda belgisini yashirish
    }
  };

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
      <Form>
        <Form.Item
          rules={[
            { required: true, message: "Iltimos, 6 xonali kodni kiriting!" },
          ]}
        >
          <MaskedInput
            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
            onChange={(evt) => setConfirmationCode(evt.target.value)}
            value={confirmationCode}
            placeholder="000000"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ConfirmationCode;
