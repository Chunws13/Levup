import './App.css';
import Login from './components/Login';
import Memo from './components/Memo';
import { Cookies } from "react-cookie"
function App() {
  const cookie = new Cookies();
  const token = cookie.get("token");
  const RemoveCookie = () =>{
    cookie.remove("token");
    window.location.reload();
  }

  if (token === undefined){
    return (
      <div>
        <Login/>
      </div>
    );
  } else {
    return (
      <div>
        <div className='header'> 
          <span> You're Logined </span>
          <button onClick={RemoveCookie}> logout </button>
        </div>

        <div className='memoBoard'>
          <Memo/>
        </div>

      </div>
    )
  }
}

export default App;
