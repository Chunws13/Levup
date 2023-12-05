import axios from 'axios';
import { useState, useEffect } from 'react'
import { Cookies } from "react-cookie";
import { Form, Button, Container, Stack, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import EachMemo from "./EachMemo"

function Memo() {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [memo, setMemo] = useState([]);

    const SubmitMemo = async(event) => {
        event.preventDefault();
        const content = event.target.memo.value;
        
        try { await axios.post("http://127.0.0.1:8000/api/memo", 
            { content },
            { headers : {
                "Authorization" : token,
                "Content-Type": "application/json"
                }});

            } catch {
            alert("에러 발생");
        }
    };

    const EditMemo = async(memoId, content, token) => {
        try { await axios.put(`http://127.0.0.1:8000/api/memo/${memoId}`,
            { content },
            { headers : {
            "Authorization" : token,
            "Content-Type": "application/json"
            }});

        } catch {
            alert("에러가 발생했습니다");
        }}
    
    const DeleteMemo = async(memoId, token) =>{
        try { await axios.delete(`http://127.0.0.1:8000/api/memo/${memoId}`,
                { headers : {
                "Authorization" : token,
                "Content-Type": "application/json"
                }});
        } catch {
            alert("에러가 발생했습니다.");
        }}

    useEffect(() => {
        const get_memo = async() => {
            let response = await axios.get("http://127.0.0.1:8000/api/memo", { headers : {"Authorization" : token }})
            try {
                setMemo(response.data.data);
            } catch{
                alert("에러 발생");
            }}
        
        get_memo();

    }, [SubmitMemo, EditMemo, DeleteMemo]);

    return (
        <Container className="border border-secondary border-2 rounded-3 p-5"
            style={{ width: "80%"}}>    
            <Container style={{ minHeight: '40vh', overflow: "auto"}}>
                <Stack gap={1}>
                    {memo.map((item, index) => {
                        return (
                            <div key={index} className='eachMemo'>
                                <EachMemo
                                    memoId={item._id.$oid}
                                    content={item.content}
                                    token={token}
                                    EditMemo={EditMemo}
                                    DeleteMemo={DeleteMemo}
                                />
                            </div>)
                    })}

                </Stack>
                
            </Container>
            <Container>
                <Form onSubmit={SubmitMemo}>
                    <Row>
                        <Col xs={8}>
                            <Form.Control type="text" name="memo" placeholder=''/>
                        </Col>
                        <Col>
                            <div className="d-grid gap-2">
                                <Button variant="success" type='submit'> 메모 </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Container>
    )
}

export default Memo;