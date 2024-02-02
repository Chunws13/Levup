import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const EachMemo = ({ memoId, content, token, EditMemo, DeleteMemo, status, admit_status }) => {
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

        return (
            <Container fluid id={ memoId }>
                { status ? // 완료되었는가?
                    <Row>
                        <Col xs={8}>
                            <label className='memo' style={{display :"flex", justifyContent: 'flex-start', alignItems: "center", overflowX: "scroll", fontSize:"5vw"}}> <del> { content } </del> </label>
                        </Col>
                        { admit_status ? 
                        <Col xs={4} style={{display :"flex", justifyContent: 'flex-end'}}>
                            <Button variant="outline-danger" size="sm" style={{fontSize:"3vw"}}> 완료 </Button>
                        </Col>
                         : // 인증글을 올렸는가?
                        <Col xs={4} style={{display :"flex", justifyContent: 'flex-end'}}>
                             <Link to={`boards/create?id=${memoId}`}>
                                 <Button variant="outline-danger" size="sm" style={{fontSize:"3vw"}}> 인증 </Button>
                             </Link>
                         </Col>
                         }
                    </Row>
                    :  // 완료하지 않았는가?
                    <Row >
                        <Col xs={1} style={{display :"flex", justifyContent: 'center'}}>
                            <input type='checkbox' onClick={Delete}/>
                        </Col>
                        <Col xs={8} style={{display :"flex", justifyContent: 'flex-start', alignItems: "center", overflowX: "auto", whiteSpace: "nowrap", fontSize:"5vw"}}>
                            { editable ? 
                                <input className='memo' value={ text } onChange={ChangeText} style={{border: "none", outline: "none", overflow: "auto"}}/> : 
                                <label className='memo' style={{display:"block"}}> { content } </label>}
                        </Col>
                        <Col xs={3} style={{display :"flex", justifyContent: 'flex-end'}}>
                            { editable ? 
                                <Button variant="outline-success" size="sm" onClick={Save} style={{fontSize:"3vw"}}> 저장 </Button> : 
                                <Button variant="outline-info" size="sm" onClick={ClickOption} style={{fontSize:"3vw"}}> 수정 </Button>}
                        </Col>                        
                    </Row>
                    }
            </Container>
        )
    }

export default EachMemo;