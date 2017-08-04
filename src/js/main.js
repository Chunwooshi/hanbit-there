require('bootstrap');
require('../less/main.less');

var common = require('./common');

var hotActivities = require('./model/hot-act');
var bestActivities = require('./model/best-act');

function initHotActivities(hotActivities) {
    var template = require('../template/main/act.hbs');

    $('.ht-hot-act').empty();

    for (var i=0; i<hotActivities.length; i++) {
        var html = template(hotActivities[i]);

        $('.ht-hot-act').append(html);
    }
}

function initBestActivities(bestActivities) {
    var template = require('../template/main/act.hbs');

    $('.ht-best-act').empty();

    for (var i=0; i<bestActivities.length; i++) {
        bestActivities[i].rank = i + 1;
        var html = template(bestActivities[i]);

        $('.ht-best-act').append(html);
    }
}

initHotActivities(hotActivities);
initBestActivities(bestActivities);