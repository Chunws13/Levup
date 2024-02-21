import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom"
import { Form, Button, Container } from 'react-bootstrap'
import { useState } from "react";
import { API } from "../API";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const naviage = useNavigate();
    const [loginFail, setLoginFail] = useState(false);
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const SubmitFunc = async(event) => {
        event.preventDefault();
        const cookie = new Cookies();
        const body = {id, password};
        
        try {
            const login_request = await API.userLogin(body);
            cookie.set("token", login_request.data.token, {path: "/"});
            naviage("/");

        } catch {
            setLoginFail(true);
        }
    }

  return (
    <Container className="d-flex align-items-center justify-content-center" 
        style={{ minHeight: '70vh'}}>
        <div className="border border-warning border-3 rounded-3 p-5">
            <Form onSubmit={SubmitFunc}>

                <Form.Group className="mb-2" controlId="formbasicEmail" style={{fontSize: "5vw"}}>
                    <Form.Label> ID </Form.Label>
                    <Form.Control onChange={(event) => setId(event.target.value)} 
                        value={id} type="text" name='id'/>
                </Form.Group>

                <Form.Group className="mb-3" style={{fontSize: "5vw"}}>
                    <Form.Label> Password </Form.Label>
                    <Form.Control onChange={(event) => setPassword(event.target.value)} 
                        value={password} type="password" name="pw"/>
                    {loginFail ? <Form.Label style={{color : "red", fontSize : "12px"}}> 아이디 또는 비밀번호를 확인하세요 </Form.Label> : '' }
                    
                </Form.Group>
                
                <div className="d-grid gap-2">
                    <Button type="submit" variant="primary">
                        로그인
                    </Button>

                    <Button variant="dark" onClick={() => {naviage("/signup")}}>
                        회원가입
                    </Button>
                </div>
                
            </Form>
        </div>
    </Container>
  )
}

export default Login;