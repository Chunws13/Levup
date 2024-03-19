import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

import PencilIcon from "../../images/editIcon.png";
import CompleteIcon from "../../images/checkIcon.png";
import ShareIcon from "../../images/shareIcon.png";

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
                        <Col xs={1}></Col>
                        <Col xs={8}>
                            <label className='memoCompleteIcon'> <del> { content } </del> </label>
                        </Col>
                        { admit_status ? // 인증글을 올렸는가?
                        <Col xs={3}>
                            <Button variant="outline-danger" size="sm"> 완료 </Button>
                        </Col>
                         : 
                        <Col xs={1}>
                            <Button variant="outline-danger" onClick={() => navigate(`boards/create?id=${memoId}`)}> 
                                <Col>
                                    <Image src={ShareIcon}/>
                                </Col>
                                <Col>
                                    공유하기
                                </Col>
                            </Button>
                         </Col>
                         }
                    </Row>
                    :  // 완료하지 않았는가?
                    <Row >
                        <Col xs={9}>
                            { editable ? 
                                <input className='memo' value={ content } onChange={ChangeText} style={{border: "none", outline: "none", overflow: "auto"}}/> : 
                                <label className='memo' style={{display:"block"}}> { content } </label>}
                        </Col>
                        <Col xs={1}>
                            { editable ? ""
                                : 
                                <Button variant="outline-secondary" onClick={ClickOption}> 
                                    <Image src={PencilIcon}/>
                                </Button>
                            }
                        </Col>
                        <Col xs={1}>
                            { editable ? 
                                <Button variant="outline-success" onClick={Save}> 저장 </Button> : 
                                <Button variant="outline-success" onClick={Delete}> 
                                    <Image src={CompleteIcon} />
                                </Button>
                            }
                        </Col>                        
                    </Row>
                    }
            </Container>
        )
    }

export default EachMemo;