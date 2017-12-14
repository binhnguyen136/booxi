/*!
 * numeral.js
 * version : 1.5.3
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 *
 * BXFork
 * bxVer : 0.2
 * Extended Currency Support
 * authoer : Peter Zsurka
 */



(function () {

    /************************************
     Constants
     ************************************/

    var numeral,
        VERSION = '1.5.3',
    // internal storage for language config files
        languages = {},
        currencies = {},
        currentLanguage = 'en',
        currentCurrency = 'CAD',
        zeroFormat = null,
        defaultFormat = '0,0',
    // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    /************************************
     Constructors
     ************************************/

        // Numeral prototype object
    function Numeral (number) {
        this._value = number;
    }

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
     * problems for accounting- and finance-related software.
     */
    function toFixed (value, precision, roundingFunction, optionals) {
        var power = Math.pow(10, precision),
            optionalsRegExp,
            output;

        //roundingFunction = (roundingFunction !== undefined ? roundingFunction : Math.round);
        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (roundingFunction(value * power) / power).toFixed(precision);

        if (optionals) {
            optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
            output = output.replace(optionalsRegExp, '');
        }

        return output;
    }

    /************************************
     Formatting
     ************************************/

        // determine what type of formatting we need to do
    function formatNumeral (n, format, roundingFunction) {
        var output;

        // figure out what kind of format we are dealing with
        if (format.indexOf('$') > -1) { // currency!!!!!
            output = formatCurrency(n, format, roundingFunction);
        } else if (format.indexOf('%') > -1) { // percentage
            output = formatPercentage(n, format, roundingFunction);
        } else if (format.indexOf(':') > -1) { // time
            output = formatTime(n, format);
        } else { // plain ol' numbers or bytes
            output = formatNumber(n._value, format, roundingFunction);
        }

        // return string
        return output;
    }

    // revert to number
    function unformatNumeral (n, string) {
        var stringOriginal = string,
            thousandRegExp,
            millionRegExp,
            billionRegExp,
            trillionRegExp,
            suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            bytesMultiplier = false,
            power;

        if (string.indexOf(':') > -1) {
            n._value = unformatTime(string);
        } else {
            if (string === zeroFormat) {
                n._value = 0;
            } else {
                if (languages[currentLanguage].delimiters.decimal !== '.') {
                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
                }

                // see if abbreviations are there so that we can multiply to the correct number

                thousandRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + currencies[currentCurrency].symbol + ')?(?:\\))?)?$');
                millionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + currencies[currentCurrency].symbol + ')?(?:\\))?)?$');
                billionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + currencies[currentCurrency].symbol + ')?(?:\\))?)?$');
                trillionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + currencies[currentCurrency].symbol + ')?(?:\\))?)?$');

                // see if bytes are there so that we can multiply to the correct number
                for (power = 0; power <= suffixes.length; power++) {
                    bytesMultiplier = (string.indexOf(suffixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

                    if (bytesMultiplier) {
                        break;
                    }
                }

                // do some math to create our number
                n._value = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * (((string.split('-').length + Math.min(string.split('(').length-1, string.split(')').length-1)) % 2)? 1: -1) * Number(string.replace(/[^0-9\.]+/g, ''));

                // round if we are talking about bytes
                n._value = (bytesMultiplier) ? Math.ceil(n._value) : n._value;
            }
        }
        return n._value;
    }

    function formatCurrency (n, format, roundingFunction) {
        var symbolIndex = format.indexOf('$'),
            openParenIndex = format.indexOf('('),
            minusSignIndex = format.indexOf('-'),
            space = '',
            spliceIndex,
            symbol_str,
            output;

        if(languages[currentLanguage].supportedCurrency.indexOf(currentCurrency) != -1)
        {
            symbol_str = currencies[currentCurrency].symbol;
        }
        else
        {
            var tmpKey = (''+currentLanguage).substr(0, 2);
            if(currencies[currentCurrency].locale[tmpKey] !== undefined)
                symbol_str = currencies[currentCurrency].locale[tmpKey];
            else
                symbol_str = currencies[currentCurrency].locale.def;
        }

        // format the number
        output = formatNumber(n._value, format, roundingFunction);

        if(languages[currentLanguage].symbolIsAfter === true)
            output += ' ' + symbol_str;
        else
            output = symbol_str + output;

        return output;
    }

    function formatPercentage (n, format, roundingFunction) {
        var space = '',
            output,
            value = n._value * 100;

        // check for space before %
        if (format.indexOf(' %') > -1) {
            space = ' ';
            format = format.replace(' %', '');
        } else {
            format = format.replace('%', '');
        }

        output = formatNumber(value, format, roundingFunction);

        if (output.indexOf(')') > -1 ) {
            output = output.split('');
            output.splice(-1, 0, space + '%');
            output = output.join('');
        } else {
            output = output + space + '%';
        }

        return output;
    }

    function formatTime (n) {
        var hours = Math.floor(n._value/60/60),
            minutes = Math.floor((n._value - (hours * 60 * 60))/60),
            seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    }

    function unformatTime (string) {
        var timeArray = string.split(':'),
            seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }

    function formatNumber (value, format, roundingFunction) {
        var negP = false,
            signed = false,
            optDec = false,
            abbr = '',
            abbrK = false, // force abbreviation to thousands
            abbrM = false, // force abbreviation to millions
            abbrB = false, // force abbreviation to billions
            abbrT = false, // force abbreviation to trillions
            abbrForce = false, // force abbreviation
            bytes = '',
            ord = '',
            abs = Math.abs(value),
            suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            min,
            max,
            power,
            w,
            precision,
            thousands,
            d = '',
            neg = false;

        // check if number is zero and a custom zero format has been set
        if (value === 0 && zeroFormat !== null) {
            return zeroFormat;
        } else {
            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (format.indexOf('(') > -1) {
                negP = true;
                format = format.slice(1, -1);
            } else if (format.indexOf('+') > -1) {
                signed = true;
                format = format.replace(/\+/g, '');
            }

            // see if abbreviation is wanted
            if (format.indexOf('a') > -1) {
                // check if abbreviation is specified
                abbrK = format.indexOf('aK') >= 0;
                abbrM = format.indexOf('aM') >= 0;
                abbrB = format.indexOf('aB') >= 0;
                abbrT = format.indexOf('aT') >= 0;
                abbrForce = abbrK || abbrM || abbrB || abbrT;

                // check for space before abbreviation
                if (format.indexOf(' a') > -1) {
                    abbr = ' ';
                    format = format.replace(' a', '');
                } else {
                    format = format.replace('a', '');
                }

                if (abs >= Math.pow(10, 12) && !abbrForce || abbrT) {
                    // trillion
                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
                    value = value / Math.pow(10, 12);
                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !abbrForce || abbrB) {
                    // billion
                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
                    value = value / Math.pow(10, 9);
                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !abbrForce || abbrM) {
                    // million
                    abbr = abbr + languages[currentLanguage].abbreviations.million;
                    value = value / Math.pow(10, 6);
                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !abbrForce || abbrK) {
                    // thousand
                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
                    value = value / Math.pow(10, 3);
                }
            }

            // see if we are formatting bytes
            if (format.indexOf('b') > -1) {
                // check for space before
                if (format.indexOf(' b') > -1) {
                    bytes = ' ';
                    format = format.replace(' b', '');
                } else {
                    format = format.replace('b', '');
                }

                for (power = 0; power <= suffixes.length; power++) {
                    min = Math.pow(1024, power);
                    max = Math.pow(1024, power+1);

                    if (value >= min && value < max) {
                        bytes = bytes + suffixes[power];
                        if (min > 0) {
                            value = value / min;
                        }
                        break;
                    }
                }
            }

            // see if ordinal is wanted
            if (format.indexOf('o') > -1) {
                // check for space before
                if (format.indexOf(' o') > -1) {
                    ord = ' ';
                    format = format.replace(' o', '');
                } else {
                    format = format.replace('o', '');
                }

                ord = ord + languages[currentLanguage].ordinal(value);
            }

            if (format.indexOf('[.]') > -1) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            w = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');

            if (precision) {
                if (precision.indexOf('[') > -1) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    d = toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    d = toFixed(value, precision.length, roundingFunction);
                }

                w = d.split('.')[0];

                if (d.split('.')[1].length) {
                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
                } else {
                    d = '';
                }

                if (optDec && Number(d.slice(1)) === 0) {
                    d = '';
                }
            } else {
                w = toFixed(value, null, roundingFunction);
            }

            // format number
            if (w.indexOf('-') > -1) {
                w = w.slice(1);
                neg = true;
            }

            if (thousands > -1) {
                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                w = '';
            }

            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + ((!neg && signed) ? '+' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
        }
    }

    /************************************
     Top Level Functions
     ************************************/

    numeral = function (input) {
        if (numeral.isNumeral(input)) {
            input = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            input = 0;
        } else if (!Number(input)) {
            input = numeral.fn.unformat(input);
        }

        return new Numeral(Number(input));
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    numeral.language = function (key, values) {
        if (!key) {
            return currentLanguage;
        }

        if (key && !values) {
            if(!languages[key])
            {
                if(key.length > 2)
                {
                    var tmpKey = (''+key).substr(0, 2);
                    if(languages[tmpKey] !== undefined)
                        currentLanguage = tmpKey;
                    else
                        throw new Error('Unknown language : ' + tmpKey);
                }
                else
                {
                    throw new Error('Unknown language : ' + key);
                }
            }
            else
                currentLanguage = key;
        }

        if (values || !languages[key]) {
            loadLanguage(key, values);
        }

        return numeral;
    };

    //same but for currency
    numeral.currency = function (key, values) {
        if (!key) {
            return currentCurrency;
        }

        if (key && !values)
        {
            if(!currencies[key])
            {
                //throw new Error('Unknown currency : ' + key);
                currentCurrency = 'CAD'
            }
            currentCurrency = key;
        }

        if (values || !currencies[key]) {
            loadCurrency(key, values);
        }

        return numeral;
    };

    numeral.testCurrency = function (key)
    {
        if(currencies[key] === undefined)
            return false;
        else
            return true;
    };

    //Expects two arguments as string
    //arg1 : language or full locale this matches a locale Definition.
    //Locale should be defined as 'en_CA' but formats like 'en-ca' will be reformatted
    //Currency is a 3 char currency code ex: USD
    numeral.setLocaleCurrency = function(locale, curCode)
    {
        if( (locale === undefined) || (curCode === undefined))
            return;

        this.currency( (''+curCode).toUpperCase() ); // apply currency code

        var lc = (''+locale).toLowerCase();
        lc = lc.trim();

        if(lc.length == 2)
        {
            this.language(lc);
            return;
        }

        if(lc.length >= 4)
        {
            var formattedLC = (lc.slice(0, 2)).toLowerCase() + '_' + (lc.slice(-2)).toUpperCase();
            this.language(formattedLC);
            return;
        }

        this.language(formattedLC);
    };

    // This function provides access to the loaded language data.  If
    // no arguments are passed in, it will simply return the current
    // global language object.
    numeral.languageData = function (key) {
        if (!key) {
            return languages[currentLanguage];
        }

        if (!languages[key])
        {
            if(key.length > 2)
            {
                var tmpKey = (''+key).substr(0, 2);
                if(languages[tmpKey] !== undefined)
                    return languages[tmpKey];
            }

            throw new Error('Unknown language : ' + key);
        }

        return languages[key];
    };

    // as lang but for currency
    numeral.currencyData = function (key) {
        if (!key) {
            return currencies[currentCurrency];
        }

        if (!currencies[key]) {
            throw new Error('Unknown currency : ' + key);
        }

        return currencies[key];
    };

    numeral.language('fr', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: { thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: [],
        ordinal : function (number) {
            return number === 1 ? 'er' : 'ème';
        }
    });

    numeral.language('fr_CA', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['CAD']
    });

    var defFranceTerritories = {delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['EUR']};

    numeral.language('fr_FR', defFranceTerritories);
    numeral.language('fr_GF', defFranceTerritories);
    numeral.language('fr_MQ', defFranceTerritories);
    numeral.language('fr_GP', defFranceTerritories);

    numeral.language('fr_BE', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['EUR']
    });

    numeral.language('en', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: [],
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                    (b === 2) ? 'nd' :
                        (b === 3) ? 'rd' : 'th';
        }
    });

    numeral.language('en_GY', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['GYD']
    });

    numeral.language('en_CA', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['CAD']
    });

    numeral.language('en_US', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['USD']
    });

    numeral.language('en_GB', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['GBP']
    });

    numeral.language('en_AU', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['AUD']
    });

    numeral.language('en_NZ', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['NZD']
    });


    numeral.language('es', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: [],
        ordinal: function (number) {
            var b = number % 10;
            return (b === 1 || b === 3) ? 'er' :
                (b === 2) ? 'do' :
                    (b === 7 || b === 0) ? 'mo' :
                        (b === 8) ? 'vo' :
                            (b === 9) ? 'no' : 'to';
        }
    });

    numeral.language('es_ES', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['EUR']
    });

    numeral.language('es_MX', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['MXN']
    });

    numeral.language('es_AR', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['ARS']
    });

    numeral.language('es_CO', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['COP']
    });

    numeral.language('es_CH', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['CLP']
    });

    numeral.language('es_PA', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['PAB']
    });

    numeral.language('es_PR', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['USD']
    });

    numeral.language('es_CR', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: { thousand: 'k', million: 'mm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['CRC']
    });


    numeral.language('nl', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['EUR'],
        ordinal: function (number) {
            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
        }
    });


    numeral.language('pt', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['EUR'],
        ordinal: function (number) {
            return number+'º';
        }
    });


    numeral.language('pt_BR', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['BRL'],
        ordinal: function (number) {
            return number+'º';
        }
    });


    //new

    // India
    numeral.language('en_IN', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['INR']
    });

    numeral.language('fr_IN', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['INR']
    });

    // Norway
    numeral.language('en_NO', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['NOK']
    });

    numeral.language('fr_NO', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['NOK']
    });

    // Paraguay
    numeral.language('en_PY', {
        delimiters: {thousands: ',', decimal: ''},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['PYG']
    });

    // Paraguay
    numeral.language('fr_PY', {
        delimiters: {thousands: ' ', decimal: ''},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['PYG']
    });

    // Paraguay
    numeral.language('es_PY', {
        delimiters: {thousands: '.', decimal: ''},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['PYG']
    });

    // Qatar
    numeral.language('en_QA', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['QAR']
    });

    // Qatar
    numeral.language('fr_QA', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['QAR']
    });

    // Singapore
    numeral.language('en_SG', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['SGD']
    });

    // Singapore
    numeral.language('fr_SG', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['SGD']
    });

    // South Africa
    numeral.language('en_ZA', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['ZAR']
    });

    numeral.language('fr_ZA', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['ZAR']
    });

    // The Bahamas
    numeral.language('en_BS', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['BSD']
    });

    // The Bahamas
    numeral.language('fr_BS', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['BSD']
    });

    // The Bahamas
    numeral.language('es_BS', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['BSD']
    });

    // United Arab Emirates
    numeral.language('en_AE', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['AED']
    });

    // United Arab Emirates
    numeral.language('fr_AE', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['AED']
    });

    // Uruguay
    numeral.language('en_UY', {
        delimiters: {thousands: ',', decimal: '.'},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['UYU']
    });

    // Uruguay
    numeral.language('fr_UY', {
        delimiters: {thousands: ' ', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: true,
        supportedCurrency: ['UYU']
    });

    // Uruguay
    numeral.language('es_UY', {
        delimiters: {thousands: '.', decimal: ','},
        abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
        symbolIsAfter: false,
        supportedCurrency: ['UYU']
    });

    // NEW NEW NEW

    function genCurrencySettings(delim_thou, delim_dec, isAfter, currList)
    {
        return {
            delimiters: {thousands: delim_thou, decimal: delim_dec},
            abbreviations: {thousand: 'k', million: 'm', billion: 'b', trillion: 't'},
            symbolIsAfter: isAfter,
            supportedCurrency: currList
        };
    }

    // -- Dominican Republic
    numeral.language('en_DO', genCurrencySettings(',', '.', false, ['DOP']));
    numeral.language('fr_DO', genCurrencySettings(' ', ',', true,  ['DOP']));
    numeral.language('es_DO', genCurrencySettings(',', '.', false, ['DOP']));

    // -- Saudi Arabia
    numeral.language('en_SA', genCurrencySettings(',', '.', true, ['SAR']));
    numeral.language('fr_SA', genCurrencySettings(' ', ',', true,  ['SAR']));
    numeral.language('es_SA', genCurrencySettings(',', '.', false, ['SAR']));

    // -- Malasia
    numeral.language('en_MY', genCurrencySettings(',', '.', false, ['MYR']));
    numeral.language('fr_MY', genCurrencySettings(' ', ',', true,  ['MYR']));
    numeral.language('es_MY', genCurrencySettings(',', '.', false, ['MYR']));

    // -- Kenya
    numeral.language('en_KE', genCurrencySettings(',', '.', false, ['KES']));
    numeral.language('fr_KE', genCurrencySettings(' ', ',', true,  ['KES']));
    numeral.language('es_KE', genCurrencySettings(',', '.', false, ['KES']));

    // -- Iceland
    numeral.language('en_IS', genCurrencySettings(',', '.', false, ['ISK']));
    numeral.language('fr_IS', genCurrencySettings(' ', ',', true,  ['ISK']));
    numeral.language('es_IS', genCurrencySettings(',', '.', false, ['ISK']));

    // -- Indonesia
    numeral.language('en_ID', genCurrencySettings(',', '.', false, ['IDR']));
    numeral.language('fr_ID', genCurrencySettings(' ', ',', true,  ['IDR']));
    numeral.language('es_ID', genCurrencySettings(',', '.', false, ['IDR']));

    // -- Morocco
    numeral.language('en_MA', genCurrencySettings(',', '.', false, ['MAD']));
    numeral.language('fr_MA', genCurrencySettings(' ', ',', true,  ['MAD']));
    numeral.language('es_MA', genCurrencySettings(',', '.', false, ['MAD']));

    // -- Tunsia
    numeral.language('en_TN', genCurrencySettings(',', '.', false, ['TND']));
    numeral.language('fr_TN', genCurrencySettings(' ', ',', true,  ['TND']));
    numeral.language('es_TN', genCurrencySettings(',', '.', false, ['TND']));

    // -- Algeria
    numeral.language('en_DZ', genCurrencySettings(',', '.', false, ['DZD']));
    numeral.language('fr_DZ', genCurrencySettings(' ', ',', true,  ['DZD']));
    numeral.language('es_DZ', genCurrencySettings(',', '.', false, ['DZD']));

    // -- Peru
    numeral.language('en_PE', genCurrencySettings(',', '.', false, ['PEN']));
    numeral.language('fr_PE', genCurrencySettings(' ', ',', true,  ['PEN']));
    numeral.language('es_PE', genCurrencySettings(',', '.', false, ['PEN']));

    // -- Vietnam
    numeral.language('en_VN', genCurrencySettings(',', '.', false, ['VND']));
    numeral.language('fr_VN', genCurrencySettings(' ', ',', true,  ['VND']));
    numeral.language('es_VN', genCurrencySettings(',', '.', false, ['VND']));

    // -- Thailand
    numeral.language('en_TH', genCurrencySettings(',', '.', false, ['THB']));
    numeral.language('fr_TH', genCurrencySettings(' ', ',', true,  ['THB']));
    numeral.language('es_TH', genCurrencySettings(',', '.', false, ['THB']));

    // -- Philippines
    numeral.language('en_PH', genCurrencySettings(',', '.', false, ['PHP']));
    numeral.language('fr_PH', genCurrencySettings(' ', ',', true,  ['PHP']));
    numeral.language('es_PH', genCurrencySettings(',', '.', false, ['PHP']));

    // -- Lebanon
    numeral.language('en_LB', genCurrencySettings(',', '.', false, ['LBP']));
    numeral.language('fr_LB', genCurrencySettings(' ', ',', true,  ['LBP']));
    numeral.language('es_LB', genCurrencySettings(',', '.', false, ['LBP']));

    // -- Turkey
    numeral.language('en_TR', genCurrencySettings(',', '.', false, ['TRY']));
    numeral.language('fr_TR', genCurrencySettings(' ', ',', true,  ['TRY']));
    numeral.language('es_TR', genCurrencySettings(',', '.', false, ['TRY']));

    // -- ECADOR
    numeral.language('en_EC', genCurrencySettings(',', '.', false, ['USD']));
    numeral.language('fr_EC', genCurrencySettings(' ', ',', true,  ['USD']));
    numeral.language('es_EC', genCurrencySettings(',', '.', false, ['USD']));




    // ------------------------------------------


    numeral.currency('CAD', { symbol: '$', locale: {fr:'$CA', def:'CA$'}  });
    numeral.currency('USD', { symbol: '$', locale: {en: 'US$', fr:' $US', es:'US$', def:'US$'}  });
    numeral.currency('EUR', { symbol: '€', locale: {def:'€'} });
    numeral.currency('ARS', { symbol: '$', locale: {en: 'ARS', fr:'ARS', es:'AR$', def:'ARS'}  });
    numeral.currency('AUD', { symbol: '$', locale: {fr:'$AU', es:'AU$', def:'A$'}  });
    numeral.currency('BGN', { symbol: 'лв', locale: {def:'BGN'}  });
    numeral.currency('BMD', { symbol: '$', locale: {def:'BMD'} });
    numeral.currency('BRL', { symbol: 'R$', locale: {en: 'R$', def:'R$'} });
    numeral.currency('CHF', { symbol: 'CHF', locale: {def:'CHF'} });
    numeral.currency('CLP', { symbol: '$', locale: {def:'CLP'} });
    numeral.currency('COP', { symbol: '$', locale: {def:'COP'} });
    numeral.currency('CRC', { symbol: '₡', locale: {def:'CRC'} });
    numeral.currency('CZK', { symbol: 'Kč', locale: {def:'CZK'} });
    numeral.currency('GBP', { symbol: '£', locale: {fr:'£UK', def:'£'} });
    numeral.currency('HRK', { symbol: 'kn', locale: {def:'HRK'} });
    numeral.currency('HUF', { symbol: 'Ft', locale: {def:'HUF'} });
    numeral.currency('ILS', { symbol: '₪', locale: {def:'₪'} });
    numeral.currency('MXN', { symbol: '$', locale: { fr:'$MEX', def:'MX$'}  });
    numeral.currency('NZD', { symbol: '$', locale: { fr:'$NZ', def:'NZ$'} });
    numeral.currency('PAB', { symbol: 'B/.', locale: { def:'PAB'} });
    numeral.currency('PLN', { symbol: 'zł', locale: {def:'PLN'} });
    numeral.currency('RON', { symbol: 'lei', locale: {def:'RON'} });
    numeral.currency('SEK', { symbol: 'kr', locale: {def:'SEK'} });
    numeral.currency('DKK', { symbol: 'kr.', locale: {def:'DKK'} });
    numeral.currency('GYD', { symbol: '$', locale: {def:'G$'} });

    numeral.currency('INR', { symbol: '₹', locale: { def:'₹'} });
    numeral.currency('NOK', { symbol: 'kr', locale: {def:'kr'} });
    numeral.currency('PYG', { symbol: '₲', locale: {def:'₲'} });
    numeral.currency('QAR', { symbol: 'ر.ق', locale: { def:'QR'} });
    numeral.currency('SGD', { symbol: '$', locale: {en:'S$', fr:'$SG', def:'S$'} });
    numeral.currency('ZAR', { symbol: 'R', locale: {def:'R'} });
    numeral.currency('BSD', { symbol: '$', locale: { def:'$'} });
    numeral.currency('AED', { symbol: 'د.إ', locale: { def:'AED'} });
    numeral.currency('UYU', { symbol: '$', locale: {es:'$', def:'$U'} });

    // NEW OCT 2017
    numeral.currency('DOP', { symbol: 'RD$', locale: { def:'RD$'} });
    numeral.currency('SAR', { symbol: '﷼', locale: { def:'﷼'} });
    numeral.currency('MYR', { symbol: 'RM', locale: { def:'RM'} });
    numeral.currency('KES', { symbol: 'KSh', locale: { def:'KSh'} });
    numeral.currency('ISK', { symbol: 'kr', locale: { def:'kr'} });
    numeral.currency('IDR', { symbol: 'Rp', locale: { def:'Rp'} });
    numeral.currency('MAD', { symbol: 'DH', locale: { def:'DH'} });
    numeral.currency('TND', { symbol: 'DT', locale: { def:'DT'} });
    numeral.currency('DZD', { symbol: 'DA', locale: { def:'DA'} });
    numeral.currency('PEN', { symbol: 'S/.', locale: { def:'S/.'} });
    numeral.currency('VND', { symbol: '₫', locale: { def:'₫'} });
    numeral.currency('THB', { symbol: '฿', locale: { def:'฿'} });
    numeral.currency('PHP', { symbol: '₱', locale: { def:'₱'} });
    numeral.currency('LBP', { symbol: 'ل.ل', locale: { def:'ل.ل'} });
    numeral.currency('TRY', { symbol: '₺', locale: { def:'₺'} });


    numeral.zeroFormat = function (format) {
        zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function (format) {
        defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    /************************************
     Helpers
     ************************************/

    function loadLanguage(key, values) {
        languages[key] = values;
    }

    function loadCurrency(key, values) {
        currencies[key] = values;
    }

    /************************************
     Floating-point helpers
     ************************************/

    // The floating-point helper functions and implementation
    // borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

    /**
     * Array.prototype.reduce for browsers that don't support it
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
     */
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, opt_initialValue) {
            'use strict';

            if (null === this || 'undefined' === typeof this) {
                // At the moment all modern browsers, that support strict mode, have
                // native implementation of Array.prototype.reduce. For instance, IE8
                // does not support strict mode, so this check is actually useless.
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }

            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }

            var index,
                value,
                length = this.length >>> 0,
                isValueSet = false;

            if (1 < arguments.length) {
                value = opt_initialValue;
                isValueSet = true;
            }

            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    } else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }

            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }

            return value;
        };
    }


    /**
     * Computes the multiplier necessary to make x >= 1,
     * effectively eliminating miscalculations caused by
     * finite precision.
     */
    function multiplier(x) {
        var parts = x.toString().split('.');
        if (parts.length < 2) {
            return 1;
        }
        return Math.pow(10, parts[1].length);
    }

    /**
     * Given a variable number of arguments, returns the maximum
     * multiplier that must be used to normalize an operation involving
     * all of them.
     */
    function correctionFactor() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function (prev, next) {
            var mp = multiplier(prev),
                mn = multiplier(next);
            return mp > mn ? mp : mn;
        }, -Infinity);
    }


    /************************************
     Numeral Prototype
     ************************************/


    numeral.fn = Numeral.prototype = {

        clone : function () {
            return numeral(this);
        },

        format : function (inputString, roundingFunction) {
            return formatNumeral(this,
                inputString ? inputString : defaultFormat,
                (roundingFunction !== undefined) ? roundingFunction : Math.round
            );
        },

        unformat : function (inputString) {
            if (Object.prototype.toString.call(inputString) === '[object Number]') {
                return inputString;
            }
            return unformatNumeral(this, inputString ? inputString : defaultFormat);
        },

        value : function () {
            return this._value;
        },

        valueOf : function () {
            return this._value;
        },

        set : function (value) {
            this._value = Number(value);
            return this;
        },

        add : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum + corrFactor * curr;
            }
            this._value = [this._value, value].reduce(cback, 0) / corrFactor;
            return this;
        },

        subtract : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum - corrFactor * curr;
            }
            this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;
            return this;
        },

        multiply : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) * (curr * corrFactor) /
                    (corrFactor * corrFactor);
            }
            this._value = [this._value, value].reduce(cback, 1);
            return this;
        },

        divide : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) / (curr * corrFactor);
            }
            this._value = [this._value, value].reduce(cback);
            return this;
        },

        difference : function (value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }

    };

    /************************************
     Exposing Numeral
     ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = numeral;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `numeral` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this['numeral'] = numeral;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return numeral;
        });
    }
}).call(this);
