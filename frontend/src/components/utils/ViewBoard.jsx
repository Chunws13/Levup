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
        <Container className="eachBoard">
            <Row>
                <Col xs={2} >
                    { writerProfile ?
                        <Image src={`https://levupbucket.s3.ap-northeast-2.amazonaws.com/users/${writerProfile}`} rounded style={{width: "100%", height: "auto"}} /> 
                        : <Image src={Profile}/> 
                    }
                </Col>
                <Col className="writerNDate">
                    <Row className="justify-content-start">
                        {writer}
                    </Row>
                    <Row className="justify-content-start">
                        { ConvertDate(create_datetime) }
                    </Row>
                </Col>
            </Row>

            <Row className="images">
                <Carousel activeIndex={index} onSelect={(selectedIndex) => setIndex(selectedIndex)} slide={false} fade>
                    { files.length > 0 ? 
                        files.map((file, index) => {
                            return ( 
                                    <Carousel.Item key={index}>
                                        <Image thumbnail src = {`https://levupbucket.s3.ap-northeast-2.amazonaws.com/boards/${file.file_name}`} 
                                            alt={`slide ${index}`}/>
                                    </Carousel.Item>
                                )
                            }) : ""
                    }
                </Carousel>
            </Row>
            <Row className="titleNContent">
                <Row className="justify-content-start">
                    {title}
                </Row>
                <Row onClick={()=> setContentState(!contentState)} className="justify-content-start">
                    { contentState ? 
                        <Row className="justify-content-start" onClick={()=> setContentState(!contentState)}>
                            {content}
                        </Row>
                        :    
                        <Row className="justify-content-start" onClick={()=>setContentState(!contentState)}>
                            더보기
                        </Row>
                    }
                </Row>
            </Row>
            
        
            <Row className="likeNReply">
                
                <Col xs={2} onClick={Like}>
                    <Col>
                    { likeState ? 
                        <Image src={LikeImage} id="like"/>
                        : <Image src={LikeImage} id="like"/>
                    }
                    </Col>
                    <Col>
                        {like}
                    </Col>
                </Col>
                
                <Col xs={2} onClick={() => setCommentState(!commentState)}>
                    <Col>
                        <Image src={CommentImage} id="reply" size="sm"/>
                    </Col>
                    <Col>
                        {allReply.length}
                    </Col>
                </Col>
                    { commentState &&(
                        <Container className="commentBox" >
                            <Container onClick={() => setCommentState(!commentState)} style={{height: "50%"}}>
                            </Container>

                            <Container className="commentList" >

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