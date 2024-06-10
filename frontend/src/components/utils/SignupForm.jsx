import { Container, Form, Button, Stack } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignupForm.css";

const SignupForm = () => {

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const naviage = useNavigate();
    const loginFail = useState(false);

    return (
            <Container fluid id="signUpBody">
                <Container id="signupBox">
                    <Form>
                        <Form.Group>
                            <Form.Label> ID </Form.Label>
                            <Form.Control onChange={(event) => setId(event.target.value)}
                                value={id} type="text" name='id'/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label> Password </Form.Label>
                            <Form.Control onChange={(event) => setPassword(event.target.value)}
                                value={password} type="password" name="pw"/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label> Password </Form.Label>
                            <Form.Control onChange={(event) => setPassword2(event.target.value)}
                                value={password2} type="password" name="pw2"/>

                            {loginFail ? 
                                <Form.Label style={{color : "red"}}> 
                                    아이디 또는 비밀번호를 확인하세요 
                                </Form.Label> : 
                            '' }
                        </Form.Group>  

                        <Stack gap={3}>
                            <Button variant="dark" type="submit">
                                회원가입
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