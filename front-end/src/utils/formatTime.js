export default function formatTime(dt) {
    if (!dt) {
        dt = new Date()
    } else {
        dt = new Date(dt);
    }
    var month = dt.getMonth() + 1;
    var date = dt.getDate();
    var h = dt.getHours();
    var mm = dt.getMinutes();
    return month + '-' + date + ' ' + isZero(h) + ':' + isZero(mm);
}

function isZero(m) {
    return m < 10 ? '0' + m : m
}