import { API } from '../../API';
import { Cookies } from 'react-cookie';
import { Badge, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Memo from './Memo';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css'; // css import

const CalendarView = () => {

    const cookie = new Cookies();
    const token = cookie.get("token");
    const [date, setDate] = useState(new Date());
    const [memo, setMemo] = useState([]);
    const [monthMemo, setMonthMemo] = useState([]);

    const DotGreen = () => {
        return (
            <div>
                <Badge bg="success" pill>&nbsp;</Badge>
            </div>)
        }

    const DotOragne = () => {
        return (
            <div>
                <Badge bg="orange" pill>&nbsp;</Badge>
            </div>)
        }

    const DotRed = () => {
        return (
            <div>
                <Badge bg="danger" pill>&nbsp;</Badge>
            </div>)
        }

    const SelectDate = (event) => {
        setDate(event);
    }

    const ChangeMonth = (newActiveStartDate) => {
        const previewDate = newActiveStartDate.activeStartDate;
        GetMonthMemo({year: previewDate.getFullYear(), month: previewDate.getMonth() + 1});
    }

    const Get_memo = async({year, month, day}) => {
        try{
            const headers = {"Authorization" : token };
            const response = await API.getMemo(year, month, day, headers);
            setMemo(response.data.data);

        } catch {
            window.location.href("/");
        }
    }

    const GetMonthMemo = async({year, month}) => {
        try {  
            const headers = {"Authorization" : token };
            const response = await API.getMonthMemo(year, month, headers);
            setMonthMemo(response.data.data);
            
        } catch {
            window.location.href("/");
        }
    }

    useEffect(() => {
        const init_year = date.getFullYear();
        const init_month = date.getMonth() + 1;
        const init_day = date.getDate();
        
        Get_memo({ year: init_year, month: init_month, day: init_day});
        GetMonthMemo({year: init_year, month: init_month});
    }, [date]);
    
    return (
        <Container fluid className="calendar">
            <Calendar onChange={SelectDate} onActiveStartDateChange={ChangeMonth} value={date}
                        formatDay={( local, date ) => moment(date).format("DD")}
                        tileContent = { ( { date, view } ) => {
                            if (view === "month"){
                                const day = date.getDate();
                                const check = monthMemo.filter((item) => {
                                    const item_day = new Date(item.created_date.$date);
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
            <Memo token={token} date={date} memoList={memo}/>
        </Container>
    );
};

export default CalendarView;