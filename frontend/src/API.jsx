import axios from "axios";
import qs from "qs";

// 중첩된 query string을 serialize
// axios.defaults.paramsSerializer = (params) => qs.stringify(params);
// console.log("baseURL : ", process.env.REACT_APP_API_URL)
// axios에 baseURL, header, cors 설정 등 추가
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {},
    withCredentials: false,
});

// API 목록
export const API = {
    // Boards
    getBoardCount: () => api.get(`/boards/`),
    getBoard: (selectPage) => api.get(`/boards/page?skip=${(selectPage -1) * 10}&limit=10`),
    pushLike: (board_id, headers) => api.get(`/boards/${board_id}/like`, { headers }),
    getViewer: (headers) => api.get(`/users/`, { headers }),
    createBoard: (memoId, formData, headers) => api.post(`/boards/auth/${memoId}`, formData, { headers }),
    getWriterProfile: (writer) => api.get(`/users/profile?user_name=${writer}`),
    
    // Commenter
    getCommenter: (writer) => api.get(`/users/profile?user_name=${writer}`),
    getCommentList: (board_id, headers) => api.get(`/boards/${board_id}/comment`, { headers }),
    postComment: (board_id, body, headers) => api.post(`/boards/${board_id}/comment`, body, { headers }),

    // Memos
    getMemo: (year, month, day, headers) => api.get(`/memo/?year=${year}&month=${month}&day=${day}`, { headers }),
    getMonthMemo: (year, month, headers) => api.get(`/memo/calendar?year=${year}&month=${month}`, { headers }),
    submitMomo: (body, headers) => api.post(`/memo/`, body, { headers }),
    editMemo: (memoId, body, headers) => api.put(`/memo/${memoId}`, body, { headers }),
    deleteMemo: (memoId, headers) => api.delete(`/memo/${memoId}`, { headers }),

    // Users
    getUser: (headers) => api.get(`/users/`, { headers }),
    selectProfile: (formData, headers) => api.post(`/users/profile`, formData, { headers }),
    deleteProfile: (headers) => api.delete(`/users/profile`, { headers }),
    userLogin: (body) => api.post(`users/login`, body),
    userSignUp: (body) => api.post(`/users/signup`, body),

    // Report
    getReport: (headers) => api.get(`/reports/`, { headers }),
    postReport: (body, headers) => api.post(`/reports/`, body, { headers })
};