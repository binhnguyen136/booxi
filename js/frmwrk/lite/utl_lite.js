function utlTestAs_nonNull(val)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    if(val === '')
        return false;

    return true;
}

function utlAsInt(val)
{
    var num = parseInt(val, 10);
    return (isNaN(num)) ? 0 : num;
}

function utlAsInt_nullOnNaN(val)
{
    if(val === undefined)
        return null;

    var num = parseInt(val, 10);

    if(isNaN(num))
        return null;

    return  num;
}

function utlAsFloat(val)  { return parseFloat(val); }
function utlAsString(val) { return ('' + val); }

function utlParseInt_withFallback(origVal, fbVal)
{
    var num = parseInt(origVal, 10);

    if(isNaN(num))
        return fbVal;

    return num;
}

function utlArray_removeDuplicates(arr)
{
    return arr.sort().filter(function(item, pos, ary)
    {
        return !pos || item != ary[pos - 1];
    });
}

function utlArrayIndexOf(match, arr)
{
    if( utlIsVarArray(arr) === false )
        return -1;

    if(arr.indexOf === undefined)
    {
        var cnt = arr.length;
        for(var i = 0; i < cnt; i++)
        {
            if(arr[i] == match)
                return i;
        }
        return -1;
    }

    return arr.indexOf(match);
}

function utlFilterArray(sourceArray, filterArray)
{
    if( (utlIsVarArray(sourceArray) === false) || (utlIsVarArray(filterArray) === false) )
        return sourceArray;

    var cnt = sourceArray.length;
    var tArr = [];

    for(var i = 0; i < cnt; i++)
    {
        if( filterArray.indexOf(sourceArray[i]) == -1 )
        {
            tArr.push(sourceArray[i]);
        }
    }

    return tArr;
}

function utlFindMatchingElements_inArray(sourceArray, filterArray)
{
    if( (utlIsVarArray(sourceArray) === false) || (utlIsVarArray(filterArray) === false) )
        return sourceArray;

    var cnt = sourceArray.length;
    var tArr = [];

    for(var i = 0; i < cnt; i++)
    {
        if( filterArray.indexOf(sourceArray[i]) !== -1 )
        {
            tArr.push(sourceArray[i]);
        }
    }

    return tArr;
}

function utlCopyArray(sourceArray)
{
    if(utlIsVarArray(sourceArray) === false)
        return []; //simply return an empty array;

    return sourceArray.slice(0);
}

function utlIsVarArray(testVar)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    return ( Object.prototype.toString.call( testVar ) === '[object Array]'  );
}

function utlIsVarString(testVar)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    return ( Object.prototype.toString.call( testVar ) === '[object String]' );
}

function utlIsVarString_notEmpty(testVar)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    if(Object.prototype.toString.call( testVar ) !== '[object String]')
        return false;

    return ( (utlTrimWhiteSpace_edge(testVar, true)).length !== 0);
}

function utlIsVarNumber(testVar)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    return ( Object.prototype.toString.call( testVar ) === '[object Number]' );
}

function utlIsVarObject(testVar)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    return ( Object.prototype.toString.call( testVar ) === '[object Object]' );
}

function utlIsVarFunction(testVar)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    return ( Object.prototype.toString.call( testVar ) === '[object Function]' );
}

function utlIsVarBoolean(testVar)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    return ( Object.prototype.toString.call( testVar ) === '[object Boolean]' );
}

function utlIsVarDate(testVar)
{
    if( (arguments[0] === undefined) || (arguments[0] === null) )
        return false;

    return ( Object.prototype.toString.call( testVar ) === '[object Date]' );
}

function utlRemoveInvalidObjectProps(obj, arrInvalid)
{
    for(var i in obj)
    {
        if(arrInvalid.indexOf(obj[i]) != -1)
        {
            delete obj[i];
        }
    }

    return obj;
}

function utlEvalAsInt(val, match)
{
    if( !utlIsNot(val, [undefined, null, '']) || !utlIsNot(match, [undefined, null, '']) )
        return false;

    var v = parseInt(val, 10);

    if(isNaN(v))
        return false;

    return (v == match);
}

function utlBoolToString(val)
{
    return (''+(val === true));
}

