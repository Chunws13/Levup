import { Form, Button, Container, Stack } from 'react-bootstrap'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { API } from '../../API';
import EachReport from './EachReport';

const Report = () => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    const navigate = useNavigate();

    const [reportTitle, setReportTitle] = useState("");
    const [reportContent, setReportContent] = useState("");
    const [reportData, setReportData] = useState([]);

    const SubmitReport = async(event) => {
        event.preventDefault();
        const body = { 
            title : reportTitle,
            content: reportContent 
        };

        try {
            const headers = {
                Authorization : token,
                "Content-Type": "application/json"
            };

            const response = await API.postReport(body, headers);
            setReportData([response.data.data, ...reportData]);
            setReportTitle("");
            setReportContent("");
            
        } catch (error){
            alert(error.response.data.detail);
        }
    }

    const GetReports = async() => {
        try{
            const headers = {
                Authorization : token,
                "Content-Type": "application/json"
            };

            const response = await API.getReport(headers);
            setReportData(response.data.data);
    
        } catch(error){
            navigate("/login")
        }
    }
    
    GetReports();

    return (
        <Container fluid style={{padding: "3vw", height: "75vh"}}>
            <Container style={{height: "55%", overflow:"auto"}}>
            
                <Stack gap={3}>
                    {reportData.map((item, index) => {
                        return (
                            <EachReport
                                key={index}
                                writer={item.writer}
                                title= {item.title}
                                content={item.content}
                                reported_date={item.reported_date.$date}
                            />
                            )})}
                </Stack>
            </Container>

            <Container style={{height: "25%"}}>
                <Form onSubmit={SubmitReport} style={{padding: '2vh'}}>
                    <Form.Group>
                            <Form.Label> 버그 / 오류 제보 </Form.Label>
                            <Form.Control type="text"
                                value={reportTitle} onChange={(event) => setReportTitle(event.target.value)}/> 
                    </Form.Group>
                    <Form.Group>
                        <Form.Label> 상세 내용 </Form.Label>
                        <Form.Control as="textarea" rows={6} 
                            value={reportContent} onChange={(event) => setReportContent(event.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Button type='submit' style={{width: "100%", marginTop: "3vw"}}> 제보하기 </Button>
                    </Form.Group>
                </Form>
            </Container>

        </Container>
    );
}

export default Report;