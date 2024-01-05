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
            EditMemo(memoId, text, token);
            setEditable(!editable);
        }

        const Delete = () => {
            DeleteMemo(memoId, token);
        }

        return (
            <Container fluid id={ memoId }>
                { status ? // 완료되었는가?
                    <Row >
                        <Col>
                            <label className='memo'> <del> { content } </del> </label>
                        </Col>
                        { admit_status ? "" : // 인증글을 올렸는가?
                        <Col >
                             <Link to={`boards/create?id=${memoId}`}>
                                 <Button variant="outline-danger" size="sm"> 인증하기 </Button>
                             </Link>
                         </Col>
                         }
                    </Row>
                    :  // 완료하지 않았는가?
                    <Row>
                        <Col xs={1}>
                            <input type='checkbox' onClick={Delete}/>
                        </Col>
                        <Col xs={6}>
                            { editable ? 
                                <input className='memo' value={ text } onChange={ChangeText}/> : 
                                <label className='memo'> { content } </label>}
                        </Col>
                        <Col xs={5}>
                            { editable ? 
                                <Button variant="outline-success" size="sm" onClick={Save}> 저장 </Button> : 
                                <Button variant="outline-info" size="sm" onClick={ClickOption}> 수정 </Button>}
                        </Col>
                        {/* <Col xs={2}>
                            <Button variant="outline-danger" size="sm" onClick={Delete}> 완료 </Button>
                        </Col> */}
                    </Row>
                    }
            </Container>
        )
    }

export default EachMemo;