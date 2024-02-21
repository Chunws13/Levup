export const ConvertDate = (datetime) => {
    const converTime = new Date(datetime);

    const now = new Date();
    const now_year = now.getFullYear();

    let year = converTime.getFullYear();
    let month = converTime.getMonth() + 1;
    let day = converTime.getDate();

    let hour = converTime.getHours();
    let minute = converTime.getMinutes();

    month = month < 10 ? `0${month}` : month
    day = day < 10 ? `0${day}` : day
    hour = hour < 10 ? `0${hour}` : hour
    minute = minute < 10 ? `0${minute}` : minute

    if (now_year === year){
        return `${month}-${day} ${hour}:${minute}`
    }

    return `${year}-${month}-${day} ${hour}:${minute}`
}
