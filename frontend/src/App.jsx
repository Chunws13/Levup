import './App.css';
import Login from './components/Login';
import Memo from './components/Memo';
import { Cookies } from "react-cookie"
const App = () => {
  const cookie = new Cookies();
  const token = cookie.get("token");
  const RemoveCookie = () =>{
    cookie.remove("token");
    window.location.reload();
  }

  if (token === undefined){
    return (
      
      <Login/>
      
    );
  } else {
    return (
      <div>
        <div className='header'> 
          <span> You're Logined </span>
          <button onClick={RemoveCookie}> logout </button>
        </div>
        <Memo/>
      </div>
    )
  }
}

export default App;
