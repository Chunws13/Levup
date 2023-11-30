import axios from 'axios';
import { useState, useEffect } from 'react'
import {Cookies} from "react-cookie";

function Memo() {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [memo, setMemo] = useState([]);

    const SubmitMemo = (event) => {
        event.preventDefault();
        const content = event.target.memo.value;
        
        axios.post("http://127.0.0.1:8000/api/memo", 
            { content },
            { headers : {
                "Authorization" : token,
                "Content-Type": "application/json"
                }}
        ).then(response => {
            window.location.reload();
        }).catch( error => {
                alert("에러 발생");
            }
        )
    };

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/memo", { headers : {
            "Authorization" : token
        }}).then(response => {
            setMemo(response.data.data);
        })
    }, []);

    return (
        <div>
            <div>
                {memo.map((item, index) => {
                    return (
                        <div key={index}> 
                            {item._id.$oid} {item.content}
                        </div>)
                })}
            </div>
            <form onSubmit={SubmitMemo}> 
                <input type='text' name='memo' placeholder=''/>
                <button type='submit'> submit</button>
            </form>
        </div>
    )
}

export default Memo;