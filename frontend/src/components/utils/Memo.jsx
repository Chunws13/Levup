import { Container, Form, Stack, Row, Col, Button } from "react-bootstrap";
import { API } from "../../API";
import { useState } from "react";
import EachMemo from "./EachMemo";

const Memo = ({ token, date, memoList, setMemoList }) => {
    const [writeMemo, setWriteMemo] = useState("");

    const SubmitMemo = async(event) => {
        event.preventDefault();
        
        const body = {   
            year: date.getFullYear(),
            month: date.getMonth()+ 1,
            day: date.getDate(),
            content : writeMemo 
        };

        const headers =  {
            "Authorization" : token,
            "Content-Type": "application/json" 
        };

        try { 
            const response = await API.submitMomo(body, headers);
            setMemoList([...memoList, response.data.data]);
            setWriteMemo("");
            } 

        catch {
            alert("")
        }
    };
    const EditMemo = async({memoId, content, token}) => {
        try { 
                const body = { content: content};
                const headers = {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    };

                const response = await API.editMemo(memoId, body, headers);
                const newMemoList =  memoList.map(memo => {
                    if (memo._id.$oid == response.data.data._id.$oid) {
                        return {...memo, content: response.data.data.content};
                    };
                    return memo;
                })

                setMemoList(newMemoList);

        } catch {
            alert("에러가 발생했습니다");
        }}
    
    const DeleteMemo = async({memoId, token}) =>{
        try { 
                const headers = {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    };

                const response = await API.deleteMemo(memoId, headers);
                const newMemoList =  memoList.map(memo => {
                    if (memo._id.$oid == response.data.data._id.$oid) {
                        return {...memo, complete_status: response.data.data.complete_status};
                    };
                    return memo;
                });
                setMemoList(newMemoList);

        } catch {
            alert("에러가 발생했습니다.");
        }}
        
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
                    <Form onSubmit={SubmitMemo}>
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