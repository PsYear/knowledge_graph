//输出结果格式处理
var handleReturn = function (res, next, status, message, data) {
    //res.charSet('utf8');

    if (data == null) { data = ''; }
    var responseData = { 'status': status, 'message': message, 'data': data };
    if (!res.finished) {
        res.render('index', {resdata: JSON.stringify(responseData) });
    }
    return next();
};





module.exports = {
    handleReturn: handleReturn
}