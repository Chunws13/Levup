import { Container, Row, Col } from 'react-bootstrap'
import Pl from '../images/PL.png'
import Ti from '../images/tmp_img.ico'
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {

    return (
        <Container>
            <Row>
                <Col>
                    <img src={Pl} style={{ width : '100%'}} alt='로고'/>
                </Col>
            </Row>
            <Row style={{textAlign : 'center'}}>
                <Col>
                    <div>
                        <img src={Ti} alt='내정보'/>
                        <p> 내정보 </p>
                    </div> 
                </Col>
                <Col> 
                    <div>
                        <img src={Ti} alt='메모 게시판'/>
                        <p> 메모 </p>
                    </div> 
                </Col>
                <Col> 
                    <div>
                        <img src={Ti} alt='인증 게시판'/>
                        <p> 인증 </p>
                    </div>
                </Col>
                <Col> 
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