import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom"
import { Form, Button, Container, Image, Stack } from 'react-bootstrap'
import { useState } from "react";
import { API } from "../../API";
import KakaoLoginBtn from "../../images/kakao_login.png"
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const naviage = useNavigate();
    const [loginFail, setLoginFail] = useState(false);
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    
    const KakaoLogin = () => {
        window.Kakao.Auth.login({
            success: async function(data) {
                await KakaoLoginSuccess(data);
            },
            fail: function(data){
                alert(data);
            }
        });
    }
    const KakaoLoginSuccess = async(data) => {
        const access_token = data.access_token;
        const body = {access_token: access_token};
        const cookie = new Cookies();

        const login_request = await API.kakoLoginRequset(body);
        cookie.set("token", login_request.data.token, {path: "/"});
        naviage("/");

    };

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
    <Container fluid
        style={{ height: '70vh', width: '90vw', display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Container style={{height: "60%", border: "3px solid black", borderRadius: "1vh"}}>

            <Form onSubmit={SubmitFunc} style={{height: "100%", padding: "2vw"}}>
                
                <Form.Group controlId="formbasicEmail" style={{fontSize: "5vw", height: "30%"}}>
                    <Form.Label> ID </Form.Label>
                    <Form.Control onChange={(event) => setId(event.target.value)} style={{fontSize: "5vw"}} 
                        value={id} type="text" name='id'/>
                </Form.Group>

                <Form.Group style={{fontSize: "5vw", height:"30%"}}>
                    <Form.Label> Password </Form.Label>
                    <Form.Control onChange={(event) => setPassword(event.target.value)} style={{fontSize: "5vw"}} 
                        value={password} type="password" name="pw"/>

                    {loginFail ? <Form.Label style={{color : "red", fontSize : "12px"}}> 아이디 또는 비밀번호를 확인하세요 </Form.Label> : '' }
                </Form.Group>
                
                <Stack gap={3}>
                    <Button type="submit" variant="primary" style={{fontSize: "5vw"}}>
                        로그인
                    </Button>

                    <Button variant="dark" onClick={() => {naviage("/signup")}} style={{fontSize: "5vw"}}>
                        회원가입
                    </Button>
                    
                    <Button style={{ border: 'none', padding: 0, backgroundColor: 'transparent'}}>
                        <Image onClick={KakaoLogin} src={KakaoLoginBtn} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    </Button>                       
                </Stack>
            </Form>
        </Container>
    </Container>
  )
}

export default Login;