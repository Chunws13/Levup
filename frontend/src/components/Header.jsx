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
                    <Image src={Pl} style={{ width: '40%', height: "auto"}} alt='로고'/>
                </Col>
            </Row>
            <Row style={{textAlign : 'center'}}>
                <Col xs={3} style={{margin : "auto"}}>
                    <Link to = '/users/' style={{textDecoration : 'none', color: "inherit", fontSize: "5vw"}}>
                        <Row className='justify-content-center'>
                            <Image src={Ti} alt='내정보' roundedCircle style={{width: "80%", height: "auto"}}/>
                        </Row>
                        <Row className='justify-content-center'>
                            내정보
                        </Row>
                         
                    </Link>
                </Col>
                <Col xs={3} style={{margin : "auto"}}> 
                    <Link to ='/' style={{textDecoration : 'none', color: "inherit", fontSize: "5vw"}}>
                        <Row className='justify-content-center'>
                            <Image src={Ti} alt='메모 게시판' roundedCircle style={{width: "80%", height: "auto"}}/>
                        </Row>
                        <Row className='justify-content-center'>
                            메모
                        </Row>
                    </Link> 
                </Col>
                <Col xs={3} style={{margin : "auto"}}> 
                    <Link to ='/boards/' style={{textDecoration : 'none', color: "inherit", fontSize: "5vw"}}>
                        <Row className='justify-content-center'>
                            <Image src={Ti} alt='인증 게시판' roundedCircle style={{width: "80%", height: "auto"}}/>
                        </Row>
                        <Row className='justify-content-center'>
                            인증 
                        </Row>
                    </Link>
                </Col>
                <Col xs={3} style={{margin : "auto"}}> 
                    <Link to ='/' style={{textDecoration : 'none', color: "inherit", fontSize: "5vw"}}>
                        <Row className='justify-content-center'>
                            <Image src={Ti} alt='포인트샵' roundedCircle style={{width: "80%", height: "auto"}}/>
                        </Row>
                        <Row className='justify-content-center'>
                            샵
                        </Row>
                    </Link>
                </Col>
            </Row>
        </Container>
    )
};

export default Header;