import { Result, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";


const SuccessPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Bosh sahifaga qaytish
  };

  return (
    <div className="success-container">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col span={24}>
          <Result
            status="success"
            title="Congratulations!"
            subTitle="Your SMS code has been successfully verified."
          />
        </Col>
      </Row>
    </div>
  );
};

export default SuccessPage;
