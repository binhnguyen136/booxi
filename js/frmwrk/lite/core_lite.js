//GLOBAL VAR

/*
 eng:'https://www.youtube.com/embed/GVySvPwGhB0?autoplay=1',
 fre:'https://www.youtube.com/embed/Bq-XaHeomkk?autoplay=1'


 <div class="bxAbs bx_bt_round" style="top:-2em; right:-2em;" onclick="closeAll_LBX()">

 </div>

 */

function launchAltVideo(video_title, video_link)
{
    var h = '';
    h += '<div id="VBX" class="bx_lightbox bk_gradV_FF_FF_EE" data-lbx-show="true" onclick="closeVBX();">';
    h += '<div class="W H tx_alg_C bxRel">';
    h += '<div class="bxVAlg_C bxD_inb" style="width: auto;">';
    h += '<iframe class="vbx_iframe bxShdw_6" src="'+video_link+'" allowfullscreen=""></iframe>';
    h += '<div class="vid_footer_box">';
    h += '<div class="fbx2 fnt_col555">';
    h += '<div class="tx_alg_L_mC vlh_30">';
    h += utlWrpSpanByBxLangClass(video_title, "vfnt_26 fnt_w7");
    h += '</div>';
//    h += '<div class="tx_alg_L_mC vlh_16" style="margin-top: 10px;">';
//    h += '<span class="vfnt_16">';
//    h +=  utlWrpSpanByBxLang("vid_common_02");
//    h += ' <a class="link" href="http://www.niveau2.tv/en/portfolio/booxi/" target="_blank">Niveau2.tv</a></span>';
//    h += '</div>';
    h += '</div>';
    h += '<div class="fbx2 tx_alg_R_mC">';
    h += '<div class="fxsprow1 bx_vmob768"></div>';
    h += '<a href="'+fnLang_getBxLink("signup")+'" class="bx_button bt_style_blue">';
    h +=  utlWrpSpanByBxLangClass("idx_v2_12", "vfnt_20 fnt_w7 fnt_colFFF");
    h += '</a>';
    h += '</div>';
    h += '</div>';
    h += '</div>';
    h += '<div class="close-button bxAbs bkgImg_center_center curPnt" style="background-image: url(/img/icons/svg/x_b.svg);" onclick="closeVBX();"></div>';
    h += '<div class="vid_logo bxAbs">';
    h += '<div class="bx_hmob768">';
    h += '<a class="bxD_inb bxRel bkg_col44CE PL-3 PR-3 PT-1 PB-1" href="/" style="border-radius: 4em; top:-1em;"><img src="/img/common/logo_booxi_w_.svg"></a>';
    h += '</div>';
    h += '<div class="bx_vmob768">';
    h += '<a class="PL-2 PR-2 bkg_col44CE bxD_inb H5" href="/" style="border-radius: 30px;"><img class="vpos_cent_bxRel" src="/img/v2/common/booxi_m.svg"></a>';
    h += '</div>';
    h += '</div>';
    h += '</div>';
    h += '</div>';

    closeVBX();
    $('body').append(h);
}



function launchVideoPromo()
{
    var link_use = 'https://www.youtube.com/embed/GVySvPwGhB0?autoplay=1';

    if(lng_getGBLangCode() == 'fre')
        link_use = 'https://www.youtube.com/embed/Bq-XaHeomkk?autoplay=1';

    var close = '<div class="vbx_close_btn bxAbs bx_bt_round hmob800" onclick="closeVBX();"><div style="background-image: url(/img/icons/svg/x_w.svg);"></div></div>';
    var close2 = '<div class="bxAbs bx_bt_round vmob800" style="top: 1em; right: 1em;" img="x_w" onclick="closeVBX();"><div style="background-image: url(/img/icons/svg/x_w.svg);"></div></div>';
    var footer = '<a class="video_n2" href="http://www.niveau2.tv/en/portfolio/booxi/" target="_blank"></a>';

    var link = '<iframe class="vbx_iframe bxShdw_6" src="'+link_use+'" allowfullscreen></iframe>';
    var h = '<div id="VBX" class="bx_lightbox lbx_light" data-lbx-show="true" onclick="closeVBX();">' +
        '<div class="W H tx_alg_C"><div class="bxVAlg_C bxD_inb" style="width: auto;">'+link+close+'</div></div>'+close2+footer+'</div>';

    $('body').append(h);
}

