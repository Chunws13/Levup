import { Container, Form, Stack, Row, Col, Button } from "react-bootstrap";
import { API } from "../../API";
import { useState } from "react";
import EachMemo from "./EachMemo";

const Memo = ({ token, date, memoList, SubmitMemo, EditMemo, DeleteMemo }) => {
    const [writeMemo, setWriteMemo] = useState("");

    const Submit = (event) => {
        event.preventDefault();
        SubmitMemo({date: date, content: writeMemo});
        setWriteMemo("");
    }
        
    return (
        <Container fluid className="memoArea">
            <Container fluid className="memoSection">
                <Container fluid className="memoList">
                    {memoList.length > 0 ?
                        <Stack gap={3}>
                            {memoList.map((item, index) => {
                                return (
                                    <Container fluid key={index} className='eachMemo'>
                                        <EachMemo
                                            memoId={item._id.$oid}
                                            content={item.content}
                                            token={token}
                                            EditMemo={EditMemo}
                                            DeleteMemo={DeleteMemo}
                                            status={item.complete_status}
                                            admit_status={item.admit_status} />
                                    </Container>
                                );
                            })}

                        </Stack>
                        :
                        <Row>
                            <Col>
                                <del> 아무것도 안하기 </del>
                            </Col>
                        </Row>}
                </Container>
                <Container fluid className="memoSubmit">
                    <Form onSubmit={Submit}>
                        <Row>
                            <Col xs={8}>
                                <Form.Control onChange={(event) => setWriteMemo(event.target.value)}
                                    value={writeMemo} type="text" name="memo" placeholder='' />
                            </Col>
                            <Col xs={4}>
                                <div className="d-grid gap-2">
                                    <Button variant="success" type='submit'> 메모 </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Container>
        </Container>
    );
};

export default Memo;