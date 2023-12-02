import axios from 'axios';
import { useState, useEffect } from 'react'
import { Cookies } from "react-cookie";
import EachMemo from "./EachMemo"
import "../css/Memo.css"

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
        <div className='totalMemo'>
            <div className='memoField'>
                {memo.map((item, index) => {
                    return (
                        <div key={index} className='eachMemo'>
                            <EachMemo
                                memoId={item._id.$oid}
                                content={item.content}
                                token={token}
                            />
                        </div>)
                })}
            </div>
            <form className='memoInput' onSubmit={SubmitMemo}> 
                <input type='text' name='memo' placeholder=''/>
                <button type='submit'> Submit</button>
            </form>
        </div>
    )
}

export default Memo;