import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import LoginForm from "../utils/LoginForm";

import Pl from '../../images/PL.png'
import Notice from "../../images/noticeIcon.png";
import Auth from "../../images/authIcon.png";
import Memo from "../../images/memoIcon.png";
import Profile from "../../images/myInfoIcon.png"

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
                        <Row className="mainlogo">
                            <Image className="logoImage" src={Pl}/>
                        </Row>
                        <Row onClick={() => {navigate("/users")}}>
                            <Button>
                                <Col xs={2}>
                                    <Image src={Profile}/>
                                </Col>
                                <Col xs={10}>
                                    프로필
                                </Col>
                            </Button>
                        </Row>
                        <Row className="memoMenu">
                            <Button onClick={() => {navigate("/memo")}}>
                                <Col xs={2}>
                                    <Image src={Memo}/>
                                </Col>
                                <Col xs={10}>
                                    메모
                                </Col>
                            </Button>
                        </Row>
                        <Row className="authMenu">
                            <Button onClick={() => {navigate("/boards")}}>
                                <Col xs={2}>
                                    <Image src={Auth}/>
                                </Col>
                                <Col xs={10}>
                                    인증 게시판
                                </Col>
                            </Button>
                        </Row>
                        <Row className="reportMenu">
                            <Button onClick={() => {navigate("/reports")}}>
                                <Col xs={2}>
                                    <Image src={Notice}/>
                                </Col>
                                <Col xs={10}>
                                    버그 제보
                                </Col>
                            </Button>
                        </Row>
                    </Container>:

                    <Row id="loginArea">
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