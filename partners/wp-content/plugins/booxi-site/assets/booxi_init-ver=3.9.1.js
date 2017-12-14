// INIT Scripts for special behavior









function utlX_writeCookie(name, value, days)
{
    var expires = "";
    if(days)
    {
        var date = new Date();
        date.setDate(date.getDate()+days);
        expires = "; expires="+date.toUTCString();
    }

    window.document.cookie = name+"="+value+expires+"; path=/";
}

function utlX_readCookie(name)
{
    var target = name+"=";
    var ckArr = document.cookie.split(';');

    var ck;
    for(var i = 0; i < ckArr.length; i++)
    {
        ck = ckArr[i];
        while(ck.charAt(0)==' ') ck = ck.substring(1, ck.length);
        if (ck.indexOf(target) === 0) return ck.substring(target.length, ck.length);
    }
    return null;
}

function utlX_eraseCookie(name)
{
    this.utlX_writeCookie(name, "", -1);
}


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


function fnEvalAndProcess_urlArgs()
{

    if(window.__loc__ === undefined)
        initBase_loc_();

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

}


// DOC READY //////////////////////////////
jQuery(document).ready(function($)
{
    fnEvalAndProcess_urlArgs();

});