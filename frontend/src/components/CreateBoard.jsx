import { useState } from 'react'
import { Button, Container, Row, Col, Form } from 'react-bootstrap'
import axios from 'axios'
import { Cookies } from "react-cookie";

const CreateBaord = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const PostBoard = () => {

        let postData = {};
        try{
            axios.post("http://127.0.0.1:8000/api/memo",
                { content : postData },
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    }});

        } catch {

        }
    }

    return (
        <Container>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Control type='text' placeholder='제목을 입력하세요.'/>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Control as='textarea' placeholder='내용을 입력하세요'/>
                </Form.Group>

                <Row className="justify-content-end">
                    <Button> 
                        취소
                    </Button>
                    <Button>
                        글쓰기
                    </Button>
                </Row>
            </Form>
        </Container>
    )
}

export default CreateBaord;