import axios from "axios";
import {Cookies} from "react-cookie";
import { Form, Button, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const SubmitFunc = (event) => {
    event.preventDefault();
    const cookie = new Cookies();
    const id = event.target.id.value;
    const password = event.target.pw.value;
    
    const postData = {id, password, "email": "test@naver.com"};
    console.log(postData)
    axios.post("http://127.0.0.1:8000/api/users/login", postData)
        .then(response => {
            cookie.set("token", response.data.token)
            window.location.reload()  
        });
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" 
        style={{ minHeight: '100vh'}}>
        <div className="border border-warning border-3 rounded-3 p-5">
            <p className="text-center"> Project. Levup </p>
            <Form onSubmit={SubmitFunc}>

                <Form.Group className="mb-2" controlId="formbasicEmail" >
                    <Form.Label> ID </Form.Label>
                    <Form.Control type="text" name='id'/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label> Password </Form.Label>
                    <Form.Control type="password" name="pw"/>

                </Form.Group>
                
                <div className="d-grid gap-2">
                    <Button type="submit" variant="primary">
                        로그인
                    </Button>

                    <Button variant="dark">
                        회원가입
                    </Button>
                </div>
                
            </Form>
        </div>
    </Container>
  )
}

export default Login;