// src/pages/ConfirmationCode.js
import { useState } from "react";
import { Button, Modal } from "antd";
import MaskedInput from "react-text-mask";
import "../CardData/ObunaPay.css";
import { useParams } from "react-router-dom";

const ConfirmationCode = () => {
  const { id } = useParams();
  console.log(id);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = async (evt) => {
    evt.preventDefault();

    if (confirmationCode.length !== 6) {
      setModalVisible(true);
      setError("Iltimos, 6 raqamli tasdiqlash kodini kiriting!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://64.226.127.111:888//api/confirmCardBinding?userId=" +
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

      if (response.status === 200) {
        console.log("Confirmation Successful:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Boshqa kartani kiriting!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: "20px" }}>Tasdiqlash kodini kiriting</h1>
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
      <Modal
        title="Xato"
        open={modalVisible}
        onOk={() => {
          setModalVisible(false);
          setError(null);
        }}
        onCancel={() => {
          setModalVisible(false);
          setError(null);
        }}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              setModalVisible(false);
              setError(null); 
            }}
          >
            Yopish
          </Button>,
        ]}
      >
        <p>{error}</p> 
      </Modal>
    </div>
  );
};

export default ConfirmationCode;
