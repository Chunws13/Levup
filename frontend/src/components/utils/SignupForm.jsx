import { Container, Form, Button, Stack, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../API";
import "../css/SignupForm.css";
import Pl from '../../images/PL.png'

const SignupForm = () => {

    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const naviage = useNavigate();

    const [btnDisabled, setBtnDisabled] = useState(true);
    
    const SignUp = async(event) => {
        event.preventDefault();

        const body = {id, email, password}
        try{
            await API.userSignUp(body);
            alert(`${id}님, 회원 가입을 환영합니다!`)
            naviage("/");

        } catch(error) {
            alert(error.response.data.detail);
        }

    }

    useEffect(() => {
        if (password2 && password2 === password){
            setBtnDisabled(false);

        } else {
            setBtnDisabled(true);
        }
    }, [password, password2])

    return (
            <Container fluid id="signUpBody">
                <Container id="signUpBox">
                    <Form onSubmit={SignUp}>
                        <Form.Group className="logoArea">
                            <Image src={Pl} className="logo"/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label> ID </Form.Label>
                            <Form.Control onChange={(event) => setId(event.target.value)}
                                placeholder= "아이디를 입력하세요"
                                value={id} type="text" name='id'/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label> E-mail </Form.Label>
                            <Form.Control onChange={(event) => setEmail(event.target.value)}
                                placeholder= "E-mail을 입력하세요"
                                value={email} type="text" name='email'/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label> Password </Form.Label>
                            <Form.Control onChange={(event) => setPassword(event.target.value)}
                                placeholder= "비밀번호"
                                value={password} type="password" name="pw"/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label> Confirm </Form.Label>
                            <Form.Control onChange={(event) => setPassword2(event.target.value)}
                                placeholder= "비밀번호 확인"
                                value={password2} type="password" name="pw2"/>

                            
                                { password2 && password2 != password?
                                    <Form.Label style={{color : "red"}}> 
                                        아이디 또는 비밀번호를 확인하세요 
                                    </Form.Label> : " "
                                }
                            
                        </Form.Group>  

                        <Stack gap={3}>
                            <Button variant="dark" type="submit" disabled={btnDisabled}>
                                회원가입 요청
                            </Button>
                            <Button variant="primary" onClick={() => {naviage("/")}}>
                                로그인
                            </Button>
                        </Stack>

                    </Form>
                </Container>
            </Container>
        )

};
export default SignupForm;