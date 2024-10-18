// src/pages/ConfirmationCode.js
import { useState } from "react";
import { Button, Modal } from "antd";
import MaskedInput  from "react-text-mask";
import '../CardData/ObunaPay.css'

const ConfirmationCode = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = async (evt) => {
    evt.preventDefault();

    if (confirmationCode.length !== 6) {
      setModalVisible(true);
      setError("Iltimos, 6 raqamli tasdiqlash kodini kiriting!"); // Set error message
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("YOUR_BACKEND_URL/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: confirmationCode }), 
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log("Confirmation Successful:", data);
      } else {
        setError(data.message || "Xatolik yuz berdi!");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Xatolik yuz berdi!"); 
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
              setError(null); // Clear the error message when the modal is closed
            }}
          >
            Yopish
          </Button>,
        ]}
      >
        <p>{error}</p> {/* Display the error message in the modal */}
      </Modal>
    </div>
  );
};

export default ConfirmationCode;
