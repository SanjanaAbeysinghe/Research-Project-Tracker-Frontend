import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-auto py-3">
      <Container>
        <Row>
          <Col className="text-center">
            © 2025 Research Project Tracker. All rights reserved.
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            Contact: <a href="mailto:support@researchtracker.com" className="text-warning">support@researchtracker.com</a> | Phone: +94 76 269 3959
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;