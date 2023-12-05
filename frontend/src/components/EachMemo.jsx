import axios from 'axios';
import { useState } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <Container fluid id={ memoId }>
                <Row>
                    <Col xs={7}>
                        { editable ? 
                            <input className='memo' value={ text } onChange={ChangeText}/> : 
                            <span className='memo'> { content } </span>}
                    </Col>
                    <Col>
                        { editable ? 
                            <Button variant="outline-success" size="sm" onClick={Save}> 저장 </Button> : 
                            <Button variant="outline-info" size="sm" onClick={ClickOption}> 수정 </Button>}
                    </Col>
                    <Col>
                        <Button variant="outline-danger" size="sm" onClick={Delete}> 삭제 </Button>
                    </Col>
                </Row>

            </Container>
        )
    }

export default EachMemo;