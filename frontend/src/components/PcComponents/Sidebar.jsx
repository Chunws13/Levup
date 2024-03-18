import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import LoginForm from "../utils/LoginForm";
import Pl from '../../images/PL.png'
import "./css/Sidebar.css"
import "./css/SidebarLogin.css"
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const cookie = new Cookies();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    useEffect(()=> {
        try{
            setToken(cookie.get("token", {path: "/"}));
        } catch {};
    });

    return (
        <Container className="sideBar">
            <Container className="menu">
                { token? 
                    <Container className="afterLogin">
                        <Row className="logo">
                            <Image className="logoImage" src={Pl}/>
                        </Row>
                        <Row onClick={() => {navigate("/users")}}> 
                            <Button>
                                프로필
                            </Button>
                        </Row>
                        <Row className="memoMenu">
                            <Button onClick={() => {navigate("/memo")}}>
                                메모
                            </Button>
                        </Row>
                        <Row className="authMenu">
                            <Button onClick={() => {navigate("/boards")}}>
                                인증 게시판
                            </Button>
                        </Row>
                        <Row className="reportMenu">
                            버그 제보 게시판
                        </Row>
                    </Container>:

                    <Row className="loginArea">
                        <Row className="logo">
                            <Image className="logoImage" src={Pl}/>
                        </Row>
                        <LoginForm/>
                    </Row>
                }
            </Container>
        </Container>
    );
}

export default Sidebar;