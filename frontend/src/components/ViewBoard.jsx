import { Container, Form, Row, Col, Button, Image, Carousel } from "react-bootstrap"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";

const ViewBoard = ({board_id, writer, title, content, files, like, reply, 
    create_datetime, now_date, token, PushLike}) => {
    
    const [allReply, setAllReply] = useState(reply);
    const [commentState, setCommentState] = useState(false);
    const [index, setIndex] = useState(0);

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
     
    const CommentControl = (event) => {
        if (event.target.id === "reply"){
            setCommentState(!commentState);

        } else {
            setCommentState(false);
        }
    }
    
    const SelectFile = (selectedIndex) => {
        setIndex(selectedIndex);
    }

    return (
        <Container onClick={CommentControl} style={{padding: "3vh"}}>
            <Row>
                <Col className="justify-content-start" style={{padding: "3vw"}} >
                    <Image src=""/>    {writer}
                </Col>
                <Col style={{marginLeft: "auto", padding: "3vw", fontSize: "3vw"}}>
                    {GetDate()}
                </Col>
            </Row>
            <Row className="justify-content-start" style={{padding: "3vw", fontSize: "1.5vh"}}>
                {title}
            </Row>

            <Row >
                <Carousel activeIndex={index} onSelect={SelectFile} slide={false} fade >
                    { files.length > 0 ? files.map((file, index) => {
                        return ( 
                            <Carousel.Item data-bs-theme="dark" key={index} style={{display:"flex", justifyContent:"center", fontSize : "3vw", height: "35vh"}}>
                                <Image thumbnail src = {`http://127.0.0.1:8000/${file.file_name}`} alt = ""/>
                            </Carousel.Item>
                            )
                        }) : 
                            ""
                            }
                </Carousel>
            </Row>

            <Row className="justify-content-start" style={{padding: "3vw", fontSize: "1.5vh"}}>
                {content}
            </Row>

            <Row  className="justify-content-center">
                <Col style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                    <Button onClick={Like} size="sm">
                        좋아요 {like}
                    </Button>
                </Col>
                <Col style={{display:"flex", justifyContent:"center", fontSize : "3vw"}}>
                </Col>
                <Col style={{display:"flex", justifyContent:"center"}}>
                    <Button id="reply" size="sm" style={{fontSize : "3vw"}}>
                        댓글 {reply.length}
                    </Button>
                </Col>
                    { commentState &&(
                        <Container style={{ position:"fixed", borderTopLeftRadius: "10px", borderTopRightRadius: "10px",
                            bottom: 0, left: 0, width: "100vw", height: "50vh",
                            zIndex: 1000, backgroundColor: "black"}}>
                            <Container style={{height: "43vh", overflow: "auto"}}>
                                    { allReply.map((item, index) => {
                                        return (
                                            <Comment key={index}
                                            writer = {item.writer}
                                            created_datetime = {item.created_datetime}
                                            content = {item.content}
                                            now_date = {now_date}
                                            />
                                            )
                                        })}
                            </Container>
                            <Form onSubmit={CreateComment}>
                                <Row>
                                    <Col xs={9} className="d-flex align-items-center">
                                        <Form.Control style={{height: "3vh"}} 
                                            value={text} onChange={ChangeText}
                                            type="text" name="memo" placeholder=''/>
                                    </Col>
                                    <Col xs={3}>
                                        <div className="d-grid gap-2">
                                            <Button variant="success" type='submit' size="sm"> 등록 </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Container>
                    )}
            </Row>
        </Container>
    )
}

export default ViewBoard