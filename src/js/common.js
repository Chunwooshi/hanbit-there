var htOption = require('./ht-option');
var htPrice = require('./ht-price');

$('body').on('click', function(event) {
    var target = $(event.target);

    if (target.closest('.ht-option-control').length > 0) {
        htOption.handler(target);
    }
    else if (target.closest('.ht-price-btn').length > 0) {
        htPrice.handler(target.closest('.ht-price-btn'));
    }
    else {
        htOption.closeAll();
    }
});

$.ajax({
    url: '/api/menu/json',
    success: function(result) {
        initMenu(result);
    }
});


function initMenu(menus) {
    var template = require('../template/header-menu.hbs');

    $('.header-menu').empty();

    for (var i=0; i<menus.length; i++) {
        var menuHtml = template(menus[i]);

        $('.header-menu').append(menuHtml);
    }

    attachEvents();
}

$('.header-logo').on('click', function() {
    location.href = './';
});

function attachEvents() {
    $('.h-sub-m > li').on('click', function() {
        var theresId = $(this).attr('theres-id');

        location.href = './theres.html?id=' + theresId;
    });

    $('.header-menu > li').on('mouseover', function() {
        var subMenu = $(this).find('.h-sub-m');
        var subMenuItemWidth = subMenu.find('li').outerWidth();
        var subMenuItemMaxCount = 5;
        var subMenuItemCount = subMenu.find('li').length;

        var width = subMenuItemWidth
            * Math.min(subMenuItemCount, subMenuItemMaxCount);

        if ($(this).offset().left + width > $(window).width()) {
            var subMenuLeft = $(window).width() - ($(this).offset().left + width);
            subMenu.css('left', subMenuLeft);
        }
        else {
            subMenu.css('left', 0);
        }

        subMenu.width(width);
        subMenu.show();
    });

    $('.header-menu > li').on('mouseout', function() {
        $(this).find('.h-sub-m').hide();
    });
}
$('.header-btn-member').on('click', function() {
    $('body').append('<div class="overlay-layer dark-layer"></div>');
    $('body').css('overflow', 'hidden');

    var memberLayer = require('../template/member-layer2.hbs');

    $('body').append(memberLayer);

    $('.ht-member-toggle').on('click', function() {
        $('.ht-sign-in').toggle();
        $('.ht-sign-up').toggle();
    });

    $('.ht-member-layer').animate({
        right: '0px'
    }, {
        duration: 500,
        complete: function() {
            $('.overlay-layer').on('click', function() {
                $('.ht-member-layer').animate({
                    right: '-333px'
                }, {
                    duration: 500,
                    complete: function() {
                        $('.ht-member-layer').remove();
                        $('.overlay-layer').remove();
                        $('body').css('overflow', 'auto');
                    }
                });
            });
        }
    });
});