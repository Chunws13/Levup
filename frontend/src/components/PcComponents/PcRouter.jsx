import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import CalendarView from '../utils/CalendarView';
import Board from '../utils/Board';
import User from '../utils/User';
import CreateBaord from '../utils/CreateBoard';
import Report from '../utils/Report';

import "../css/Report.css"

const PcRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={[<Sidebar/>]}/>
                <Route path = "memo/" element={[<Sidebar/>, <CalendarView/>]}/>
                <Route path = "boards/" element={[<Sidebar/>, <Board/>]}/>
                <Route path = "memo/boards/create" element={[<Sidebar/>, <CreateBaord/>]}/>
                <Route path = "users/" element={[<Sidebar/>, <User/>]}/>
                <Route path = "reports/" element={[<Sidebar/>, <Report/>]}/>
            </Routes>
        </BrowserRouter>
    );
};

export default PcRouter;