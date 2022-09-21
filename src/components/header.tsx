/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const HeaderComponent = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="https://shyft.to">
          <img
            src="/logo512.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Nav className="me-auto">
          <Link href="https://docs.shyft.to" passHref>
            <Nav.Link>Docs</Nav.Link>
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
