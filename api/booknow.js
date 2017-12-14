(function(window, undefined)
{
    var scope = this;
    var DOC = window.document;
    //var server_path = 'http://localhost:9080/';
    var server_path = 'https://www.booxi.com/';
    //var server_path = 'https://test.booxi.com/';

    var bxe_script_id = 'booxi-js-api';

    var loadState_js = false;
    var loadState_css = false;
    var cache_buster = '?ver=1-13-1';

    //https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
    var isMobileDevice = ( (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1) );

    // =================================================================================================================

    //Load WURLF
    if(window.WURFL === undefined)
    {
        var jsWurlf = document.createElement('script');
        jsWurlf.id = 'booxi-wurlf';
        jsWurlf.async = true;
        jsWurlf.src = 'https://wurfl.io/wurfl.js';
        document.getElementsByTagName('head')[0].appendChild(jsWurlf);
    }

    if(DOC.getElementById(bxe_script_id) === null)
    {
        //load script
        var bx_js = DOC.createElement('script');
        bx_js.id = bxe_script_id;
        bx_js.onload = jsOnLoad;
        bx_js.type = 'text/javascript';
        bx_js.async = true;
        bx_js.src = server_path + 'api/bxe_core_v2.js' + cache_buster;
        DOC.getElementsByTagName('head')[0].appendChild(bx_js);

        //load css

        var bx_css = DOC.createElement('link');
        bx_css.onload = cssOnLoad;
        bx_css.type = 'text/css';
        bx_css.rel = 'stylesheet';
        bx_css.href = server_path + 'api/style_v2.css' + cache_buster;
        DOC.getElementsByTagName('head')[0].appendChild(bx_css);
    }


    // -----------------------------

    function jsOnLoad()
    {
        loadState_js = true;
        //console.log('js ready');
        testLoadState();
    }

    function cssOnLoad()
    {
        loadState_css = true;
        //console.log('css ready');
        testLoadState();
    }


    function testLoadState()
    {
        //console.log('-- testing load state --');

        if( (loadState_js === true) && (loadState_css === true))
        {
            initBXE();
            return;
        }

        //console.log('JS Loaded : ' + loadState_js);
        //console.log('JS Loaded : ' + loadState_css);
    }


    function initBXE()
    {
        //console.log('INITIALZIE');
    }





})(window, undefined);
