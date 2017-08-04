require('../../less/admin/there-info.less');
var _ = require('lodash');
var hangul = require('hangul-js');

var common = require('./common');

var thereList = [];//검색어

$('.hta-add-there').on('click', function () {
    location.href = './there-info-edit.html';
});

$.ajax({
    url: '/api/admin/there/groups',
    success: function(result) {
        var thereGroupItemsTemplate = require('../../template/admin/there_group_items.hbs');
        var thereGroupItemsHtml = thereGroupItemsTemplate(result);

        $('#hta-there-group-select .dropdown-menu').html(thereGroupItemsHtml);

        $('#hta-there-group-select .dropdown-menu a').on('click', function(event) {
            common.addDropdownEvent(event, this);

            var groupId = $(this).attr('group-id');
            requestList(groupId);
        });
    }
});

function requestList(groupId) {
    $.ajax({
        url: '/api/admin/there/list',
        data: {
            groupId: groupId
        },
        success: function(result) {
            thereList = result;//검색어 설정

            search();
        }
    });
}

function setList(theres) {
    var theresTemplate = require('../../template/admin/theres.hbs');
    var theresHtml = theresTemplate(theres);

    $('.hta-there-list').html(theresHtml);

    $('.hta-there-list > li').on('click', function() {
        var thereId = $(this).attr('there-id');

        location.href = './there-info-edit.html?id=' + thereId;
    });
}

$('#hta-there-search-input').on('paste cut', function(event) {
    setTimeout(search, 100);
});

$('#hta-there-search-input').on('keyup', function(event) {
    switch (event.keyCode) {//kyeCode 적용시, 코드 순서가 중요. 잘 못 하면, 중복 적용이 됨.
        case 27:    // esc
            $('#hta-there-search-input').val('');
        case 8:     // backspace
        case 46: {  // delete
            search();
            break;
        }
    }
});

var searchTimer;
var lastSearchTime = _.now();

$('#hta-there-search-input').on('input', function() {//on( '') 사용 시, 안에서 띄어쓰기를 사용하면 여러 이벤트 사용이 가능.
    clearTimeout(searchTimer);
    var delay = 200;
    var now = _.now();

    if(now - lastSearchTime > 1000) {
        delay = 0;
    }
    searchTimer = setTimeout(function () {
        search();
    }, delay);//100=0.1s
});

function hangulSearch(text, keyword) {
    var disassembled = hangul.disassemble(keyword);
    var isChosung = true;

    for (var i=0; i<disassembled.length; i++) {
        if(!hangul.isCho(disassembled[i])) {
            isChosung = false;
            break;
        }
    }

    if(!isChosung) {
        return hangul.search(text, keyword) > -1;
    }
    console.log();
    var chosung = _.map(hangul.d(text, true), function (arr) {
        return arr[0];
    });

    return hangul.search(chosung, keyword) > -1;
}

function search() {
    var keyword = _.kebabCase($('#hta-there-search-input').val().toLowerCase());

    thereList.forEach(function(there) {
        var id = there.id.toLowerCase();
        var name = there.name.toLowerCase();

        if (id.includes(keyword) || hangulSearch(name, keyword)) {
            delete there.hidden;
        }
        else {
            there.hidden = true;
        }
    });

    setList(thereList);

    lastSearchTime = _.now();
}