import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Form, Button, Container, Image } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { API } from "../../API";
import KakaoLogin from "./KakaoLogin";
import Logo from "../../images/PL.png"

const LoginForm = () => {

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loginFail, setLoginFail] = useState(false);

    const cookie = new Cookies();
    const naviage = useNavigate();

    const SubmitFunc = async(event) => {
        event.preventDefault();
        const body = {id, password};
        
        try {
            const login_request = await API.userLogin(body);
            cookie.set("token", login_request.data.token, {path: "/"});
            naviage("memo/")

        } catch {
            setLoginFail(true);
        }
    }
    return (
        <Container fluid id="loginBody">

        
        <Container id="loginBox">

            <Form onSubmit={SubmitFunc}>
                <Form.Group>
                    <Form.Label> ID </Form.Label>
                    <Form.Control onChange={(event) => setId(event.target.value)}
                        value={id} type="text" name='id'/>
                </Form.Group>

                <Form.Group>
                    <Form.Label> Password </Form.Label>
                    <Form.Control onChange={(event) => setPassword(event.target.value)}
                        value={password} type="password" name="pw"/>

                    {loginFail ? 
                        <Form.Label style={{color : "red"}}> 
                        아이디 또는 비밀번호를 확인하세요 
                        </Form.Label> : 
                    '' }
                </Form.Group>
                
                <Stack gap={3}>
                    <Button type="submit" variant="primary">
                        로그인
                    </Button>

                    <Button variant="dark" onClick={() => {naviage("/signup")}}>
                        회원가입
                    </Button>
                    
                    <div className="section">
                        <span>또는</span>
                    </div>
                    
                    <KakaoLogin/>
                
                </Stack>
            </Form>
        </Container>
        </Container>
    )

};

export default LoginForm;