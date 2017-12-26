var red =["#B04B70","#72183A","#B87B9D"] ; //Main Dark Light
var blue =["#45518A","#16225A","#7A87C4"] ;
var green =["#85B74E","#4A7719","#AEDB7D"] ;
var yellow = ["#CAA856","#83651C","#E5CF9C"];
var white = '#ffffff';
var blueset = {background:blue[0],selectedcolor:blue[1],nearestcolor:blue[2],color:white};
var redset = {background:red[0],selectedcolor:red[1],nearestcolor:red[2],color:white};
var greenset = {background:green[0],selectedcolor:green[1],nearestcolor:green[2],color:white};
var yellowset = {background:yellow[0],selectedcolor:yellow[1],nearestcolor:yellow[2],color:white};

var s = '{"status":"200","message":"查询成功","data":{"hasComparison":true,"original":{"keyword":"avltree","POList":[{"subject":"avltree","property":"inventedBy","object":["Georgy Adelson-Velsky and Evgenii Landis"]},{"subject":"avltree","property":"inventedYear","object":["1962"]},{"subject":"avltree","property":"inventedDAy","object":["2012"]},{"subject":"avltree","property":"name","object":["AVL tree"]},{"subject":"avltree","property":"subject","object":["Category:1962_in_computer_science","Category:Binary_trees","Category:Search_trees","Category:Soviet_inventions"]}],"PSList":[]},"comparison":{"keyword":"redblacktree","POList":[{"subject":"redblacktree","property":"inventedBy","object":["Rudolf_Bayer"]},{"subject":"redblacktree","property":"inventedYear","object":["1972"]},{"subject":"redblacktree","property":"name","object":["Red black tree"]},{"subject":"redblacktree","property":"inventedmonth","object":["777"]},{"subject":"redblacktree","property":"subject","object":["Category:1972_in_computer_science","Category:Articles_containing_proofs","Category:Articles_with_example_C_code","Category:Binary_trees","Category:Search_trees"]}],"PSList":[]}}}';//fucking!
var graphJSON = {
    "nodes": [
    ],
    "edges": [
    ]
};
var string = JSON.parse(s);

function samearry(array1,array2) {
    for(var i=0 ; i<array2.length;i++){
        if(array1.toString()=== array2[i].toString()){
            return i;
        }
    }
    return -1;
}



if (string['data']['hasComparison'] === true) {

    var a = string['data']['original']['POList'];
    var subjecta = a[0]['subject'];
    graphJSON['nodes'].push([subjecta, blueset]);
    for (var i = 0; i < a.length; i++) {
//            if (a[i]['property'] === 'label'){
//                continue;
//            }
        if (a[i]['property'] === 'comment') {
            continue;
        }
        if (a[i]['property'] === 'sameAs') {
            continue;
        }
        if (a[i]['property'] === 'abstract') {
            continue;
        }
        graphJSON['nodes'].push([a[i]['property'], blueset]);
        graphJSON['edges'].push([subjecta, a[i]['property'], {color: blue[0]}]);
        for (var j of a[i]['object']) {
            graphJSON['nodes'].push([j, blueset]);
            graphJSON['edges'].push([a[i]['property'], j, {color: blue[0]}]);
        }
    }

    a = string['data']['comparison']['POList'];
    var subjectb = a[0]['subject'];
    var switchb =0;
    graphJSON['nodes'].push([subjectb, redset]);
    for (var i = 0; i < a.length; i++) {
//            if (a[i]['property'] === 'label'){
//                continue;
//            }
        if (a[i]['property'] === 'comment') {
            continue;
        }
        if (a[i]['property'] === 'sameAs') {
            continue;
        }
        if (a[i]['property'] === 'abstract') {
            continue;
        }
        var posnum = samearry([subjecta, a[i]['property'], {color: blue[0]}], graphJSON['edges']);
        if (posnum !== -1) {
            graphJSON['edges'][posnum][2] = {color: yellow[0]};
            var pnodenum = samearry([a[i]['property'], blueset], graphJSON['nodes']);
            graphJSON['nodes'][pnodenum][1] = yellowset;
            if(switchb===0) {
                var snodenum = samearry([subjecta, blueset], graphJSON['nodes']);
                graphJSON['nodes'][snodenum][1] = yellowset;
                graphJSON['nodes'][snodenum][0] = "comparison";
                snodenum = samearry([subjectb, redset], graphJSON['nodes']);
                graphJSON['nodes'][snodenum][1] = yellowset;
                graphJSON['nodes'][snodenum][0] = "comparison";
                switchb=-1;
            }
        }
        else {
            graphJSON['nodes'].push([a[i]['property'], redset]);
            graphJSON['edges'].push([subjectb, a[i]['property'], {color: red[0]}]);
        }
        for (var j of a[i]['object']) {
            var num = samearry([a[i]['property'], j, {color: blue[0]}], graphJSON['edges']);
            if (num !== -1) {
                graphJSON['edges'][num][2].color = green[0];
            }
            else {
                graphJSON['nodes'].push([j, redset]);
                graphJSON['edges'].push([a[i]['property'], j, {color: red[0]}])
            }

        }
    }

    for (var i = 0; i < graphJSON['edges'].length; i++) {
        if (graphJSON['edges'][i][2].color === green[0]) {
            for (var j = 0; j < graphJSON['nodes'].length; j++) {
                if (graphJSON['nodes'][j][0] === graphJSON['edges'][i][0]) {
                    graphJSON['nodes'][j][1] = greenset;
                }
                if (graphJSON['nodes'][j][0] === graphJSON['edges'][i][1]) {
                    graphJSON['nodes'][j][1] = greenset;
                }
            }
        }

    }

}
            