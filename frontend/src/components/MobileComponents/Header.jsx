import { Container, Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Pl from '../../images/PL.png'
import Myi from '../../images/myInfoIcon.png'
import Ai from '../../images/authIcon.png'
import Mi from '../../images/memoIcon.png'
import Ni from '../../images/noticeIcon.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/Header.css";

const Header = () => {
    const navigate = useNavigate();

    return (
        <Container fluid className='headContainer'>
            <Row className='logoArea'>
                <Col xs={6}>
                    <Image src={Pl} alt='로고'/>
                </Col>
            </Row>
            <Row className='menuArea'>
                <Col xs={3} onClick={() => navigate("/users")}>
                    <Row>
                        <Image src={Myi} alt='내정보'/>
                    </Row>
                    <Row>
                        내정보
                    </Row>
                </Col>
                <Col xs={3} onClick={() => navigate("/memo")}> 
                    <Row>
                        <Image src={Mi} alt='메모 게시판'/>
                    </Row>
                    <Row>
                        메모
                    </Row> 
                </Col>
                <Col xs={3} onClick={() => navigate("/boards")}> 
                    <Row>
                        <Image src={Ai} alt='인증 게시판'/>
                    </Row>
                    <Row>
                        인증 
                    </Row>
                </Col>
                <Col xs={3}> 
                    <Row>
                        <Image src={Ni} alt='제보 게시판'/>
                    </Row>
                    <Row>
                        공지 / 제보
                    </Row>
                </Col>
            </Row>
        </Container>
    )
};

export default Header;