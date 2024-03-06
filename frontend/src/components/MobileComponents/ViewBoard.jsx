import { Container, Form, Row, Col, Button, Image, Carousel } from "react-bootstrap"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConvertDate } from "../utils/ConvertDate";
import { API } from "../../API";
import Comment from "./Comment";
import LikeImage from '../../images/likeIcon.png'
import CommentImage from '../../images/commentIcon.png'
import Profile from '../../images/basicProfile.jpeg'

const ViewBoard = ({board_id, writer, title, content, files, like, likeList, reply, 
    create_datetime, token, viewer, PushLike}) => {
    
    const [allReply, setAllReply] = useState(reply);
    const [likeState, setLikeState] = useState(false);
    const [contentState, setContentState] = useState(false);
    const [commentState, setCommentState] = useState(false);
    const [writerProfile, setWriterProfile] = useState(false);
    const [submitState, setSubmitState] = useState(true);

    const [index, setIndex] = useState(0);

    const navigate = useNavigate();
    const [text, setText] = useState("");

    const ChangeText = (event) => {
        setText(event.target.value);
        
        if(event.target.value){
            setSubmitState(false);

        } else {
            setSubmitState(true);
        }
    };
    
    const CreateComment = async(event) => {
        event.preventDefault();
        try{
            const body = {content: text}
            const headers = {
                "Authorization" : token,
                "Content-Type": "application/json"
            };

            await API.postComment(board_id, body, headers);
            setText("");

            const response = await API.getCommentList(board_id, headers);
            setAllReply(response.data);

        } catch (error) {
            alert(error.response.data.detail);
            navigate("/login")
        }
    }

    const Like = () => {
        setLikeState(!likeState);
        PushLike({token, board_id});
    }

    const GetUserProfile = async() => {
        try{
            const response = await API.getWriterProfile(writer)
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
            <Row>
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
                        { ConvertDate(create_datetime) }
                    </Row>
                </Col>
            </Row>

            <Row>
                <Carousel activeIndex={index} onSelect={(selectedIndex) => setIndex(selectedIndex)} slide={false} fade>
                    { files.length > 0 ? 
                        files.map((file, index) => {
                            return ( 
                                    <Carousel.Item data-bs-theme="dark" key={index} style={{display:"flex", justifyContent:"center", fontSize : "3vw", height: '60vh'}}>

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
                    <Row className="justify-content-start" onClick={()=> setContentState(!contentState)} 
                        style={{paddingLeft: "3vw", fontSize: "5vw"}}>
                        {content}
                    </Row>
                    :    
                    <Row className="justify-content-start" onClick={()=>setContentState(!contentState)} 
                        style={{paddingLeft: "3vw", fontSize: "5vw"}}>
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
                
                <Col xs={2} onClick={() => setCommentState(!commentState)} style={{display:"flex", justifyContent:"center"}}>
                    <Col>
                        <Image src={CommentImage} id="reply" size="sm" style={{width: "70%", height: "100%"}}/>
                    </Col>
                        {allReply.length}
                </Col>
                    { commentState &&(
                        <Container style={{ position:"fixed",
                            bottom: 0, left: 0, width: "100vw", height: "100vh", padding: 0,
                            zIndex: 1000}}>
                            <Container onClick={() => setCommentState(!commentState)} style={{height: "50%"}}>
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
                                                />
                                                )
                                            })}
                                </Container>
                                <Form onSubmit={CreateComment} style={{padding: '1vh'}}>
                                    <Row>
                                        <Col xs={9} className="d-flex align-items-center">
                                            <Form.Control style={{height: "4.5vh"}} 
                                                value={text} onChange={ChangeText}
                                                type="text" name="memo" placeholder=''/>
                                        </Col>
                                        <Col xs={3}>
                                            <div className="d-grid gap-2">
                                                <Button variant="success" type='submit' disabled={submitState}> 등록 </Button>
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