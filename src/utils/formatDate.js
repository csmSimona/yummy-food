export default function formatDate(dt) {
    if (!dt) {
        dt = new Date()
    } else {
        dt = new Date(dt);
    }
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var date = dt.getDate();
    if (month < 10) {
        month = '0' + month;  // 强制类型转换
    }
    if (date < 10) {
        date = '0' + date; // 强制类型转换
    }
    return year + '-' + month + '-' + date;
}