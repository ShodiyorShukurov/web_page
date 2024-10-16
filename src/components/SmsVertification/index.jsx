// src/pages/ConfirmationCode.js
import  { useState } from "react";
import { Button, Modal } from "antd"; 

const ConfirmationCode = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false); 


  const handleConfirm = async () => {

    if (!confirmationCode) {
      setModalVisible(true); // Show the modal if no code is entered
      return;
    }

    // Check if the confirmation code is not 6 digits
    if (confirmationCode.length !== 6) {
      setError("Iltimos, 6 raqamli tasdiqlash kodini kiriting!");
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
      <input
        type="number"
        maxLength={6} // Ensure the input is at most 6 digits
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        placeholder="000000" // Placeholder for confirmation code
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          marginTop: "20px",
        }} // Basic styling
      />
      {error && <p className="error-message">{error}</p>}{" "}
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
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setModalVisible(false)}
          >
            OK
          </Button>,
        ]}
      >
        <p>SMS kodini kiriting!</p>
      </Modal>
    </div>
  );
};

export default ConfirmationCode;
