import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';

const PcRouter = () => (
    
    <BrowserRouter>
        <Routes>
            <Route path = "/" element={[<Sidebar/>]}/>
        </Routes>
    </BrowserRouter>
    
)

export default PcRouter;