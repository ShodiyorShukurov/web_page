import { Result, Row, Col } from "antd";



const SuccessPage = () => {

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
