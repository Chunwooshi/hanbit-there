var areaActivity = [];

function init(_areaActivity) {
    areaActivity = _areaActivity;
    setAreaActivity();

    $('.hta-add-row').on('click', function() {
        areaActivity.push({
            title: '제목',
            value: '내용'
        });

        setAreaActivity();
    });
}

function setAreaActivity() {
    $('.hta-activity-info tbody').empty();

    var template = require('../../template/admin/activity-info.hbs');

    for (var i=0; i<areaActivity.length; i++) {
        areaActivity[i].no = i + 1;

        var html = template(areaActivity[i]);

        $('.hta-activity-info tbody').append(html);
    }

    addAreaActivityEvents();
}

function addAreaActivityEvents() {
    addBtnRowEvents();

    $('.hta-activity-info tbody tr').off('dblclick');
    $('.hta-activity-info tbody tr').on('dblclick', function() {
        var row = $(this);
        var rowIndex = $(this).index();
        var info = areaActivity[rowIndex];
        var template = require('../../template/admin/activity-info-edit.hbs');
        var html = template(info);

        row.replaceWith(html);

        addBtnRowEvents();
    });
}

function addBtnRowEvents() {
    $('.hta-activity-info .hta-btn-row').off('click');
    $('.hta-activity-info .hta-btn-row').on('click', function() {
        var row = $(this).parents('tr');
        var rowIndex = row.index();
        var info = areaInfo[rowIndex];

        if ($(this).hasClass('hta-apply-row')) {
            info.title = row.find('.hta-activity-info-title').val().trim();
            info.value = row.find('.hta-activity-info-value').val().trim();
        }
        else if ($(this).hasClass('hta-remove-row')) {
            _.remove(areaInfo, function(value, index) {
                return rowIndex === index;
            });

            setAreaActivity();
            return;
        }
        else if ($(this).hasClass('hta-up-row')) {
            if (rowIndex < 1) {
                return;
            }

            areaActivity = _.move(areaActivity, rowIndex, rowIndex - 1);

            setAreaActivity();
            return;
        }
        else if ($(this).hasClass('hta-down-row')) {
            if (rowIndex >= areaActivity.length - 1) {
                return;
            }

            areaActivity = _.move(areaActivity, rowIndex, rowIndex + 1);

            setAreaInfo();
            return;
        }

        var template = require('../../template/admin/activity-info.hbs');
        var html = template(info);
        row.replaceWith(html);

        addAreaActivityEvents();
    });
}

module.exports = {
    init: init
};