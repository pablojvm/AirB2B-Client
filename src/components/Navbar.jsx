import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import { InputGroup, Button, Form, Container, Dropdown, DropdownButton } from 'react-bootstrap';

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Image src="logoair.png" width='100px'/>
      </Container>
      <Container>
        <InputGroup className="mb-3">
        <Form.Control
          placeholder="Introducir destino"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          style={{borderRadius:"20px"}}
        />
        <Button variant="outline-secondary" id="button-addon2" style={{borderRadius:"20px"}}>
          <img src="lupa.png" width={"20px"}/>
        </Button>
      </InputGroup>
      </Container>
      <Container style={{display:"flex", justifyContent:"flex-end"}}>
        <h4 href="">Hazte anfitrion</h4>
        <DropdownButton  id="dropdown-basic-button" title="Config"src="config.png" variant="secondary">
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>
      </Container>

    </Navbar>
  );
}

export default NavBar;