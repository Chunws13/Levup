import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import CalendarView from '../utils/CalendarView';
import "./css/SidebarMemo.css"
import "./css/CalendarView.css"

const PcRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={[<Sidebar/>]}/>
                <Route path = "memo/" element={[<Sidebar/>, <CalendarView/>]}/>
            </Routes>
        </BrowserRouter>
    );
};

export default PcRouter;