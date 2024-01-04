import { Container, Row, Col } from 'react-bootstrap'
import Pl from '../images/PL.png'
import Ti from '../images/tmp_img.ico'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Container>
            <Row style={{height : "7vh"}}>
                <Col style={{margin : "auto"}}>
                    <img src={Pl} style={{ width : '40%'}} alt='로고'/>
                </Col>
            </Row>
            <Row style={{textAlign : 'center', height : "10vh"}}>
                <Col style={{margin : "auto"}}>
                    <div>
                        <img src={Ti} alt='내정보'/>
                        <p> 내정보 </p>
                    </div> 
                </Col>
                <Col style={{margin : "auto"}}> 
                    <Link to ='/' style={{textDecoration : 'none'}}>
                        <img src={Ti} alt='메모 게시판'/>
                        <p> 메모 </p>
                    </Link> 
                </Col>
                <Col style={{margin : "auto"}}> 
                    <Link to ='/boards' style={{textDecoration : 'none'}}>
                        <img src={Ti} alt='인증 게시판'/>
                        <p> 인증 </p>
                    </Link>
                </Col>
                <Col style={{margin : "auto"}}> 
                    <div>
                        <img src={Ti} alt='포인트샵'/>
                        <p> 샵 </p>
                    </div>
                </Col>
            </Row>
        </Container>
    )
};

export default Header;