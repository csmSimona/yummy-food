export default function formatDate(dt) {
    if (!dt) {
        dt = new Date()
    } else {
        dt = new Date(dt);
    }
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var date = dt.getDate();
    var h = dt.getHours();
    var mm = dt.getMinutes();

    return year + '-' + isZero(month) + '-' + isZero(date) + ' ' + isZero(h) + ':' + isZero(mm);
}

function isZero(m) {
    return m < 10 ? '0' + m : m
}