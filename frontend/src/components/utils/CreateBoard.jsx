import { useState } from 'react'
import { Button, Container, Row, Form, Image } from 'react-bootstrap'
import { Cookies } from "react-cookie";
import { API } from '../../API';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateBaord = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const cookie = new Cookies();
    const token = cookie.get("token");

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [img, setImg] = useState(null);
    const [content, setContent] = useState("");

    const FileSet = (event) => {
        const selectedFiles = event.target.files[0];
        setFile(selectedFiles);

        if (selectedFiles) {
            const imgReader = new FileReader();

            imgReader.onload = (event) => {
                setImg(event.target.result);
            }

            imgReader.readAsDataURL(selectedFiles);
        };
    };

    const PostBoard = async(event) => {
        event.preventDefault();
        if (title && file && content) {

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
                    <Form.Label> 필수 - 인증 사진 첨부 </Form.Label>
                    <Form.Control onChange={FileSet} type="file" accept='image/*' multiple /> 
                </Form.Group>

                <Row className='imgArea'>
                    { img ? <Image className='preview' src={img}/>
                        : "이미지 미리보기 영역"
                    }
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