import { useState, useEffect } from "react";
import { Container, Row, Pagination } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ViewBoard from "./ViewBoard";

const Board = () => {
    const [board, setBoard] = useState([]);
    const now_date = new Date();
    const cookie = new Cookies();
    const token = cookie.get("token");

    const [selectPage, setSelectPage] = useState(1);
    const [allPages, setAllpages] = useState(0);
    const [viewer, setViewer] = useState(null);
    const navigate = useNavigate();

    let pageList = [];

    const PageChange = (page) => {
        setSelectPage(page);
        
    };

    for (let number = Math.max(1, selectPage - 2); number <= Math.min(allPages, selectPage + 2); number ++){
        pageList.push(
            <Pagination.Item key = {number} active= {number === selectPage} onClick={() => PageChange(number)}>
                {number}
            </Pagination.Item>
        )
    };


    const GetBoardCount = async() => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/boards/`);
            setAllpages(Math.ceil(response.data / 10));
            
        } catch {
            alert("서버 에러");
        }
    }

    const GetBoard = async() => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/boards/page?skip=${(selectPage - 1)*10}&limit=10`);
            setBoard(response.data);
            
        } catch {
            alert("서버 에러");
        }
    }
    
    const PushLike = async({ token, board_id }) => {
        try{
            await axios.get(`http://127.0.0.1:8000/api/boards/${board_id}/like`,
                {headers : {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    }});
            GetBoard();

        } catch (error) {
            alert(error.response.data.detail);
            navigate("/login");
        };
    };

    const GetViewer = async() => {
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/users/`,
                                    {headers : {
                                        "Authorization" : token,
                                        "Content-Type": "application/json"
                                        }});
            
            setViewer(response.data.data.id);

            } catch(error) {
                alert(error.response.data.detail);
            }
    };
   
    useEffect(() => {
        GetBoardCount();
        GetBoard();
        if (token !== undefined){
            GetViewer();
        }

    }, [selectPage]);

    return (
        <Container>
            { board.map((item, index) => {
                return (
                    <Row key={index}>
                        <ViewBoard
                            board_id = {item.id}
                            writer={item.writer}
                            title={item.title}
                            content={item.content}
                            files = {item.files}
                            like = {item.like}
                            likeList = {item.like_people}
                            reply = {item.comment}
                            create_datetime={item.created_datetime}
                            now_date = {now_date}
                            token = {token}
                            viewer = {viewer}
                            PushLike = {PushLike}
                        />
                    </Row>
                )
            })}
            <Pagination style={{display: "flex", justifyContent: "center"}}>
                <Pagination.First onClick={() => PageChange(1)}/>
                <Pagination.Prev onClick={() => {PageChange(Math.max(1, selectPage - 1))}}/>
                    {pageList}
                <Pagination.Next onClick={() => {PageChange(Math.max(allPages, selectPage - 1))}}/>
                <Pagination.Last onClick={() => PageChange(allPages)}/> 
            </Pagination>
        </Container>
    )
}

export default Board;