function closeVBX()
{
    $('#VBX').remove();
}


// Testimonial navigation

function vp_next_test()
{
    if(vp_test_animActive() === true)
        return;

    var item_old = vp_find_selected_index();

    item_old.animate({opacity:0}, 400, 'swing', function(){
        var _this = $(this);
        _this.attr('data-show', 'false');
        var next = null;
        if(_this.next().length > 0)
            next = _this.next();
        else
            next = _this.parent().children().eq(0);

        next.attr('data-show', 'true').animate({opacity:1}, 400, 'swing');
    });
}

function vp_prev_test()
{
    if(vp_test_animActive() === true)
        return;

    var item_old = vp_find_selected_index();

    item_old.animate({opacity:0}, 400, 'swing', function(){
        var _this = $(this);
        _this.attr('data-show', 'false');
        var prev = null;
        if(_this.prev().length > 0)
            prev = _this.prev();
        else
            prev = _this.parent().children().last();

        prev.attr('data-show', 'true').animate({opacity:1}, 400, 'swing');
    });

}

function vp_test_animActive()
{
    var animCount = $("#vpid_tesitmonial_box").children().filter(':animated').length;

    if(animCount > 0)
        return true;

    return false;
}

function vp_find_selected_index()
{
    var box = $("#vpid_tesitmonial_box");

    var item = box.children('.vp_testimonial_item[data-show=true]');

    if(item.length === 0)
        return item.eq(0);

    return item;
}


// Get Started // -----------------------------------

function clkStartedPopup__bx2()
{
    closeAll_LBX();
    $("#LBX_get_started").attr('data-lbx-show', 'true');
}

function closeAll_LBX()
{
    $('.bx_lightbox').attr('data-lbx-show', 'false');
}

function clkStartedEmail__bx2(ele)
{
    if(window.bxGlobal === undefined)
        window.bxGlobal = {};

    bxGlobal.bxSignupUseEmail = null;
    var rgxEmail = /^[a-z0-9+\._%\-+]{1,256}@[a-z0-9][a-z0-9-]{0,64}(\.[a-z0-9][a-z0-9-]{0,25})+$/i;
    var is_valid = true;
    var jqInput = $(ele).prev('input');

    if(jqInput.length === 0)
        return;

    var val = utlTrimWhiteSpace_edge(jqInput.val(), true);

    if(val.length < 1)
        is_valid = false;

    if(rgxEmail.test(val) !== true)
        is_valid = false;

    if(is_valid === true)
    {
        jqInput.attr('data-is-error', 'false');
        bxGlobal.bxSignupUseEmail = val;
        var reqData = { email: val };
        var reqPath = __fancy_path__ + 'web_php/svr/put_record_client_hub.php';
        utlHttpPost(reqPath, reqData, onHubspotComplete__bx2, onHubspotComplete__bx2);
    }
    else
    {
        jqInput.attr('data-is-error', 'true');
    }
}

function onFocus_getStarted__bx2(ele)
{
    ele.setAttribute('data-is-error', 'false');
}

function onHubspotComplete__bx2()
{
    var url = lng_getLink_byLang('signup', lng_getGBLangCode());

    if(bxGlobal.bxSignupUseEmail !== null)
    {
        url += '?use_email=' + window.bxGlobal.bxSignupUseEmail;
    }

    if(url.length > 0)
        window.location = __fancy_path__ + url;
}


