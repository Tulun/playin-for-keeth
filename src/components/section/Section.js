import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  sectionClass: PropTypes.string.isRequired,
}

const defaultProps = {
  sectionClass: '',
}

const Section = ({ children, sectionClass }) => (
  <section className={`py-5 ${sectionClass}`}>
    <Container>
      <Row>
        <Col xs="12" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
          { children }
        </Col>
      </Row>
    </Container>
  </section>
);

Section.propTypes = propTypes;
Section.defaultProps = defaultProps;
export default Section;
