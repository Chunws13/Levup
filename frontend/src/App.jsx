import { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import './App.css';
import MobileRouter from './components/MobileComponents/MobileRouter'
import PcRouter from './components/PcComponents/PcRouter';

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener('resize', handleResize);
    console.log(window.innerWidth);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='allDevice'>
      {isMobile ?  
        <MobileRouter/>
        : 
        <PcRouter/>
      }
    </div>
  );
}

export default App;
