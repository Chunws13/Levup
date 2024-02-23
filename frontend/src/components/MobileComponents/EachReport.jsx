import { Container, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import { ConvertDate } from "../utils/ConvertDate";

const EachReport = ({writer, title, content, reported_date}) => {
    const [contentCheck, setContentCheck] = useState(false);
    
    return (
        <Container style={{border: "solid gray", borderRadius: "5px"}}>
            <Row>
                <Col>  
                    {writer}
                </Col>
                <Col>
                    {ConvertDate(reported_date)}
                </Col>
            </Row>
            <Row>
                <Col>
                    {title}
                </Col>
            </Row>
            { contentCheck ? 
                <Row onClick={() => setContentCheck(!contentCheck)}>
                    <Col>
                        { content.split("\n").map((line, index) => {
                            
                            return(
                                <React.Fragment key={index}>
                                    {line}
                                    <br/>
                                </React.Fragment>
                                )
                        })}
                    </Col>

                    </Row>
                    :
                    <Row onClick={() => setContentCheck(!contentCheck)}>
                        <Col>
                            "내용 보기"
                        </Col> 
                    </Row>
                }
        </Container>
    );
}

export default EachReport;