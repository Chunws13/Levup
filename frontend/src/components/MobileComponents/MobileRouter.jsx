import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header'

import Login from '../utils/LoginForm';
import CalendarView from '../utils/CalendarView';
// import Signup from '../utils/Signup';
import Board from '../utils/Board';
import CreateBaord from '../utils/CreateBoard';
import User from '../utils/User';
import Report from '../utils/Report';

import "../css/LoginForm.css"

const MobileRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "users/" element={[<Header/>, <User />]} />
                <Route path = "memo/" element={[<Header/>, <CalendarView/>]}  />
                <Route path = "/" element={[<Header/>, <Login/>]} />
                {/* <Route path = "/signup" element={<Signup/>} /> */}
                <Route path = "boards/" element={[<Header/>, <Board/>]} />
                <Route path = "memo/boards/create" element={[<Header/>, <CreateBaord/>]}/>
                <Route path = "reports/" element={<Report/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default MobileRouter;