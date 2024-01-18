import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Memo from './Memo';
import Signup from './Signup';
import Board from './Board';
import Header from './Header'
import CreateBaord from './CreateBoard';
import User from './User';

const Router = () => (
    
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path = "/users" element={<User />} />
            <Route path = "/" element={<Memo />}  />
            <Route path = "/login" element={<Login/>} />
            <Route path = "/signup" element={<Signup/>} />
            <Route path = "/boards" element={<Board/>} />
            <Route path = "/boards/create" element={<CreateBaord/>} />
        </Routes>
    </BrowserRouter>
    
)

export default Router;