// MENU BAR Methods
var gbl_lastScrollTop = 0;
function initFloatingMenu()
{
    $(window).on('scroll', function(e)
    {
        if( utlEvalAsBool($('#bxFMob').attr('data-menu-open')) === true)
            return;

        var scrollTop = $(window).scrollTop();

        if(scrollTop === gbl_lastScrollTop)
            return;

        if (scrollTop > gbl_lastScrollTop)
        {
            // downscroll code
            bxFM_closeAll();
        }
        else
        {
            // upscroll code
            if(scrollTop > 150)
            {
                bxFLT_onPageResize();
                bxFM_onPageResize();
                $('#bxFM').attr('data-is-open', 'true');
                $('#bxFMob').attr('data-is-open', 'true');
            }
            else
                bxFM_closeAll();
        }

        gbl_lastScrollTop = scrollTop;

    });


    /*
    $(window).on('wheel', function(e)
    {
        if( utlEvalAsBool($('#bxFMob').attr('data-menu-open')) === true)
            return;

        var delta = e.originalEvent.deltaY;
        if (delta > 0)
        {
            bxFM_closeAll();
        }
        else
        {
            if($(window).scrollTop() > 250)
            {
                bxFLT_onPageResize();
                bxFM_onPageResize();
                $('#bxFM').attr('data-is-open', 'true');
                $('#bxFMob').attr('data-is-open', 'true');
            }
            else
                bxFM_closeAll();
        }
    });
*/
    $( window ).resize(bxMenu_resizeAll);

}

function bxMenu_resizeAll()
{
    bxFLT_onPageResize();
    bxFM_onPageResize();
}

function bxFM_onPageResize()
{
    var ww_anchor = document.getElementById('bxFM_ank2');

    if(ww_anchor.offsetLeft < 5)
        return;


    $('#bxFMob').attr('data-menu-open', 'false');

    var is_collide = testContact(document.getElementById('bxFM_ank1'), ww_anchor);
    var menuState = utlEvalAsBool( $('#bxFM_ank2').parent().next().attr('data-menu-short') );

    if(is_collide === true)
    {
        if(menuState === true)
            return;

        var offset = $( window ).width() - ww_anchor.offsetLeft;
        $('#bxFM_ank2').css('right', offset+'px');
        $('#bxFM_ank2').parent().next().attr('data-menu-short', 'true');
    }
    else
    {
        if(menuState === false)
            return;

        $('#bxFM_ank2').css('right', '');
        $('#bxFM_ank2').parent().next().attr('data-menu-short', 'false');
    }
}

function bxFLT_onPageResize()
{
    var ww_anchor = document.getElementById('bxFLT_ank2');

    if(ww_anchor.offsetLeft < 5)
        return;


    $('#bxFMob').attr('data-menu-open', 'false');

    var is_collide = testContact(document.getElementById('bxFLT_ank1'), ww_anchor);
    var menuState = utlEvalAsBool( $('#bxFLT_ank2').parent().next().attr('data-menu-short') );

    if(is_collide === true)
    {
        if(menuState === true)
            return;

        var offset = $( window ).width() - ww_anchor.offsetLeft;
        $('#bxFLT_ank2').css('right', offset+'px');
        $('#bxFLT_ank2').parent().next().attr('data-menu-short', 'true');
    }
    else
    {
        if(menuState === false)
            return;

        $('#bxFLT_ank2').css('right', '');
        $('#bxFLT_ank2').parent().next().attr('data-menu-short', 'false');
    }
}

function bxFM_openLang()
{
    bxFM_openHandler('#bxFM_lang_menu');
}

function bxFMob_openLang()
{
    $('#bxFMob').attr('data-menu-open', 'false');

    //if($(window).scrollTop() > 100)

    if($('#bxFMob').attr('data-is-open') === 'true')
        bxFM_openHandler('#bxFMob_lang_menu');
    else
        bxFM_openHandler('#bxMM_lang_menu');
}

function bxFM_openMini(menu_target)
{
    if(menu_target === 1)
        bxFM_openHandler('#bxFLT_mini_menu');
    else
        bxFM_openHandler('#bxFM_mini_menu');
}

function bxPM_openLang()
{
    bxFM_openHandler('#bxPM_lang_menu', true);
}

function bxMM_openLang()
{
    bxFM_openHandler('#bxMM_lang_menu', true);
}

