
var msg_s_200 = "查询成功";
var msg_s_201 = "查询无结果";

var msg_e_207 = "查询错误，请联系技术支持人员"; 
var msg_e_208 = "参数有误，请检查参数";
var msg_e_209 = "接口异常， 请联系技术支持人员";


exports.getMessage = function (key) {
    return eval(key);
}