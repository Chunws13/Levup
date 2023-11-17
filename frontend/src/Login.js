import axios from "axios";
import {Cookies} from "react-cookie";

function Login() {
  const SubmitFunc = (event) => {
    event.preventDefault();
    const cookie = new Cookies();
    const id = event.target.id.value;
    const password = event.target.pw.value;
    
    const postData = {id, password, "email": "test@naver.com"};

    axios.post("http://127.0.0.1:8000/api/login", postData)
        .then(response => {
            cookie.set("token", response.data.token)
            window.location.reload()  
        });
  }

  return (
    <div>
        <div> Welcome! </div>
        <form onSubmit={SubmitFunc}>
            <div>
                <input type='text' name='id' placeholder='ID'/> 
            </div>
            <div>
                <input type='password' name='pw' placeholder='Password'/>
            </div>
            <button type="submit"> sumbit </button>
        </form>
    </div>
  )
}

export default Login;