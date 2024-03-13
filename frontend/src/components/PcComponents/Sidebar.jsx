import { Container, Row, Col, Image, Form } from "react-bootstrap";
import Pl from '../../images/PL.png'
import "./css/PcRouter.css"

const Sidebar = () => {

    return (
        <Container className="sideBar">
            <Row className="logo">
                <Image className="logoImage" src={Pl}/>
            </Row>
            <Row className="imageArea">
                profile
            </Row>
            <Form className="loginArea">
                Login Area
            </Form>
            <Row className="profile">
                개인 정보
            </Row>
            <Row className="memoMenu">
                메모
            </Row>
            <Row className="authMenu">
                인증 게시판
            </Row>
            <Row className="reportMenu">
                버그 제보 게시판
            </Row>
        </Container>
    );
}

export default Sidebar;