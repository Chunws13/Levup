import axios from "axios";
import qs from "qs";

// 중첩된 query string을 serialize
axios.defaults.paramsSerializer = (params) => qs.stringify(params);

// axios에 baseURL, header, cors 설정 등 추가
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {},
    withCredentials: false,
});

// API 목록
export const API = {
};