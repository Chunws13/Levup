import { Container, Form, Stack, Row, Col, Button } from "react-bootstrap";
import { API } from "../../API";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EachMemo from "./EachMemo";

const Memo = ({ token, date, memoList }) => {
    const [memo, setMemo] = useState('');
    const [writeMemo, setWriteMemo] = useState("");
    const navigate = useNavigate();

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
            await API.submitMomo(body, headers);
            setWriteMemo("");
            Get_memo({year: date.getFullYear(), month: date.getMonth()+ 1, day: date.getDate()});
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

                await API.editMemo(memoId, body, headers);
                Get_memo({year: date.getFullYear(), month: date.getMonth()+ 1, day: date.getDate()});

        } catch {
            alert("에러가 발생했습니다");
        }}
    
    const DeleteMemo = async({memoId, token}) =>{
        try { 
                const headers = {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    };

                await API.deleteMemo(memoId, headers);
                Get_memo({year: date.getFullYear(), month: date.getMonth()+ 1, day: date.getDate()});
                
        } catch {
            alert("에러가 발생했습니다.");
        }}

    const Get_memo = async({year, month, day}) => {
        try{
            const headers = {"Authorization" : token };
            const response = await API.getMemo(year, month, day, headers);
            setMemo(response.data.data);

        } catch {  
            navigate("login");   
        }
    };
        
    return (
        <Container fluid className="memoArea">
            <Container fluid className="memoSection">
                <Container fluid className="memoList">
                    {memoList.length > 0 ?
                        <Stack gap={1}>
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
                <Container className="memoSubmit">
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