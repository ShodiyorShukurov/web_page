import  { useState } from "react";
import { Form, Row, Col, Button, Card, message } from "antd";
import MaskedInput from "antd-mask-input";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import './CardForm.css'

const CardForm = () => {
  const [form] = Form.useForm();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async () => {
    try {
      // const response = await axios.post("https://backend-api-url/card-info", {
      //   cardNumber: cardNumber.replace(/\s+/g, ""), 
      //   expiryDate,
      // });


      if (cardNumber && expiryDate) {
        message.success("Card info submitted successfully");
        navigate("/sms-verification");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to submit card info");
    }
  };

  return (
    <div className="form-container">
      <Card title="Payment Information" className="form-card">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={8} justify="center" align="center">
            <Col span={24}>
              <Form.Item
                label="Card Number"
                name="cardNumber"
                rules={[
                  { required: true, message: "Please input your card number!" },
                ]}
              >
                <MaskedInput
                  mask="0000 0000 0000 0000"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}

                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Expiry Date"
                name="expiryDate"
                rules={[
                  { required: true, message: "Please input expiry date!" },
                ]}
              >
                <MaskedInput
                  mask="00/00"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit">
            Submit Payment Info
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CardForm;
