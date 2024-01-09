import axios from 'axios';
import { useState, useEffect } from 'react'
import { Cookies } from "react-cookie";
import { useNavigate  } from 'react-router-dom';
import { Form, Button, Container, Stack, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import EachMemo from "./EachMemo"

function Memo() {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [memo, setMemo] = useState([]);
    const [writeMemo, setWriteMemo] = useState("");
    const navigate = useNavigate();

    const Writing = (event) => {
        setWriteMemo(event.target.value);
    }

    const SubmitMemo = async(event) => {
        event.preventDefault();
        
        try { await axios.post("http://127.0.0.1:8000/api/memo", 
                { content : writeMemo },
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    }});
                setWriteMemo("");
                get_memo();
            } 

        catch {
            alert("")
        }
    };

    const EditMemo = async(memoId, content, token) => {
        try { await axios.put(`http://127.0.0.1:8000/api/memo/${memoId}`,
                { content },
                { headers : {
                "Authorization" : token,
                "Content-Type": "application/json"
                }});
                get_memo();

        } catch {
            alert("에러가 발생했습니다");
        }}
    
    const DeleteMemo = async(memoId, token) =>{
        try { await axios.delete(`http://127.0.0.1:8000/api/memo/${memoId}`,
                { headers : {
                "Authorization" : token,
                "Content-Type": "application/json"
                }});
                get_memo();
        } catch {
            alert("에러가 발생했습니다.");
        }}

    
    const get_memo = async() => {
        try {  
            if (token !== null) {
                let response = await axios.get("http://127.0.0.1:8000/api/memo", 
                    { headers : {"Authorization" : token }});
                setMemo(response.data.data);
            };
        } catch {
            
            navigate("login");   
        }
    }
    useEffect(() => {   
        get_memo();
    }, []);

    return (
        <Container fluid > 
            <Container fluid style={{height : "75vh", padding: "3vh"}}>

                <Stack gap={1}>
                    {memo.map((item, index) => {
                        return (
                            <Container fluid key={index} className='eachMemo' >
                                <EachMemo
                                    memoId={item._id.$oid}
                                    content={item.content}
                                    token={token}
                                    EditMemo={EditMemo}
                                    DeleteMemo={DeleteMemo}
                                    status={item.complete_status}
                                    admit_status = {item.admit_status}
                                />
                            </Container>
                            )
                    })}

                </Stack>
            </Container>
            
            <Container fluid style={{ justifyContent: 'center', Height: '10vh' }}>
                <Form onSubmit={SubmitMemo}>
                    <Row>
                        <Col xs={8}>
                            <Form.Control onChange={Writing} value={writeMemo} type="text" name="memo" placeholder=''/>
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