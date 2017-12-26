var _ = require("lodash");

//根据S/P/O中的1个获取对应三元组 key：s/p/o中的一个的值；prop：subject或object或property；triples：传入的三元组列表
var findTriplesByKey = function (key, prop, triples) {
    var match = _.filter(triples, (triple) => {
        return _.property(prop)(triple).toLowerCase() == key.toLowerCase()
    });
    return match || [];
}

// var findTriplesByFormatKey = function (key, prop, triples) {
//     var match = _.filter(triples, (triple) => {
//         return _.property(prop)(triple).toLowerCase() == key.toLowerCase()
//     });
//     return match || [];
// }

//根据S和P或者O和P找到对应的三元组 key：s/o中的一个的值；prop：subject或object；property：属性；triples：传入的三元组列表
var findTriplesByKeyAndProperty = function (key, prop, property, triples) {
        var match = _.filter(triples, (triple) => {
        return _.property(prop)(triple).toLowerCase() == key.toLowerCase() && triple.property == property
    });
    return match || [];
}

//将超链接转换位单词
var toWords = function (url) {
    if (url && typeof (url) === 'string') {
        var words = url.split(/[/#]/);
        var word = _.last(words);

        // return _.first(_.last(url.split(/[/#]/)).split(/@/));
        return _.last(url.split(/[/#]/));
    } else {
        return '';
    }
}


//将三元组的的S/P/O超链接转换为单词 list：传入的三元组列表
var listToWords = function (list) {
    var result = [];
    if (list) {
        _.each(list, (item) => {
            result.push({
                subject: toWords(item.subject),
                property: toWords(item.property),
                object: toWords(item.object),
            });
        });
    }
    return result;
}



const _otherProp = {
    "subject": "object",
    "object": "subject"
}
//合并相同属性的属性值，转换成数组  triples:传入的三元组列表；prop：object或者subject
var combineSameProperty = function (triples, prop) {
    var result = [];
    if (triples) {
        var combimePorp = prop;
        var otherProp = _otherProp[prop];
        var sortedTriples = _.sortBy(triples, "property");
        var tempProp = "";
        var tempTriple = {};
        _.each(sortedTriples, (triple) => {
            if (triple.property == tempProp) {
                _.property(prop)(tempTriple).push(_.property(prop)(triple).replace(/[/"]/g, ""));
            }
            else {
                if (tempTriple.property) {
                    result.push(tempTriple);
                }
                tempProp = triple.property;
                if (prop == "object") {
                    tempTriple = {
                        subject: triple.subject,
                        property: triple.property,
                        object: []
                    }
                    tempTriple.object.push(triple.object.replace(/[/"]/g, ""))
                } else {
                    tempTriple = {
                        subject: [],
                        property: triple.property,
                        object: triple.object
                    }
                    tempTriple.object.push(triple.subject.replace(/[/"]/g, ""))
                }
            }
        })
        if (tempTriple.property) { result.push(tempTriple); }
    }
    return result;
}


//输入关键词处理 用下划线替换空格
const url = '';
var formartkeyword = function (keyword) {
    if (keyword) {
        return url + keyword.trim().replace(/\s/g, '_');
    } else {
        return '';
    }
}

//无用属性列表
const _uselessList = [
    "http://www.w3.org/2000/01/rdf-schema#subPropertyOf",
    "http://purl.org/vocab/vann/preferredNamespaceUri",
    "http://purl.org/vocab/vann/preferredNamespacePrefix",
    "http://rdvocab.info/RDARelationshipsWEMI/manifestationOfWork",
    "http://www.w3.org/2002/07/owl#equivalentProperty",
    "http://dbpedia.org/ontology/wikiPageRevisionID",
    "http://purl.org/dc/terms/modified",
    "http://dbpedia.org/ontology/wikiPageExternalLink",
    "http://www.w3.org/ns/prov#wasDerivedFrom",
    "http://dbpedia.org/property/reference",
    "http://www.w3.org/2002/07/owl#versionInfo",
    "http://www.w3.org/2000/01/rdf-schema#seeAlso",
    "http://dbpedia.org/ontology/wikiPageID",
    "http://dbpedia.org/ontology/wikiPageID",
    "http://purl.org/dc/terms/issued",
    "http://umbel.org/umbel#isLike",
    "http://www.w3.org/2002/07/owl#equivalentClass",
    "http://www.w3.org/2002/07/owl#differentFrom"
];

//删除无用属性 triples：传入的三元组列表
var removeUselessProp = function (triples) {
    _.remove(triples, function (triple) {
        return _.includes(_uselessList, triple.property);
    });
}

//获取描述型认知子图数据 searchKeyword：传入的关键词url；data:传入的三元组列表数据
var getDescription = function (searchKeyword, data) {
    var result = {};
    var POResult = findTriplesByKey(searchKeyword, "subject", data);
    removeUselessProp(POResult);
    var POFomartResult = listToWords(POResult);
    result.POList = combineSameProperty(POFomartResult, "object") || [];

    var PSResult = findTriplesByKey(searchKeyword, "object", data);
    removeUselessProp(PSResult);
    var PSFomartResult = listToWords(PSResult);
    result.PSList = combineSameProperty(PSFomartResult, "subject") || [];
    return result;
}

//获取对比关键词的候选集 searchKeyword：传入的关键词url；triples:传入的三元组列表数据
const subClassOf = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
var getCandidateKeywords = function (searchKeyword, triples) {
    var result = [];
    var superClass = findTriplesByKeyAndProperty(searchKeyword, "subject", subClassOf, triples);//获取父类
    if (superClass && superClass.length > 0) {//有父类
        var superKeywords = _.map(superClass, "object");
        _.each(superKeywords, (item) => {
            var candidates = findTriplesByKeyAndProperty(item, "object", subClassOf, triples);
            result = _.union(result, _.map(candidates, "subject") || []);
        });
        // result = _.union(result, superKeywords);//将父类添加到候选集
        // result = _.uniq(result);
        _.remove(result, function (item) {
            return item.toLowerCase() == searchKeyword.toLowerCase();
        });
    } else {
        var subClass = findTriplesByKeyAndProperty(searchKeyword, "object", subClassOf, triples);//获取子类
        if (superClass && superClass.length > 0) {//有子类
            result = _.map(subClass, "subject") || [];
        }
    }
    return result;

}



//多语言属性，计算相似度时过滤。
const _multiLanguage = [
    "label",// "http://www.w3.org/2000/01/rdf-schema#label",
    "abstract",// "http://dbpedia.org/ontology/abstract",
    "comment"// "http://www.w3.org/2000/01/rdf-schema#comment"
]
//过滤无用多语言属性
var filterMultiLanguageProp = function (list) {
    _.remove(list, function (item) {
        return _.includes(_multiLanguage, item);
    });
}
//相似度计算 original：查询的关键词的描述型认知子图数据；comparison：对比的描述型认知子图数据
var similarityCalculation = function (original, comparison) {
    var result = { value: 0.0, data: null };

    var originalPO = original.POList || [];
    var originalPS = original.PSList || [];
    var comparisonPO = comparison.POList || [];
    var comparisonPS = comparison.PSList || [];
    var unionPO = _.union(_.map(originalPO, "property"), _.map(comparisonPO, "property"));
    var intersectionPO = _.intersection(_.map(originalPO, "property"), _.map(comparisonPO, "property"));
    var unionPS = _.union(_.map(originalPS, "property"), _.map(comparisonPS, "property"));
    var intersectionPS = _.intersection(_.map(originalPS, "property"), _.map(comparisonPS, "property"));
    filterMultiLanguageProp(unionPO);
    filterMultiLanguageProp(intersectionPO);
    filterMultiLanguageProp(unionPS);
    filterMultiLanguageProp(intersectionPS);
    var similarity = 0.0;
    var total = 0;

    if (unionPO && unionPO.length > 0) {

        total += unionPO.length;
        _.each(intersectionPO, (property) => {
            var matchO = _.find(originalPO, (item) => {
                return item.property == property
            }) || {};
            var matchC = _.find(comparisonPO, (item) => {
                return item.property == property
            }) || {};
            var tempUnion = _.union(matchO.object, matchC.object) || [];
            var tempIntersection = _.intersection(matchO.object, matchC.object) || [];
            similarity += tempIntersection.length / tempUnion.length;
        });
    }
    if (unionPS && unionPS.length > 0) {
        total += unionPS.length;
        _.each(intersectionPS, (property) => {
            var matchO = _.find(originalPS, (item) => {
                return item.property == property
            }) || [];
            var matchC = _.find(comparisonPS, (item) => {
                return item.property == property
            }) || [];
            var tempUnion = _.union(matchO.subject, matchC.subject) || [];
            var tempIntersection = _.intersection(matchO.subject, matchC.subject) || [];
            similarity += tempIntersection.length / tempUnion.length;
        });
    }
    result.value = similarity / total;
    result.data = comparison;
    return result;
}

module.exports = {
    findTriplesByKey: findTriplesByKey,
    findTriplesByKeyAndProperty: findTriplesByKeyAndProperty,
    toWords: toWords,
    formartkeyword: formartkeyword,
    listToWords: listToWords,
    combineSameProperty: combineSameProperty,
    removeUselessProp: removeUselessProp,
    getDescription: getDescription,
    getCandidateKeywords: getCandidateKeywords,
    similarityCalculation: similarityCalculation
};