import axios from 'axios';
import { useState } from 'react'
import "../css/EachMemo.css"

const EditMemo = (memoId, content, token) => {
    axios.put(`http://127.0.0.1:8000/api/memo/${memoId}`,
            { content },
            { headers : {
            "Authorization" : token,
            "Content-Type": "application/json"
            }}
        ).then(response => window.location.reload())
        .catch(error => alert("에러가 발생했습니다."))
    };

const DeleteMemo = (memoId, token) =>{
    axios.delete(`http://127.0.0.1:8000/api/memo/${memoId}`,
            { headers : {
            "Authorization" : token,
            "Content-Type": "application/json"
            }}
        ).then(window.location.reload())
        .catch(error => alert("에러가 발생했습니다."))
    };

const EachMemo = ({ memoId, content, token }) => {
        const [editable, setEditable] = useState(false);
        const [text, setText] = useState(content);

        const ClickOption = () => setEditable(!editable);
        const ChangeText = (event) => {
            setText(event.target.value);
        };

        const Save = () => {
            EditMemo(memoId, text, token);
            setEditable(!editable);
        }

        const Delete = () => {
            DeleteMemo(memoId, token);
        }
        
        return (
            <div id={ memoId } className='eachMemo'>
                { editable ? 
                    <input className='memo' value={ text } onChange={ChangeText}/> : 
                    <span className='memo'> { content } </span>}

                { editable ? 
                    <button onClick={Save}> 저장 </button> : 
                    <button onClick={ClickOption}> 수정 </button>}

                <button onClick={Delete}> 삭제 </button>
            </div>
        )
    }

export default EachMemo;