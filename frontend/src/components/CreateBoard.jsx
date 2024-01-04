import { useState } from 'react'
import { Button, Container, Row, Col, Form } from 'react-bootstrap'
import axios from 'axios'
import { Cookies } from "react-cookie";
import { useLocation, useNavigate } from 'react-router-dom';

const CreateBaord = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const cookie = new Cookies();
    const token = cookie.get("token");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const Cancel = () => {
        navigate('/');
    }

    const ChangeTitle = (event) => {
        setTitle(event.target.value);
    }

    const ChangeContent = (event) => {
        setContent(event.target.value);
    }

    const PostBoard = async(event) => {
        event.preventDefault();
        const query = new URLSearchParams(location.search);
        const memoId = query.get('id');
        
        if (memoId === null || memoId === undefined){
            return navigate("/");

        }
        
        try{
            await axios.post(`http://127.0.0.1:8000/api/boards/auth/${memoId}`,
                { title, content },
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    }});
            
            navigate('/boards');

        } catch(error){
            alert(error)
            navigate('/');
        };
    };

    return (
        <Container>
            <Form onSubmit={PostBoard}>
                <Form.Group className='mb-3'>
                    <Form.Control onChange={ChangeTitle} value={title} type='text' placeholder='제목을 입력하세요.'/>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Control onChange={ChangeContent} value={content} as='textarea' placeholder='내용을 입력하세요'/>
                </Form.Group>

                <Row className="justify-content-end">
                    <Button onClick={Cancel}> 
                        취소
                    </Button>
                    <Button type='submit'>
                        글쓰기
                    </Button>
                </Row>
            </Form>
        </Container>
    )
}

export default CreateBaord;