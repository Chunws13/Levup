import { Container, Row, Col, Image } from 'react-bootstrap'
import Pl from '../images/PL.png'
import Ti from '../images/tmp_img.ico'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Container>
            <Row style={{height : "7vh"}}>
                <Col style={{margin : "auto"}}>
                    <Image src={Pl} style={{ width : '40%'}} alt='로고'/>
                </Col>
            </Row>
            <Row style={{textAlign : 'center', height : "10vh"}}>
                <Col xs={3} style={{margin : "auto"}}>
                    <div>
                        <Image src={Ti} alt='내정보' roundedCircle/>
                        <p> 내정보 </p>
                    </div> 
                </Col>
                <Col xs={3} style={{margin : "auto"}}> 
                    <Link to ='/' style={{textDecoration : 'none'}}>
                        <Image src={Ti} alt='메모 게시판'roundedCircle />
                        <p> 메모 </p>
                    </Link> 
                </Col>
                <Col xs={3} style={{margin : "auto"}}> 
                    <Link to ='/boards' style={{textDecoration : 'none'}}>
                        <Image src={Ti} alt='인증 게시판' roundedCircle/>
                        <p> 인증 </p>
                    </Link>
                </Col>
                <Col xs={3} style={{margin : "auto"}}> 
                    <div>
                        <Image src={Ti} alt='포인트샵' roundedCircle/>
                        <p> 샵 </p>
                    </div>
                </Col>
            </Row>
        </Container>
    )
};

export default Header;