function bxFM_openHandler(idLabel)
{
    var jq = $(idLabel);
    var state = utlEvalAsBool(jq.attr('data-is-active'));

    if(state === false)
    {
        $('.bxFM_submenu').attr('data-is-active', 'false');
        if(arguments[1] !== false)
            $('#bxFM_underlay').attr('data-is-active', 'true');
    }

    setTimeout(function(){jq.attr('data-is-active', utlAsString(!state));}, 1);
}

function bxFM_closeAll()
{
    $('#bxFM').attr('data-is-open', 'false');
    $('#bxFMob').attr('data-is-open', 'false');
    $('body').attr('data-no-scroll', 'false');

    $('#bxFLT_mini_menu').attr('data-is-active', 'false');
    $('#bxFM_mini_menu').attr('data-is-active', 'false');
    $('#bxFM_lang_menu').attr('data-is-active', 'false');
    $('#bxPM_lang_menu').attr('data-is-active', 'false');
    $('#bxFMob_lang_menu').attr('data-is-active', 'false');
    $('#bxMM_lang_menu').attr('data-is-active', 'false');
    $('#bxFM_underlay').attr('data-is-active', 'false');
}

function testContact(el1, el2)
{

    el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
    el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
    el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
    el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

    return !((el1.offsetBottom < el2.offsetTop) ||
        (el1.offsetTop > el2.offsetBottom) ||
        (el1.offsetRight < el2.offsetLeft) ||
        (el1.offsetLeft > el2.offsetRight));

}

function bxFMob_openMenu()
{
    var jqOverlay = $('#bxFMob_overlay');
    var jqBar = $('#bxFMob');

    var state = utlEvalAsBool(jqOverlay.attr('data-menu-open'));

    if(state === false)
    {
        jqBar.removeClass('bx_use_trans');
        jqOverlay.attr('data-menu-open', 'true');
        jqBar.attr('data-menu-open', 'true');
        $('body').attr('data-no-scroll', 'true');
    }
    else
    {
        jqOverlay.attr('data-menu-open', 'false');
        jqBar.attr('data-menu-open', 'false');
        $('body').attr('data-no-scroll', 'false');
        setTimeout(function(){$('#bxFMob').addClass('bx_use_trans'); }, 300);
    }

}

/////////////////////////////////////////////////////////////////

function initBase_loc_()
{
    window.__loc__ = {};
    window.__loc__.search = window.location.search;

    var tmpSearch = window.location.search;

    var urlParams = {};

    var vars;
    try {
        vars = (tmpSearch.substring(1)  || '').split("&");
        for(var q = 0; q < vars.length; q++)
        {
            vars[q] = decodeURIComponent(vars[q]);
        }
    }
    catch(e)
    {
        var s = (tmpSearch.substring(1)  || '').replace('%', '');
        vars = s.split("&");
    }

    var pair, arr;
    for (var i=0; i<vars.length; i++)
    {
        pair = vars[i].split("=");
        if( ((''+pair[0]).length === 0)  || ((''+pair[1]).length === 0))
            continue;

        if (typeof urlParams[pair[0]] === "undefined")
        {
            urlParams[pair[0]] = pair[1];
        }
        else if (typeof urlParams[pair[0]] === "string")
        {
            arr = [ urlParams[pair[0]], pair[1] ];
            urlParams[pair[0]] = arr;
        }
        else {
            urlParams[pair[0]].push(pair[1]);
        }
    }

    window.__loc__.urlParams = urlParams;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function()
{
    if(window.__loc__ === undefined)
        initBase_loc_();

    if(window.auto_choose_lang !== undefined)
        auto_choose_lang();

     if(__loc__.urlParams !== undefined)
     {
         if(__loc__.urlParams.bxref !== undefined)
             utlX_writeCookie('_bxref', __loc__.urlParams.bxref, 14);

         if(__loc__.urlParams.utm_campaign !== undefined)
             utlX_writeCookie('_bx_campaign', __loc__.urlParams.utm_campaign, 14);
     }

     var docRef = document.referrer;
     if( (docRef.search('www.booxi.com') === -1 ) && (docRef !== ''))
     {
         utlX_writeCookie('_bxdocref', docRef, 14);
     }


    if(window.coreLite_onReady !== undefined)
        window.coreLite_onReady();
});
