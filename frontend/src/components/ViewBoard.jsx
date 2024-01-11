import { Container, Form, Row, Col, Button } from "react-bootstrap"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";

const ViewBoard = ({board_id, writer, title, content, like, reply, 
    create_datetime, now_date, token, PushLike}) => {
    const [commentState, setCommentState] = useState(false);
    const [allReply, setAllReply] = useState(reply);
    const navigate = useNavigate();
    const fulldatetime = new Date(create_datetime);
    const now_year = now_date.getFullYear();

    let year = fulldatetime.getFullYear();
    let month = fulldatetime.getMonth() + 1;
    let day = fulldatetime.getDate();

    let hour = fulldatetime.getHours();
    let minute = fulldatetime.getMinutes();
    
    const [text, setText] = useState("");

    const ChangeText = (event) => {
        setText(event.target.value)
    }
    
    const CreateComment = async(event) => {
        event.preventDefault();
        try{
            if (token !== undefined){
                await axios.post(`http://127.0.0.1:8000/api/boards/${board_id}/comment`,
                    { content: text },
                    { headers : {
                        "Authorization" : token,
                        "Content-Type": "application/json"
                        }});
                
                setText("");

                const response = await axios.get(`http://127.0.0.1:8000/api/boards/${board_id}/comment`,
                    { headers : {
                        "Authorization" : token,
                        "Content-Type": "application/json"
                        }});
                
                setAllReply(response.data);

            } else {
                navigate("/login");
            }

        } catch (error) {
            alert(error.response.data.detail);
        }
    }

    const GetDate = () =>{
        month = month < 10 ? `0${month}` : month
        day = day < 10 ? `0${day}` : day
        hour = hour < 10 ? `0${hour}` : hour
        minute = minute < 10 ? `0${minute}` : minute

        if (now_year === year){
            return `${month}-${day} ${hour}:${minute}`
        }
        return `${year}-${month}-${day} ${hour}:${minute}`
    }

    const Like = () => {
        PushLike({token, board_id});
    }
    
    const CommentView = () => {
        setCommentState(!commentState);
    }

    return (
        <Container style={{padding: "3vh"}}>
            <Row >
                <Col style={{display:"flex", justifyContent:"flex-start", fontSize : "3vw"}} >
                    {writer}
                </Col>
                <Col style={{display:"flex", justifyContent:"flex-end", fontSize : "3vw"}}>
                    {GetDate()}
                </Col>
            </Row>
            <Row style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                {title}
            </Row>
            <Row  className="justify-content-center">
                {content}
            </Row>
            <Row  className="justify-content-center">
                <Col style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                    <Button onClick={Like}>
                        좋아요 {like}
                    </Button>
                </Col>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                </Col>
                <Col style={{display:"flex", justifyContent:"center"}}>
                    <Button onClick={CommentView} style={{fontSize : "3vw"}}>
                        댓글 {reply.length}
                    </Button>
                </Col>
                { commentState ? 
                        allReply.map((item, index) => {
                            return (
                                <Comment key={index}
                                    writer = {item.writer}
                                    created_datetime = {item.created_datetime}
                                    content = {item.content}/>
                            )
                        })
                    : ""
                }
                { commentState ? 
                    <Form onSubmit={CreateComment}>
                        <Row>
                            <Col xs={9}>
                                <Form.Control value={text} onChange={ChangeText} type="text" name="memo" placeholder=''/>
                            </Col>
                            <Col xs={3}>
                                <div className="d-grid gap-2">
                                    <Button variant="success" type='submit' > 등록 </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                    : ""
                }       
            </Row>
        </Container>
    )
}

export default ViewBoard