import axios from 'axios';
import { useState, useEffect } from 'react'
import { Cookies } from "react-cookie";
import { useNavigate  } from 'react-router-dom';
import { Form, Button, Container, Stack, Row, Col, Badge } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import EachMemo from "./EachMemo"
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css'; // css import
import { findAllInRenderedTree } from 'react-dom/test-utils';

function Memo() {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const [memo, setMemo] = useState([]);
    const [monthMemo, setMonthMemo] = useState([]);

    const [date, setDate] = useState(new Date());
    const [writeMemo, setWriteMemo] = useState("");
    const navigate = useNavigate();

    const DotGreen = () => {
        return (
            <div>
                <Badge bg="success" pill style={{fontSize: "1vw"}}>&nbsp;</Badge>
            </div>)
        }

    const DotOragne = () => {
        return (
            <div>
                <Badge bg="orange" pill style={{fontSize: "1vw", backgroundColor: "orange"}}>&nbsp;</Badge>
            </div>)
        }

    const DotRed = () => {
        return (
            <div>
                <Badge bg="danger" pill style={{fontSize: "1vw"}}>&nbsp;</Badge>
            </div>)
        }

    const Writing = (event) => {
        setWriteMemo(event.target.value);
    }

    const SelectDate = (event) => {
        setDate(event);
        Get_memo({year : event.getFullYear(), month: event.getMonth()+ 1, day: event.getDate()});
        
    }

    const SubmitMemo = async(event) => {
        event.preventDefault();
        
        try { await axios.post("http://127.0.0.1:8000/api/memo/", 
                {   
                    year: date.getFullYear(),
                    month: date.getMonth()+ 1,
                    day: date.getDate(),
                    content : writeMemo 
                },
                { headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    }});
                setWriteMemo("");

                Get_memo({year: date.getFullYear(), month: date.getMonth()+ 1, day: date.getDate()});
                GetMonthMemo({year: date.getFullYear(), month: date.getMonth()+ 1});
            } 

        catch {
            alert("")
        }
    };

    const EditMemo = async({memoId, content, token}) => {
        try { await axios.put(`http://127.0.0.1:8000/api/memo/${memoId}`,
                { content },
                { headers : {
                "Authorization" : token,
                "Content-Type": "application/json"
                }});
                
                Get_memo({year: date.getFullYear(), month: date.getMonth()+ 1, day: date.getDate()});

        } catch {
            alert("에러가 발생했습니다");
        }}
    
    const DeleteMemo = async({memoId, token}) =>{
        try { await axios.delete(`http://127.0.0.1:8000/api/memo/${memoId}`,
                { headers : {
                "Authorization" : token,
                "Content-Type": "application/json"
                }});

                Get_memo({year: date.getFullYear(), month: date.getMonth()+ 1, day: date.getDate()});
                GetMonthMemo({year: date.getFullYear(), month: date.getMonth()+ 1});
                
        } catch {
            alert("에러가 발생했습니다.");
        }}

    
    const Get_memo = async({year, month, day}) => {
        try {  
            if (token !== null) {
                const response = await axios.get(`http://127.0.0.1:8000/api/memo/?year=${year}&month=${month}&day=${day}`, 
                    { headers : {"Authorization" : token }});
                setMemo(response.data.data);
            };
        } catch {
            
            navigate("login");   
        }
    }

    const GetMonthMemo = async({year, month}) => {
        try {  
            if (token !== null) {
                const response = await axios.get(`http://127.0.0.1:8000/api/memo/calendar?year=${year}&month=${month}`, 
                    { headers : {"Authorization" : token }});
                setMonthMemo(response.data.data);
            };
        } catch {
            
            navigate("login");   
        }
    }

    useEffect(() => { 
        const init_year = date.getFullYear();
        const init_month = date.getMonth() + 1;
        const init_day = date.getDate();
        
        Get_memo({ year: init_year, month: init_month, day: init_day});
        GetMonthMemo({year: init_year, month: init_month});
    }, []);

    return (
        <Container fluid > 
            <Container fluid style={{ padding: "3vh", fontSize: "4.5vw"}}>
                    <Calendar onChange={SelectDate} value={date}
                        formatDay={(locale, date) => moment(date).format("DD")}
                        tileContent = { ( { date, view } ) => {
                            if (view = "month "){
                                const day = date.getDate();

                                const check = monthMemo.filter((item) => {
                                    const item_day = new Date(item.created_date.$date)
                                    return item_day.getDate() === day
                                });

                                const totalMemo = check.length;
                                let [finish, notFinish] = [0, 0];
                                
                                for (let eachMemo of check) {
                                    if (eachMemo.complete_status){
                                        finish += 1;

                                    } else {
                                        notFinish += 1;
                                    }
                                }
                                
                                if (check.length > 0 && totalMemo === finish) {
                                    return (
                                        <DotGreen/>
                                    );
                                } else if (check.length > 0 && totalMemo === notFinish){
                                    return ( 
                                        <DotRed />
                                        )
                                    } else if (check.length > 0 && totalMemo !== finish){
                                    return (
                                        <DotOragne />
                                    )
                                } else {
                                    return (
                                        <div style={{fontSize: "1vw"}}>&nbsp;</div>
                                    )
                                }
                            }}}
                        />
            </Container>
            <Row >
                <Col style={{display: "flex", justifyContent: "center", fontSize: "5vw" }}>
                    { `${moment(date).format("YY년 MM월 DD일")} - 할일`  }
                </Col>
            </Row>
            <Container fluid style={{height : "23vh", padding: "3vh", overflow: 'auto'}}>
            { memo.length > 0 ? 
                <Stack gap={1}>
                    {memo.map((item, index) => {    
                        return (
                            <Container fluid key={index} className='eachMemo' >
                                <EachMemo
                                    memoId={item._id.$oid}
                                    content={item.content}
                                    token={token}
                                    EditMemo={EditMemo}
                                    DeleteMemo={DeleteMemo}
                                    status={item.complete_status}
                                    admit_status = {item.admit_status}
                                />
                            </Container>
                            )
                    })}

                </Stack>
                : 
                <Row>
                    <Col style={{display: "flex", justifyContent: "center"}}>
                        <del> 아무것도 안하기 </del> 
                    </Col>
                </Row>
                }
        </Container>
            <Container fluid style={{ justifyContent: 'center', Height: '10vh' }}>
                <Form onSubmit={SubmitMemo}>
                    <Row>
                        <Col xs={8}>
                            <Form.Control onChange={Writing} value={writeMemo} type="text" name="memo" placeholder=''/>
                        </Col>
                        <Col>
                            <div className="d-grid gap-2">
                                <Button variant="success" type='submit'> 메모 </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Container>
    )
}

export default Memo;