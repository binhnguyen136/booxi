var roiCalculator = baseClass.extend ({

    c_minHour: 60,
    c_noShowPercent: 0.13,
    c_phonePercent: 0.2,

    appt_duration: null, //min
    appt_price: null,
    hours_work: null,
    hours_phone: null,
    no_shows: null,
    profit_margin: null,
    nb_staff: null,

    //------------

    init: function()
    {

    },

    fnReadForm: function()
    {
        __8trk__.logRoiEvent("Button Click", "Calculate Savings");

        var loadList = [
            {inp_id:'roi_appt_duration', vname: 'appt_duration', type:'int'},
            {inp_id:'roi_appt_price', vname: 'appt_price', type:'int'},
            {inp_id:'roi_hours_week', vname: 'hours_work', type:'int'},
            {inp_id:'roi_phone_week', vname: 'hours_phone', type:'float'},
            {inp_id:'roi_noshow_week', vname: 'no_shows', type:'float'},
            {inp_id:'roi_profit_margin', vname: 'profit_margin', type:'float'},
            {inp_id:'roi_nb_staff', vname: 'nb_staff', type:'int'}
        ];

        var cnt = loadList.length;
        var tmp;
        var key;
        for(var i = 0; i < cnt; i++)
        {
            tmp = $('#'+loadList[i].inp_id).val();

            if(this[loadList[i].vname] !== undefined)
                this[loadList[i].vname] = this.fnEvalApplyType(tmp, loadList[i].type);
        }

        //----------

        var userEmail = $('#roi_email').val();

        if(userEmail !== '')
        {
            if(regex.email.test(userEmail) === false)
            {
                $('#roi_email').attr('data-valid', 'false');
                return;
            }
        }
        else
        {
            $('#roi_email').attr('data-valid', 'false');
            return;
        }


        this.fnPush_roiData(userEmail);
        this.fnPerformCalculation();
    },

    fnPush_roiData: function(userEmail)
    {
        this.fnLogIntercom(userEmail);

    },

    fnPerformCalculation: function()
    {
        var inc_month = this.fnCalc_grossRevenue_wStaff();
        var inc_year = this.fnCalc_netRevenue_wStaff();
        var booxi_cost = (this.fnCalc_fnCalc_booxiCostPerYear()).cost;
        var roi_percent = this.fnCalc_roi();
        var revenu_lost = inc_year;
        inc_year = revenu_lost - booxi_cost;

        revenu_lost = __i18n__.fn_rawFormat2(revenu_lost, 'CAD', 'CA');
        inc_year = __i18n__.fn_rawFormat2(inc_year,  'CAD', 'CA');
        booxi_cost = __i18n__.fn_rawFormat2(booxi_cost,  'CAD', 'CA');
        roi_percent = Math.round(roi_percent * 100);// + '%';
        roi_percent = __i18n__.fn_rawFormat2(roi_percent,  'CAD', 'CA');


        var str = utlBxLang('roi_18');

        $('#roi_result_lost').parent().attr('data-use-lang', core.defLang);
        $('#roi_result_cost').parent().attr('data-use-lang', core.defLang);
        $('#roi_result_gained').parent().attr('data-use-lang', core.defLang);


        $('#roi_result_lost').text(revenu_lost);
        $('#roi_result_cost').text(booxi_cost);
        $('#roi_result_gained').text(roi_percent);


        var price_val = (''+inc_year).replace(/\s/g, '&nbsp;');
        price_val = utlWrpSpan(price_val, 'fnt_col44C fnt_w7');

        if(core.defLang === 'eng')
            price_val = utlWrpSpan('$', 'fnt_roi_dollar fnt_col44C fnt_w7') + price_val;
        else
            price_val += utlWrpSpan('&nbsp;$', 'fnt_roi_dollar fnt_col44C fnt_w7');

        var mainText = utlBxLang('roi_30');
        mainText = utlMustacheReplace(mainText, 'data-value-earning', price_val );

        mainText = utlWrpSpan(mainText);

        $('#bx_roi_title_calculate').empty().append(mainText);
        $('#roi_vc_box').attr('data-show-panel', 'none');

        setTimeout(function(){ $('#roi_vc_box').attr('data-show-panel', 'roi_result'); }, 900);

        if(core.isMobile() === true)
            $(window).scrollTop(10);
    },

    fnx_showForm: function()
    {
        $('#roi_vc_box').attr('data-show-panel', 'none');
        setTimeout(function(){ $('#roi_vc_box').attr('data-show-panel', 'roi_form'); }, 900);

        if(core.isMobile() === true)
            $(window).scrollTop(10);
    },

    fnEvalApplyType: function(val, type)
    {
        switch(type)
        {
            case 'int' :
                return utlAsInt(val);
            case 'float' :
                return utlAsFloat(val);
            case 'string' :
                return utlAsString(val);
        }
        return val;
    },

    fnTestCalc: function()
    {

    },

    fnTruncate: function(num)
    {
        return parseInt((''+num), 10);
    },

    fnTruncate_2dec: function(num)
    {
        return utlAsInt(num * 100) / 100;
    },


    //calculators

    //nb_appt_week
    fnCalc_numAppts_perWeek: function()
    {
        return this.hours_work * (this.c_minHour / this.appt_duration);
    },

    //phone_week

    //DEPRECATED
    fnCalc_numHoursOnPhone_perWeek: function()
    {
        return (this.fnCalc_numAppts_perWeek() * 6) / this.c_minHour;
    },

    //noshow_week
    //DEPRECATED
    fnCalc_numNoShows_perWeek: function()
    {
        var x = this.fnCalc_numAppts_perWeek() * this.c_noShowPercent;
        return this.fnTruncate(x);
    },

    //pc_noshow
    fnCalc_percentNoShows_perWeek: function()
    {
        var x = this.no_shows / (this.fnCalc_numAppts_perWeek() );

        x = this.fnTruncate(x * 100) / 100;

        return x;
    },

    // deprecated
    fnCalc_revenuePerMonth: function()
    {
        var pc_noshow = this.fnCalc_percentNoShows_perWeek();
        if(pc_noshow > 0.02)
            pc_noshow -= 0.02;

        return 0;
    },

    fnCalc_revenuePerWeek: function()
    {
        var pc_noshow = this.fnCalc_percentNoShows_perWeek();

        //pc_noshow = (pc_noshow > 0.02) ? pc_noshow -= 0.02 : 0;

        var a = (this.fnCalc_numAppts_perWeek() * pc_noshow);
        var c = (this.c_minHour / this.appt_duration);
        var b = this.hours_phone * this.c_phonePercent * c;


        var x = (a + b) * this.appt_price;

        return x;
    },

    fnCalc_netRevenue_perYear: function()
    {
        var x = this.fnCalc_revenuePerWeek() * 50 * this.profit_margin;
        return x;

        //net_year = rev_week * 50 * profit_margin

        //return (this.fnCalc_revenuePerMonth() * 12) * this.profit_margin;
    },

    fnCalc_netRevenue_perYear_old: function()
    {
        return (this.fnCalc_revenuePerMonth() * 12) * this.profit_margin;
    },

    fnCalc_fnCalc_booxiCostPerYear: function()
    {
        var res = {cost: 204, nb_staff:'1'};

        if(this.nb_staff > 1)
            res = {cost: 480, nb_staff:'2-5'};

        if(this.nb_staff > 5)
            res = {cost: 960, nb_staff:'6-15'};

        if(this.nb_staff > 15)
            res = {cost: 2000, nb_staff:'16-50'};

        if(this.nb_staff > 51)
            res = {cost: 3000, nb_staff:'51-100'};

        return res;
    },

    fnCalc_grossRevenue_wStaff: function()
    {
        return this.fnCalc_revenuePerWeek() * this.nb_staff;
    },

    fnCalc_netRevenue_wStaff: function()
    {
        return this.fnCalc_netRevenue_perYear() * this.nb_staff;
    },

    fnCalc_roi: function()
    {
        var booxi_cost = (this.fnCalc_fnCalc_booxiCostPerYear()).cost;

        var x = (this.fnCalc_netRevenue_perYear() * this.nb_staff) / booxi_cost;

        return x;
    },

    // -----------------------------------------------

    fnx_preCalc: function()
    {
        var hours_work = utlAsInt( $('#roi_hours_week').val() );
        var apptDuration = utlAsInt( $('#roi_appt_duration').val() );

        var numAppt_perWeek = hours_work * (this.c_minHour / apptDuration);
        var numPhoneHours = (numAppt_perWeek * 6) / this.c_minHour;
        var numNoShows_perWeek = numAppt_perWeek * this.c_noShowPercent;

        //roi_phone_week

        //roi_noshow_week
        if($('#roi_phone_week').attr('data-lock-auto') !== 'true')
            $('#roi_phone_week').val( this.fnTruncate_2dec(numPhoneHours) );

        if($('#roi_noshow_week').attr('data-lock-auto') !== 'true')
            $('#roi_noshow_week').val( this.fnTruncate_2dec(numNoShows_perWeek) );

    },

    fnx_lockField: function(ele)
    {
        var jqEle = $(ele);
        jqEle.attr('data-lock-auto', 'true');

        var tmp = utlAsFloat(jqEle.val());
        jqEle.val(tmp);
    },


    fnLogIntercom: function(userEmail)
    {
        if(window.Intercom === undefined)
            return;

        var dslog = {
            email: userEmail,
            user_agent_data: navigator.userAgent,
            bx_origin:'ROI',
            Language: core.defLang
        };

        var ref = document.referrer;

        if( (ref !== '') && (ref !== undefined) && (ref !== null))
        {
            if(utlAsString(ref).search('www.booxi.com') == -1)
                dslog.bx_referrer = ref;
        }

        Intercom('update', dslog);
    },



    end:null
});

window.roiCalc = new roiCalculator();