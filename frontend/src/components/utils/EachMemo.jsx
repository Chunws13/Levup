import { useState, useEffect } from 'react'
import { Button, Container, Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

import PencilIcon from "../../images/editIcon.png";
import CompleteIcon from "../../images/checkIcon.png";
import ShareIcon from "../../images/shareIcon.png";
import SaveIcon from "../../images/saveIcon.png";
import DoneIcon from "../../images/allDoneIcon.png";

import 'bootstrap/dist/css/bootstrap.min.css';

const EachMemo = ({ memoId, content, token, EditMemo, DeleteMemo, status, admit_status }) => {
        const navigate = useNavigate();

        const [editable, setEditable] = useState(false);
        const [text, setText] = useState(content);

        const ClickOption = () => setEditable(!editable);
        const ChangeText = (event) => {
            setText(event.target.value);
        };

        const Save = () => {
            EditMemo({memoId, content: text, token});
            setEditable(!editable);
        }

        const Delete = () => {
            DeleteMemo({memoId, token});
        }

        useEffect(() => {
            setText(content);

        }, [content]);
        
        return (
            <Container id={ memoId } className='oneMemo'>
                { status ? // 완료되었는가?
                    <Row>
                        <Col xs={10}>
                            <label className='memoCompleteIcon'> <del> { content } </del> </label>
                        </Col>
                        <Col xs={1}>
                        { admit_status ? // 인증글을 올렸는가?
                            
                            <Image src={DoneIcon} alt="인증 완료"/>
                            
                        
                         : 
                            <Button variant="outline-primary" onClick={() => navigate(`boards/create?id=${memoId}`)}>
                                <Image src={ShareIcon} alt="공유하기"/>
                            </Button>
                        }
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                    :  // 완료하지 않았는가?
                    <Row >
                        <Col xs={10}>
                            { editable ? 
                                <input className='memo' value={ content } onChange={ChangeText} style={{border: "none", outline: "none", overflow: "auto"}}/> : 
                                <label className='memo' style={{display:"block"}}> { content } </label>}
                        </Col>
                        <Col xs={1}>
                            { editable ? ""
                                : 
                                <Button variant="outline-secondary" onClick={ClickOption}> 
                                    <Image src={PencilIcon} alt="수정"/>
                                </Button>
                            }
                        </Col>
                        <Col xs={1}>
                            { editable ? 
                                <Button variant="outline-success" onClick={Save}> 
                                    <Image src={SaveIcon} alt="저장"/>
                                </Button> 
                                : 
                                <Button variant="outline-success" onClick={Delete}> 
                                    <Image src={CompleteIcon} alt="수행 완료"/>
                                </Button>
                            }
                        </Col>                        
                    </Row>
                    }
            </Container>
        )
    }

export default EachMemo;