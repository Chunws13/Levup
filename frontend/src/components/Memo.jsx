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
    }, [EachMemo]);

    return (
        <Container className="border border-secondary border-2 rounded-3 p-5"
            style={{ width: "40%"}}>    
            <Container style={{ height: '40vh', overflow: "auto"}}>
                <Stack gap={1}>
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