//
'use strict';


var _ = require("lodash");
var Utility = require('../infrastructure/utility');
var Core = require('../infrastructure/core');
var Message = require('../infrastructure/message');
const prefix = "http://dbpedia.org/ontology/";

//
var getComparisonData = function (req, res, next) {
    var keyword = req.params.keyword ? req.params.keyword.trim() : "";
    keyword = req.body.nameid;
    var returnItem = { hasComparison: false, original: null, comparison: null }
    var original = { keyword: "", POList: [], PSList: [] };
    if (keyword) {
        try {
            keyword = Core.formartkeyword(keyword);
            original.keyword = keyword;
            var searchKeyword = prefix + keyword;
            var data = require('../data/data.json')
            if (data && data.list && data.list.length > 0) {
                var triples = data.list;
                var result = Core.getDescription(searchKeyword, triples);
                original.POList = result.POList || [];
                original.PSList = result.PSList || [];
                returnItem.original = original;
                var candidates = Core.getCandidateKeywords(searchKeyword, triples);

                if (candidates && candidates.length > 0) {
                    var similarity = [];
                    _.each(candidates, (candidate) => {
                        var comparisonItem = Core.getDescription(candidate, triples);

                        if (comparisonItem && (comparisonItem.POList.length > 0 || comparisonItem.PSList.length > 0)) {
                            comparisonItem.keyword = Core.toWords(candidate);
                            similarity.push(Core.similarityCalculation(original, comparisonItem));
                        }
                    });
                    similarity = _.sortBy(similarity, "value");
                    if (similarity.length > 0) {
                        returnItem.comparison = _.last(similarity).data;
                        returnItem.hasComparison = true;
                        // console.log(_.last(similarity).value)
                    }
                }
            }
        } catch (err) {
            console.log(err);
            return Utility.handleReturn(res, next, "209", Message.getMessage('msg_s_209'), null);
        }

    } else {
        return Utility.handleReturn(res, next, "201", Message.getMessage('msg_s_201'), null);
    }

    // req.__data.hisData = JSON.stringify(returnItem);
    return Utility.handleReturn(res, next, "200", Message.getMessage('msg_s_200'), returnItem);


}


module.exports = {
    getComparisonData: getComparisonData
};