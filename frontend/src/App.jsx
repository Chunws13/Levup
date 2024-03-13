import { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import './App.css';
import MobileRouter from './components/MobileComponents/MobileRouter'

const App = () => {
  const [isMobile, setIsMobile] = useState(window.outerWidth < 868);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.outerWidth < 868);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='allDevice'>
      {isMobile ?  
        <MobileRouter/>
        : 
        <Container style={{ display:"flex", justifyContent: "center", height: "100vh", alignItems: "center"}}>
          <Row>
            <Row style={{justifyContent : "center", fontSize: "5vw"}}>
              현재 PC 버전은 지원되지 않습니다. 
            </Row>
            
            <Row style={{justifyContent : "center", fontSize: "5vw"}}>
              모바일로 이용해 주세요
            </Row>
          </Row>
        </Container>
      }
    </div>
  );
}

export default App;
