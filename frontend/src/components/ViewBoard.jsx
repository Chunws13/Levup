import { Container, Form, Row, Col, Button, Image, Carousel } from "react-bootstrap"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import LikeImage from '../images/likeIcon.png'
import CommentImage from '../images/commentIcon.png'
import Profile from '../images/basicProfile.jpeg'

const ViewBoard = ({board_id, writer, title, content, files, like, likeList, reply, 
    create_datetime, now_date, token, viewer, PushLike}) => {
    
    const [allReply, setAllReply] = useState(reply);
    const [likeState, setLikeState] = useState(false);
    const [contentState, setContentState] = useState(false);
    const [commentState, setCommentState] = useState(false);
    const [writerProfile, setWriterProfile] = useState(false);

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
        setLikeState(!likeState);
        PushLike({token, board_id});
    }
     
    const CommentControl = (event) => {
        setCommentState(!commentState);
    }
    
    const SelectFile = (selectedIndex) => {
        setIndex(selectedIndex);
    }

    const ContentView = () => {
        setContentState(!contentState);
    }

    const GetUserProfile = async() => {
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/users/profile?user_name=${writer}`,
                                    {
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    });

            setWriterProfile(response.data.data);

        } catch(error) {
            alert(error.response.data.detail);
        }
    }

    useEffect(() => {
        GetUserProfile();

        for (let i = 0; i < likeList.length; i ++){
            if (likeList[i]["people"] === viewer) {
                setLikeState(true);
            }
        };
        
    }, [])
    
    return (
        <Container style={{padding: "3vh"}}>
            <Row >
                <Col xs={2} style={{display: "flex", alignItems: "center", justifyContent: "center"}} >
                    { writerProfile ?
                        <Image src={`https://levupbucket.s3.ap-northeast-2.amazonaws.com/users/${writerProfile}`} rounded style={{width: "100%", height: "auto"}} /> 
                        : <Image src={Profile} rounded style={{width: "100%", height: "auto"}} /> 
                    }
                </Col>
                <Col style={{fontSize: "5vw"}}>
                    <Row>
                        {writer}
                    </Row>
                    <Row>
                        { GetDate() }
                    </Row>
                </Col>
            </Row>
            

            <Row >
                <Carousel activeIndex={index} onSelect={SelectFile} slide={false} fade >
                    { files.length > 0 ? 
                        files.map((file, index) => {
                            return ( 
                                    <Carousel.Item data-bs-theme="dark" key={index} style={{display:"flex", justifyContent:"center", fontSize : "3vw", height: "35vh"}}>

                                        <Image thumbnail src = {`https://levupbucket.s3.ap-northeast-2.amazonaws.com/boards/${file.file_name}`} 
                                            alt={`slide ${index}`} style={{width: "100%", height: "auto"}}/>

                                    </Carousel.Item>
                                )
                            }) : ""
                    }
                </Carousel>
            </Row>
            <Row className="justify-content-start" style={{padding: "3vw", fontSize: "5vw"}}>
                <Row>
                    {title}
                </Row>
                { contentState ? 
                    <Row className="justify-content-start" onClick={ContentView} style={{paddingLeft: "3vw", fontSize: "5vw"}}>
                        {content}
                    </Row>
                    :    
                    <Row className="justify-content-start" onClick={ContentView} style={{paddingLeft: "3vw", fontSize: "5vw"}}>
                        더보기
                    </Row>
                }
            </Row>
            
        
            <Row className="justify-content-center">
                <Col xs={8}>

                </Col>
                <Col xs={2} onClick={Like} style={{display:"flex", justifyContent:"center"}}>
                    <Col>
                    { likeState ? 
                        <Image src={LikeImage}  style={{width: "80%", height: "100%", backgroundColor: "red"}}/>
                        
                        : <Image src={LikeImage}  style={{width: "80%", height: "100%"}}/>
                    }
                    </Col>
                        {like}
                </Col>
                
                <Col xs={2} onClick={CommentControl} style={{display:"flex", justifyContent:"center"}}>
                    <Col>
                        <Image src={CommentImage} id="reply" size="sm" style={{width: "70%", height: "100%"}}/>
                    </Col>
                        {allReply.length}
                </Col>
                    { commentState &&(
                        <Container onClick={CommentControl} style={{ position:"fixed",
                            bottom: 0, left: 0, width: "100vw", height: "100vh", padding: 0,
                            zIndex: 1000}}>
                            <Container style={{height: "50%"}}>
                            </Container>

                            <Container style={{height: "50%", backgroundColor: "black",
                                            borderTopLeftRadius: "10px", borderTopRightRadius: "10px"}}>

                                <Container style ={{height: "85%", overflow: "auto" }}>
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
                        </Container>
                    )}
            </Row>
        </Container>
    )
}

export default ViewBoard