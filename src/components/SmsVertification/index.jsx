// src/pages/ConfirmationCode.js
import { useState } from "react";
import { Button, Modal, Input } from "antd";

const ConfirmationCode = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = async () => {
    // Check if the confirmation code is not 6 digits
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
        body: JSON.stringify({ code: confirmationCode }), // Send the confirmation code
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log("Confirmation Successful:", data);
        // Navigate to success page or handle success
      } else {
        setError(data.message || "Xatolik yuz berdi!"); // Display error message
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Xatolik yuz berdi!"); // Display generic error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Tasdiqlash kodini kiriting</h1>
      <Input
        type="text" // Use type="text" to allow custom input validation
        value={confirmationCode}
        onChange={(e) => {
          // Allow only numeric input and limit to 6 characters
          const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
          if (value.length <= 6) {
            setConfirmationCode(value);
          }
        }}
        placeholder="000000"
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          marginTop: "20px",
        }}
      />
      {/* Display error message */}
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
      <Modal
        title="Xato"
        open={modalVisible}
        onOk={() => {
          setModalVisible(false);
          setError(null); // Clear the error message when the modal is closed
        }}
        onCancel={() => {
          setModalVisible(false);
          setError(null); // Clear the error message when the modal is closed
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
