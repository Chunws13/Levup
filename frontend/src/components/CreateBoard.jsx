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
    const [file, setFile] = useState(null);
    const [content, setContent] = useState("");

    const SelectFile = (event) => {
        setFile(event.target.files);
    }

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
        
        const formData = new FormData();
        
        for (let num = 0; num < file.length; num ++){
            formData.append("files", file[num]);
        };
        
        formData.append("title", title);
        formData.append("content", content);
        
        if (memoId === null || memoId === undefined){
            return navigate("/");
        };

        try{
            await axios.post(`http://127.0.0.1:8000/api/boards/auth/${memoId}`,
                formData,
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "multipart/form-data"
                    }});

            navigate('/boards');

        } catch(error){
            alert(error.response.data.detail);
        };
    };

    return (
        <Container fluid style={{height : "75vh", padding: "3vh"}}>
            <Form onSubmit={PostBoard}>
                <Form.Group className='mb-3'>
                    <Form.Control onChange={ChangeTitle} value={title} type='text' style={{fontSize: "3vw"}} placeholder='제목을 입력하세요.'/>
                </Form.Group>

                <Form.Group className='mb-3' style={{fontSize: "3vw"}}>
                    <Form.Label> 인증 사진 첨부 </Form.Label>
                    <Form.Control onChange={SelectFile} type="file" multiple style={{fontSize: "3vw"}} /> 
                
                </Form.Group>

                <Form.Group className='mb-3' >
                    <Form.Control onChange={ChangeContent} value={content} as='textarea' style={{fontSize: "3vw"}} placeholder='내용을 입력하세요' />
                </Form.Group>

                <Row className="justify-content-end">
                    <Col style={{display: "flex", justifyContent :"flex-start"}}>
                        <Button onClick={Cancel} style={{fontSize: "3vw"}}> 
                        취소
                    </Button>
                    </Col>

                    <Col style={{display: "flex", justifyContent :"flex-end"}}>
                        <Button type='submit' style={{fontSize: "3vw"}}>
                            글쓰기
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default CreateBaord;