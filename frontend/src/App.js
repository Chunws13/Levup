import './App.css';
import Login from './Login';
import Memo from './Memo';
import { Cookies } from "react-cookie"
function App() {
  const cookie = new Cookies();
  const token = cookie.get("token");
  const RemoveCookie = () =>{
    cookie.remove("token");
    window.location.reload();
  }

  if (token == undefined){
    return (
      <div>
        <Login/>
      </div>
    );
  } else {
    return (
      <div>
        You're Logined
        <button onClick={RemoveCookie}> logout </button>
        <Memo/>
      </div>
    )
  }
}

export default App;
