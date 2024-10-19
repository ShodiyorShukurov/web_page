import { useState } from "react";
import { notification } from "antd";
import MaskedInput from "react-text-mask";
import "../CardData/ObunaPay.css";

const ConfirmationCode = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to show the notification
  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: type === "error" ? "Xatolik": "Muvaffaqiyatli",
      description: message,
    });
  };

  const handleConfirm = async (evt) => {
    evt.preventDefault();

    if (confirmationCode.length !== 6) {
      openNotificationWithIcon(
        "error",
        "Iltimos, 6 raqamli tasdiqlash kodini kiriting!"
      );
      return;
    }

    setLoading(true);

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
        console.log("Confirmation Successful:", data);
        openNotificationWithIcon("success", "Sizning kartangiz ulandi");
      } else {
        openNotificationWithIcon("error", "Boshqa kartani kiriting!");
      }
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", "Boshqa kartani kiriting!");
    } finally {
      setLoading(false);
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
      <form>
        <MaskedInput
          mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
          onChange={(evt) => setConfirmationCode(evt.target.value)}
          value={confirmationCode}
          placeholder="000000"
          required
        />

        <div className="sticky-button">
          <button
            type="button"
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <div className="loader"></div> : "Tasdiqlash"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmationCode;
