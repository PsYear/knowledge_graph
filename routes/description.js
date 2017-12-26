//
'use strict';


var _ = require("lodash");
var Utility = require('../infrastructure/utility');
var Core = require('../infrastructure/core');
var Message = require('../infrastructure/message');


const prefix = "http://dbpedia.org/ontology/";

//
var getDescriptionData = function (req, res, next) {
    var keyword = req.params.keyword ? req.params.keyword.trim() : "";
    keyword = req.body.nameid;
    var returnItem = { keyword: "", POList: [], PSList: [] };
    if (keyword) {
        try {
            keyword = Core.formartkeyword(keyword);
            returnItem.keyword = keyword;
            var searchKeyword = prefix + keyword;
            var data = require('../data/data.json')
            if (data && data.list && data.list.length > 0) {
                var result = Core.getDescription(searchKeyword, data.list);
                returnItem.POList = result.POList || [];
                returnItem.PSList = result.PSList || [];
            }
        } catch (err) {
            console.log(err);
            return Utility.handleReturn(res, next, "209", Message.getMessage('msg_s_209'), null);
        }

    } else {
        return Utility.handleReturn(res, next, "201", Message.getMessage('msg_s_201'), returnItem);
    }

    // req.__data.hisData = JSON.stringify(returnItem);
    return Utility.handleReturn(res, next, "200", Message.getMessage('msg_s_200'), returnItem);

}


module.exports = {
    getDescriptionData: getDescriptionData
};