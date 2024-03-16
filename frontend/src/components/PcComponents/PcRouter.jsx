import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import CalendarView from '../utils/CalendarView';
import Board from '../utils/Board';
import "./css/CalendarView.css"
import "./css/Board.css"

const PcRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={[<Sidebar/>]}/>
                <Route path = "memo/" element={[<Sidebar/>, <CalendarView/>]}/>
                <Route path = "boards/" element={[<Sidebar/>, <Board/>]}/>
            </Routes>
        </BrowserRouter>
    );
};

export default PcRouter;