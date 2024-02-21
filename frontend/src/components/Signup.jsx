import { useNavigate } from "react-router-dom"
import { Form, Button, Container } from 'react-bootstrap'
import { useState } from "react";
import { API } from "../API";
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
    const naviage = useNavigate();
    
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");

    const SubmitFunc = async(event) => {
        event.preventDefault();
        const body = {id, password, email};
        try {
            await API.userSignUp(body)
            naviage("/login");

        } catch(error) {
            alert(error.response.data.detail);
        };
    };

  return (
    <Container className="d-flex align-items-center justify-content-center" 
        style={{ minHeight: '70vh'}}>
        <div className="border border-warning border-3 rounded-3 p-5">
            <Form onSubmit={SubmitFunc}>

                <Form.Group className="mb-2" controlId="formbasicEmail" >
                    <Form.Label> ID </Form.Label>
                    <Form.Control onChange={(event) => setId(event.target.value)} 
                            value={id} type="text" name='id'/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label> Password </Form.Label>
                    <Form.Control onChange={(event) => setPassword(event.target.value)} 
                            value={password} type="password" name="pw"/>

                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label> Password Check </Form.Label>
                    <Form.Control onChange={(event) => setPassword2(event.target.value)} 
                            value={password2} type="password" name="pw2"/>
                        
                            { password === password2 || password2.length === 0 ? '' : 
                    <Form.Label style={{color : "red", fontSize : "12px"}}> 비밀번호가 일치하지 않습니다. </Form.Label>}
                    
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label> Email </Form.Label>
                    <Form.Control onChange={(event) => setEmail(event.target.value)} 
                            value={email} type="text" name="email"/>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant="dark" type="submit" disabled={
                        password.length > 0 && password2.length > 0 && 
                        password === password2 && id.length > 0 && email.length > 0 ? false : true}>
                        회원가입
                    </Button>
                </div>
                
            </Form>
        </div>
    </Container>
  )
}

export default Signup;