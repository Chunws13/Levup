import { useState, useEffect } from "react";
import { Container, Row, Pagination } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { API } from "../../API";
import ViewBoard from "./ViewBoard";
// import "./css/Board.css"

const Board = () => {
    const [board, setBoard] = useState([]);
    const cookie = new Cookies();
    const token = cookie.get("token");

    const [selectPage, setSelectPage] = useState(1);
    const [allPages, setAllpages] = useState(0);
    const [viewer, setViewer] = useState(null);
    const navigate = useNavigate();

    let pageList = [];

    for (let number = Math.max(1, selectPage - 2); number <= Math.min(allPages, selectPage + 2); number ++){
        pageList.push(
            <Pagination.Item key={number} active={number === selectPage} onClick={()=> setSelectPage(number)}>
                {number}
            </Pagination.Item>
        )
    };

    const GetBoardCount = async() => {
        try {
            const response = await API.getBoardCount();
            setAllpages(Math.ceil(response.data / 10));
            
        } catch {
            alert("서버 에러");
        }
    }

    const GetBoard = async() => {
        try {
            const response = await API.getBoard(selectPage);
            setBoard(response.data);
            
        } catch {
            alert("서버 에러");
        }
    }
    
    const PushLike = async({ token, board_id }) => {
        try{
            const headers = {
                "Authorization" : token,
                "Content-Type": "application/json"
            };

            await API.pushLike(board_id, headers);
            GetBoard();

        } catch (error) {
            alert(error.response.data.detail);
            navigate("/login");
        };
    };

    const GetViewer = async() => {
        try{
            if (token !== undefined){
                const headers = {
                    "Authorization" : token,
                    "Content-Type": "application/json"
                    }
                
                const response = await API.getViewer(headers);
                setViewer(response.data.data.id);
            };

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
        <Container className="boardContainer">
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
                            token = {token}
                            viewer = {viewer}
                            PushLike = {PushLike}
                        />
                    </Row>
                )
            })}
            
            <Pagination className="pageNav">
                <Pagination.First onClick={() => setSelectPage(1)}/>
                <Pagination.Prev onClick={() => {setSelectPage(Math.max(1, selectPage - 1))}}/>
                    {pageList}
                <Pagination.Next onClick={() => {setSelectPage(Math.max(allPages, selectPage - 1))}}/>
                <Pagination.Last onClick={() => setSelectPage(allPages)}/> 
            </Pagination>
            
        </Container>
    )
}

export default Board;