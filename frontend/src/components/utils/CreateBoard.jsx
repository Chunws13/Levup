import { useState } from 'react'
import { Button, Container, Row, Form, Image, Carousel } from 'react-bootstrap'
import { Cookies } from "react-cookie";
import { API } from '../../API';
import { useLocation, useNavigate } from 'react-router-dom';

import "../css/CreateBoard.css"

const CreateBaord = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const cookie = new Cookies();
    const token = cookie.get("token");

    const [title, setTitle] = useState("");
    const [files, setFiles] = useState(null);
    const [index, setIndex] = useState(0);
    const [content, setContent] = useState("");

    const FileSet = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const PostBoard = async(event) => {
        event.preventDefault();
        if (title && files && content) {

            const query = new URLSearchParams(location.search);
            const memoId = query.get('id');
            
            const formData = new FormData();
            
            for (let num = 0; num < files.length; num ++){
                formData.append("files", files[num]);
            };
            
            formData.append("title", title);
            formData.append("content", content);

            if (memoId === null || memoId === undefined){
                return navigate("/");
            };
    
            try{
                const headers = {
                    "Authorization" : token,
                    "Content-Type": "multipart/form-data"
                };
    
                await API.createBoard(memoId, formData, headers)
                navigate('/boards');

            } catch(error){
                alert(error.response.data.detail);
            };
        } else {
            alert("모든 항목을 입력해야 합니다.");
        }
    };

    return (
        <Container className="createBoard">
            <Form onSubmit={PostBoard}>
                <Form.Group className="title">
                    <Form.Label> 완료한 미션 </Form.Label>
                    <Form.Control onChange={(event) => setTitle(event.target.value)} 
                            value={title} type='text' placeholder='제목을 입력하세요.'/>
                </Form.Group>

                <Form.Group className='files'>
                    <Form.Label> 인증 사진 선택 </Form.Label>
                    <Form.Control onChange={FileSet} type="file" accept='image/*' multiple /> 
                </Form.Group>

                <Row className='imgArea'>
                    <Carousel id="previewArea" controls={ files !== null && files.length > 1 ? true : false}
                        activeIndex={index} slide={false} fade variant='dark'
                        onSelect={(selectedIndex) => setIndex(selectedIndex)} >
                        { files !== null && files.length > 0 ?
                            files.map((file, index) => {
                                return ( 
                                        <Carousel.Item className='eachPreview' key={index}>
                                            <Image src = {URL.createObjectURL(file)} alt={file.name}/>
                                        </Carousel.Item>
                                    )
                                }) : 
                                <Carousel.Item className='eachPreview'>
                                    미리보기 영역
                                </Carousel.Item>
                        }
                    </Carousel>
                </Row>

                <Form.Group className='content'>
                    <Form.Label> 내용 </Form.Label>
                    <Form.Control onChange={(event) => setContent(event.target.value)} 
                            value={content} as='textarea' placeholder='내용을 입력하세요' />
                </Form.Group>

                <Row className='submitArea'>
                    <Button type='submit'>
                        글쓰기
                    </Button>
                </Row>
            </Form>
        </Container>
    )
}

export default CreateBaord;