function utlEvalAsBool(val)
{
    if(typeof val == "boolean")
        return val;

    if(typeof val == "string")
        return ((''+val).toLowerCase() === 'true');

    return false;
}

function utlMustacheReplace(haystack, needle, replacer)
{
    var rg = new RegExp('\{\{'+needle+'\}\}',"g");
    var t2 = (''+haystack).replace(rg, replacer);
    return t2;
}

function utlMustacheMatch(text)
{
    var matchList = (''+text).match(/\{\{(.*?)\}\}/g);

    if(utlIsVarArray(matchList) === false)
        return [];

    return matchList.map(function(val){
        return val.replace(/(\{\{|\}\})/g,'');
    });
}

function utlTrimWhiteSpace(str, b_allSpace)
{
    if(b_allSpace === true)
        return (''+str).replace(/\s/g, '');
    else
        return (''+str).replace(/\s/g, ' ');
}

function utlTrimWhiteSpace_edge(str, b_allSpace)
{
    if(b_allSpace === true)
        return (''+str).replace(/(^\s+|\s+$)/g,'');
    else
        return (''+str).replace(/(^\s+|\s+$)/g,' ');
}

function utlLC(str) { return (''+str).toLowerCase(); }
function utlUC(str) { return (''+str).toUpperCase(); }

function randomString() {

    var rndOut = '';
    var len = 5;

    if('undefined' !== typeof arguments[0])
        len = arguments[0];

    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomPoz;
    for (var i = 0; i < len; i++)
    {
        randomPoz = Math.floor(Math.random() * charSet.length);
        rndOut += charSet.substring(randomPoz,randomPoz+1);
    }
    return rndOut;
}

function utlSmartDecodeJson(val, onFailReturnVal)
{
    var jsonObj = {};

    if(utlIsVarObject(val) === true)
        return val;

    if((val === undefined) || (val === null) || (val === ''))
    {
        return (onFailReturnVal !== undefined) ? onFailReturnVal : jsonObj;
    }

    if( utlIsVarString(val) !== true )
    {
        return (onFailReturnVal !== undefined) ? onFailReturnVal : val; // in case already parsed
    }

    try { jsonObj = JSON.parse(val); }
    catch (e)
    {
        //console.warm('JSON Parse Error : Malformed json string');
        if(onFailReturnVal !== undefined)
            return onFailReturnVal;
    }

    return jsonObj;
}

function utlSmartEncodeJson(val)
{
    if( utlIsVarString(val) === true )
        return val;

    return JSON.stringify(val);
}

// OTHER -----------------

function utlX_writeCookie(name, value, days)
{
    var expires = "";
    if(days)
    {
        var date = new Date();
        date.setDate(date.getDate()+days);
        expires = "; expires="+date.toUTCString();
    }

    window.document.cookie = name+"="+value+expires+";domain=.booxi.com;path=/";
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

function utlHttpPost(reqPath, reqData, on_success, on_error)
{
    var request = {
        url:reqPath,
        dataType: 'json',
        type: "POST",
        data: reqData,
        cache: false
    };

    if(on_success !== undefined)
        request.success = on_success;

    if(on_error !== undefined)
        request.error = on_error;

    $.ajax(request);
}


// BX LANG METHODS

//good
function utlBxLang(bx_lang)
{
    if( (lang[bx_lang] === undefined) || (bx_lang === '') )
        return '';

    return lang[bx_lang];
}

//good
function utlWrpSpanByBxLang(bx_lang)
{
    if( (lang[bx_lang] === undefined) || (bx_lang === '') )
        return '';

    return '<span bx_lang="'+bx_lang+'">'+lang[bx_lang]+'</span>';
}

//good
function utlWrpSpanByBxLangClass(bx_lang, classname, format)
{
    if( (lang[bx_lang] === undefined) || (bx_lang === '') )
        return '';

    return '<span class="'+classname+'" bx_lang="'+bx_lang+'">'+lang[bx_lang]+'</span>';
}

function cloneBaseObject(obj)
{
    var copy = {};

    if ( (null === obj) || ("object" != typeof obj) )
        return obj;

    for (var attr in obj)
    {
        if (obj.hasOwnProperty(attr))
            copy[attr] = cloneBaseObject(obj[attr]);
    }
    return copy;
}


