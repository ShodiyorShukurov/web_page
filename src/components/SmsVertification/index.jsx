import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Card, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import "./SMSVerification.css";
import axios from "axios";

const SMSVerification = () => {
  const [form] = Form.useForm();
  const [smsCode, setSmsCode] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Buttonni disabled holatida saqlash uchun

  const navigate = useNavigate();

  useEffect(() => {
    // Foydalanuvchi 6 ta raqam kiritganida button enabled bo'ladi
    setIsButtonDisabled(smsCode.length !== 6);
  }, [smsCode]);

  const handleSubmit = async () => {
    try {
      // const response = await axios.post("https://backend-api-url/sms-verification", {
      //   smsCode
      // });

      if (smsCode.length === 6) {
        message.success("SMS code verified successfully");
        navigate("/success-page"); // Kod to'g'ri bo'lsa, boshqa sahifaga o'tish
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to verify SMS code");
    }
  };

  return (
    <div className="form-container">
      <Card title="SMS Verification" className="form-card">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={8} justify="center" align="center">
            <Col span={24}>
              <Form.Item
                label="SMS Code"
                name="smsCode"
                rules={[
                  { required: true, message: "Please enter the SMS code!" },
                ]}
              >
                <Input
                  maxLength={6}
                  placeholder="Enter 6-digit SMS code"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Button  type="primary" htmlType="submit" >
            Verify SMS Code
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SMSVerification;
