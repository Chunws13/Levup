import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Memo from './Memo';

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path = "/" element={<Memo />}  />
            <Route path = "/login" element={<Login/>} />
        </Routes>
    </BrowserRouter>
)

export default Router;