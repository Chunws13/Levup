import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Memo from './Memo';
import Signup from './Signup';
import Board from './Board';

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path = "/" element={<Memo />}  />
            <Route path = "/login" element={<Login/>} />
            <Route path = "/signup" element={<Signup/>} />
            <Route path = "/board" element={<Board/>} />
        </Routes>
    </BrowserRouter>
)

export default Router;