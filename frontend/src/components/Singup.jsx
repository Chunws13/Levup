import axios from "axios";
import { useNavigate } from "react-router-dom"
import { Form, Button, Container } from 'react-bootstrap'
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
    const naviage = useNavigate();
    
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");

    const ChangeId = (event) => {
        setId(event.target.value);    
    }
    const ChangePassword = (event) => {
        setPassword(event.target.value);    
    }

    const ChangePassword2 = (event) => {
        setPassword2(event.target.value);    
    }

    const ChangeEmail = (event) => {
        setEmail(event.target.value);    
    }

    const SubmitFunc = async(event) => {
        event.preventDefault();
        const postData = {id, password, email};
        try {
            let response = await axios.post("http://127.0.0.1:8000/api/users/signup", postData);
            alert(response.data.data);
            naviage("/login");

        } catch {
            alert("아이디 또는 비밀번호를 확인하세요");
        }
    }

  return (
    <Container className="d-flex align-items-center justify-content-center" 
        style={{ minHeight: '100vh'}}>
        <div className="border border-warning border-3 rounded-3 p-5">
            <p className="text-center"> Project. Levup </p>
            <Form onSubmit={SubmitFunc}>

                <Form.Group className="mb-2" controlId="formbasicEmail" >
                    <Form.Label> ID </Form.Label>
                    <Form.Control onChange={ChangeId} value={id} type="text" name='id'/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label> Password </Form.Label>
                    <Form.Control onChange={ChangePassword} value={password} type="password" name="pw"/>

                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label> Password Check </Form.Label>
                    <Form.Control onChange={ChangePassword2} value={password2} type="password" name="pw2"/>
                    <Form.Label> 에러 발생 메세지 </Form.Label>
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label> Email </Form.Label>
                    <Form.Control onChange={ChangeEmail} value={email} type="text" name="email"/>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant="dark" type="submit">
                        회원가입
                    </Button>
                </div>
                
            </Form>
        </div>
    </Container>
  )
}

export default Signup;