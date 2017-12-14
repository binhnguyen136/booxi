var dataMod_bookNow = (function ()
{
    // PRIVATE VARS -- STATIC SCOPE
    var prefix = 'fnBKNow_';
    var _modLabel_ = 'bookNow';

    // PRIVATE METHODS

    function fnInitModule()
    {

    }

    function fnInitSession(session)
    {
        session.dsList_region_groups = [];
        session.dsList_regions = [];
        session.dsList_region_assignments = [];

        session.athome_serviceList = [];
        session.activeRegionGroups = [];
        session.regionsListBy_regionGroup_id = {};
        session.serviceListBy_regionId = {};
        session.staffListBy_regionId = {};
        session.regionsBy_staffId = {};
        session.activeRegionList = []; //ids of regions that are defined

        session.dsList_service = [];
        session.dsList_staff = [];
        session.dsList_groups = [];
        session.dsList_surveys = [];

        session.dsInfo = {};
        session.bizWorkHours = [];

        session.groupListBy_staff_id = {};
        session.serviceListBy_staff_id = {};
        session.staffListBy_service_id = {};
        session.serviceListBy_group_id = {};
        session.serviceListBy_group_id.no_group = {label:'', list:[]};

        //no book lists
        session.nobook_serviceList = [];
        session.nobook_staffList = [];
        session.activeServiceList = [];
        session.activeStaffList = [];
        session.missingServiceList = [];

        session.fnUpdateReadyState(_modLabel_);

        session.s_merchId = '';
        session.s_pageUrl = '';

        session.bizPageSettings = {};  // pageconfig_json
        session.bizMercSettings = {};  // settings_json

        session.flag_useWorkHours = false;
        session.flag_canBook = true;
        session.flag_useRegions = false;
        session.flag_useWhiteLabel = false;

        session.s_poweredby_logo_url = '';
        session.s_legal_terms_url = '';

        //--------------------
        session.dsList_assignments = [];
        session.overrideTable = {};
        session.staffHasOverride = {};
        session.serviceHasOverride = {};
    }

    /////////////////////////////////
    function fnReset_bookNowSessionData()
    {
        //new
        this.dsList_region_groups = [];
        this.dsList_regions = [];
        this.dsList_region_assignments = [];

        this.athome_serviceList = [];
        this.activeRegionGroups = [];
        this.regionsListBy_regionGroup_id = {};
        this.serviceListBy_regionId = {};
        this.staffListBy_regionId = {};
        this.regionsBy_staffId = {};
        this.activeRegionList = []; //ids of regions that are defined

        //---
        this.dsList_service = [];
        this.dsList_staff = [];
        this.dsList_groups = [];
        this.dsList_surveys = [];

        this.dsInfo = {};
        this.bizWorkHours = [];

        this.groupListBy_staff_id = {};
        this.serviceListBy_staff_id = {};
        this.staffListBy_service_id = {};
        this.serviceListBy_group_id = {};
        this.serviceListBy_group_id.no_group = {label:'', list:[]};

        //no book lists
        this.nobook_serviceList = [];
        this.nobook_staffList = [];
        this.activeServiceList = [];
        this.activeStaffList = [];
        this.missingServiceList = [];

        this.s_merchId = '';
        this.s_pageUrl = '';

        this.bizPageSettings = {};  // pageconfig_json
        this.bizMercSettings = {};  // settings_json

        this.flag_useWorkHours = false;
        this.flag_canBook = true;
        this.flag_useRegions = false;
        this.flag_useWhiteLabel = false;

        this.s_poweredby_logo_url = '';
        this.s_legal_terms_url = '';
        //--------------------

        this.dsList_assignments = [];
        this.overrideTable = {};
        this.staffHasOverride = {};
        this.serviceHasOverride = {};
    }

    //GET full BOOK NOW data from a vanity url
    function fnGetMerchant_byAPIKey(key, cb_success, cb_fail)
    {
        dc.fnBKNow_fnReset_bookNowSessionData.call(this);

        var cbs = cb_success || null;
        var cbf = cb_fail || null;

        var temp_data = {api_key: key, what:'all', level:'long', lang:core.defLang, fmt:'JSON'};

        dc.fnAjax_asPost(this.session_id, core.getAjaxPath()+'getMerchantFromAPIKey.php', temp_data, cbs, cbf, 'fnBKNow_fnRequestSuccess_getBookNow', 'fnBKNow_fnRequestFail_getBookNow');
    }

    //GET full BOOK NOW data from a vanity url
    function fnGetMerchant_byUrl(url, cb_success, cb_fail)
    {
        dc.fnBKNow_fnReset_bookNowSessionData.call(this);
        var cbs = cb_success || null;
        var cbf = cb_fail || null;
        var temp_data = {page_url: url, what:'all', level:'long', lang:core.defLang, fmt:'JSON'};

        dc.fnAjax_asPost(this.session_id, core.getAjaxPath()+'getBNMerchant_byPageURL.php', temp_data, cbs, cbf, 'fnBKNow_fnRequestSuccess_getBookNow', 'fnBKNow_fnRequestFail_getBookNow');
    }

    //GET full BOOK NOW data
    function fnAjaxRequest_getBookNow(dataSet, cb_success, cb_fail)
    {
        var cbs = cb_success || null;
        var cbf = cb_fail || null;

        var temp_data = {merch_id: this.s_merchId, what:dataSet.whatKey, level:dataSet.level, lang:core.defLang, fmt:'JSON'};
        dc.fnAjax_asPost(this.session_id, core.getAjaxPath()+'getBNMerchant.php', temp_data, cbs, cbf, 'fnBKNow_fnRequestSuccess_getBookNow', 'fnBKNow_fnRequestFail_getBookNow');
    }

    function fnLoadForBookNow(cb_success, cb_fail)
    {
        var cbs = cb_success || null;
        var cbf = cb_fail || null;

        dc.fnBKNow_fnAjaxRequest_getBookNow.call(this, {whatKey:'all', level:'short'}, cbs, cbf);
    }

    function fnRequestSuccess_getBookNow(aData, textStatus, jqXHR, cb_success, cb_fail)
    {
        if(utlAsInt_nullOnNaN(aData.result) !== 0)
        {
            //dc.serverLog_xhr("LOG_ERR", "dataMod_bookNow.js", "fnRequestSuccess_getBookNow", "Ajax Response result not valid. Result = " + aData.result, jqXHR, textStatus, '');
            var logMsg = "Ajax Response result not valid. Result = " + aData.result;
            dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnRequestSuccess_getBookNow", logMsg, textStatus, jqXHR, '');

            if(cb_fail !== null)
                cb_fail();

            return;
        }

        dc.fnBKNow_fnProcessRequestData.call(this, aData);

        if(cb_success !== null)
            cb_success();
    }

    function sanitize_bizInfo(obj)
    {
        if(obj.address !== undefined)
            obj.address  = core.escapeHtml(obj.address );

        if(obj.biz_name !== undefined)
            obj.biz_name  = core.escapeHtml(obj.biz_name );

        if(obj.city !== undefined)
            obj.city  = core.escapeHtml(obj.city );

        if(obj.contact_firstname !== undefined)
            obj.contact_firstname  = core.escapeHtml(obj.contact_firstname );

        if(obj.contact_lastname !== undefined)
            obj.contact_lastname  = core.escapeHtml(obj.contact_lastname );

        if(obj.country !== undefined)
            obj.country  = core.escapeHtml(obj.country );

        if(obj.short_desc !== undefined)
            obj.short_desc  = core.escapeHtml(obj.short_desc );

        if(obj.long_desc !== undefined)
            obj.long_desc  = core.escapeHtml(obj.long_desc );

        if(obj.web_link !== undefined)
            obj.web_link  = core.escapeHtml(obj.web_link );

        return obj;
    }

    function sanitize_services(arr)
    {
        for(var i = 0; i < arr.length; i++)
        {
            if((arr[i].group_name !== undefined) && (arr[i].group_name !== null))
                arr[i].group_name = core.escapeHtml(arr[i].group_name);

            if(arr[i].instructions !== undefined)
                arr[i].instructions = core.escapeHtml(arr[i].instructions);

            if(arr[i].location !== undefined)
                arr[i].location = core.escapeHtml(arr[i].location);

            if(arr[i].long_desc !== undefined)
                arr[i].long_desc = core.escapeHtml(arr[i].long_desc);

            if(arr[i].name !== undefined)
                arr[i].name = core.escapeHtml(arr[i].name);

            if(arr[i].short_desc !== undefined)
                arr[i].short_desc = core.escapeHtml(arr[i].short_desc);

        }

        return arr;
    }

    function sanitize_staff(arr)
    {
        for(var i = 0; i < arr.length; i++)
        {
            if(arr[i].bio !== undefined)
                arr[i].bio = core.escapeHtml(arr[i].bio);

            if(arr[i].firstname !== undefined)
                arr[i].firstname = core.escapeHtml(arr[i].firstname);

            if(arr[i].lastname !== undefined)
                arr[i].lastname = core.escapeHtml(arr[i].lastname);

            if(arr[i].position !== undefined)
                arr[i].position = core.escapeHtml(arr[i].position);
        }

        return arr;
    }

    // Mercant Data Handler Roots <--------------------------------------------------------------------------------------------
    function fnProcessRequestData(aData)
    {
        if('info' in aData)
        {
            this.dsInfo = sanitize_bizInfo(aData.info);
            this.s_merchId = this.dsInfo.merchant_id;

            this.bizPageSettings = utlSmartDecodeJson(this.dsInfo.pageconfig_json);
            this.bizMercSettings = utlSmartDecodeJson(this.dsInfo.settings_json);


            // NEW REGIONS
            if(this.bizMercSettings.merch_region_management !== undefined)
            {
                if( (utlEvalAsBool(this.bizMercSettings.merch_region_management.enabled) === true) && (utlEvalAsBool(this.bizMercSettings.merch_region_management.value) === true) )
                {
                    this.flag_useRegions = true;
                }
            }

            // NEW White Label
            if(this.bizMercSettings.merch_booknow_white_label !== undefined)
            {
                if( (utlEvalAsBool(this.bizMercSettings.merch_booknow_white_label.enabled) === true) && (utlEvalAsBool(this.bizMercSettings.merch_booknow_white_label.value) === true) )
                {
                    this.flag_useWhiteLabel = true;
                }
            }

            // NEW Powered by Logo setting
            this.s_poweredby_logo_url = "/img/common/powered-by-booxi.svg"; //default

            if(this.bizMercSettings.merch_booknow_poweredby_logo_url !== undefined)
            {
                if( (utlEvalAsBool(this.bizMercSettings.merch_booknow_poweredby_logo_url.enabled) === true) && (utlIsVarString_notEmpty(this.bizMercSettings.merch_booknow_poweredby_logo_url.value) === true) )
                {
                    this.s_poweredby_logo_url = this.bizMercSettings.merch_booknow_poweredby_logo_url.value;
                }
            }

            // NEW Terms Url setting
            if(this.bizMercSettings.merch_booknow_terms_url !== undefined)
            {
                if( (utlEvalAsBool(this.bizMercSettings.merch_booknow_terms_url.enabled) === true) && (utlIsVarString_notEmpty(this.bizMercSettings.merch_booknow_terms_url.value) === true) )
                {
                    this.s_legal_terms_url = this.bizMercSettings.merch_booknow_terms_url.value;
                }
            }


            //merch_online_newletter_signup
        }

        if('servicegroups' in aData)
        {
            this.dsList_groups = aData.servicegroups;
            dc.fnBKNow_fnSetVirtualGeneralServiceGroup.call(this);
            dc.fnBKNow_fnUpdate_dataOrderGroupList.call(this);
        }

        if('services' in aData)
        {
            this.dsList_service = sanitize_services(aData.services);
            dc.fnBKNow_fnGenerate_serviceIdx_refList.call(this);
        }

        if('staffs' in aData)
        {
            this.dsList_staff = sanitize_staff(aData.staffs);

            dc.fnBKNow_fnGenerate_staffIdx_refList.call(this);
        }

        if('assignments' in aData)
        {
            this.dsList_assignments = aData.assignments;
        }

        if('services' in aData)
        {
            dc.fnBKNow_fnProcess_service_group_list.call(this);
        }

        if('staffs' in aData)
        {
            dc.fnBKNow_fnProcess_staff_service_list.call(this);
        }

        if('schedule' in aData)
        {
            if('workhours' in aData.schedule)
            {
                this.flag_useWorkHours = true;
                this.bizWorkHours = aData.schedule.workhours;
            }
        }

        dc.fnBKNow_fnPostProcess_group_list.call(this);

        // NEW :: Regions
        if('region_groups' in aData)
        {
            this.dsList_region_groups = aData.region_groups;

        }

        if('regions' in aData)
        {
            this.dsList_regions = aData.regions;
            var cnt = this.dsList_regions.length;
            for(var i = 0; i < cnt; i++)
            {
                this.activeRegionList.push( utlAsInt(this.dsList_regions[i].region_id) );
            }
        }

        if('region_assignments' in aData)
        {
            this.dsList_region_assignments = aData.region_assignments;
            dc.fnBKNow_fnProcess_regionAssignment.call(this);
        }

        if('surveys' in aData)
        {
            this.dsList_surveys = aData.surveys;
        }

        //------------
        dc.fnBKNow_fnTestCanBook.call(this);
    }

    //  NEW ---

    function fnProcess_regionAssignment()
    {
        var validRegionGroupList = [];
        var invalidStaffList = []; // list of staff that cant book
        var activeRegions = []; // List of region IDs that have one or more staff avail
        var servicesByRegionId = {}; // Arrays of service ids associated to region id they are supported in
        var regionsByStaffId = {}; // tmpObj
        var staffByRegionId = {};

        var key, tmpServList, tmpArr, i;

        var cnt = this.dsList_region_assignments.length;

        //this.activeStaffList
        //this.activeRegionList
        //utlArrayIndexOf(match, arr)

        //Step 1 : sort the data :: regions by staff id
        for(i = 0; i < cnt; i++)
        {
            if(utlArrayIndexOf(this.dsList_region_assignments[i].staff_id, this.activeStaffList) == -1)
                continue;

            if(utlArrayIndexOf(this.dsList_region_assignments[i].region_id, this.activeRegionList) == -1)
                continue;

            key = utlAsString(this.dsList_region_assignments[i].staff_id);
            if(regionsByStaffId[key] === undefined)
                regionsByStaffId[key] = [];

            regionsByStaffId[key].push( utlAsInt( this.dsList_region_assignments[i].region_id) );

            // ---

            key = utlAsString(this.dsList_region_assignments[i].region_id);
            if(staffByRegionId[key] === undefined)
                staffByRegionId[key] = [];

            staffByRegionId[key].push( utlAsInt( this.dsList_region_assignments[i].staff_id) );
        }

        //Step 2 : Associate the services to the staff ids and to regions
        for(var staff_id in regionsByStaffId)
        {
            tmpServList = dc.fnBKNow_fnGetServiceByStaffId.call(this, staff_id);
            tmpArr = utlFindMatchingElements_inArray(this.athome_serviceList, tmpServList);

            //test the staffs services to see if any are @Home

            if(tmpArr.length < 1)
            {
                invalidStaffList.push(staff_id);
                continue;
            }

            // Associate the @home service ids to region ids --> servicesByRegionId
            cnt = regionsByStaffId[staff_id].length;
            for(i = 0; i < cnt; i++)
            {
                key = regionsByStaffId[staff_id][i];
                activeRegions.push( utlAsInt(i) );

                if(servicesByRegionId[key] === undefined)
                    servicesByRegionId[key] = tmpArr;
                else
                    servicesByRegionId[key] = utlArray_removeDuplicates(tmpArr.concat(servicesByRegionId[key]));
            }
        }

        //Step 3 : Find the regionGroups which have regions that have assigned services.
        cnt = this.dsList_regions.length;
        for(i = 0; i < cnt; i++)
        {
            //if( utlAsString(this.dsList_regions[i].region_id) in servicesByRegionId)
            if(servicesByRegionId[utlAsString(this.dsList_regions[i].region_id)] !== undefined)
            {
                validRegionGroupList.push(this.dsList_regions[i].region_group_id);
            }
        }

        validRegionGroupList = utlArray_removeDuplicates(validRegionGroupList);

        //Step 4 : Region List by valid group id
        cnt = this.dsList_regions.length;
        for(i = 0; i < cnt; i++)
        {
            if(utlArrayIndexOf( utlAsInt(this.dsList_regions[i].region_group_id), validRegionGroupList ) == -1)
                continue;

            key = utlAsString( this.dsList_regions[i].region_group_id );
            if(this.regionsListBy_regionGroup_id[ key ] === undefined)
                this.regionsListBy_regionGroup_id[ key ] = [];

            this.regionsListBy_regionGroup_id[ key ].push( this.dsList_regions[i] );

        }

        this.activeRegionGroups = validRegionGroupList;
        this.regionsBy_staffId = regionsByStaffId;
        this.serviceListBy_regionId = servicesByRegionId;
        this.staffListBy_regionId = staffByRegionId;
    }

    //TODO REMOVE
    function fnProcess_regionData()
    {
        var cnt = this.dsList_regions.length;
        var key;
        for(var i = 0; i < cnt; i++)
        {
            key = utlAsString( this.dsList_regions[i].region_group_id );
            if(this.regionsListBy_regionGroup_id[ key ] === undefined)
                this.regionsListBy_regionGroup_id[ key ] = [];

            this.regionsListBy_regionGroup_id[ key ].push( this.dsList_regions[i] );
        }
    }

    function fnGet_regionsByRegionGroupId(region_group_id)
    {
        var key = utlAsString( region_group_id );

        if(this.regionsListBy_regionGroup_id[ key ] === undefined)
            return [];

        return this.regionsListBy_regionGroup_id[ key ];
    }



    // END =====================

    function fnTestCanBook()
    {
        var availServices = [];

        for(var i = 0; i < this.dsList_service.length; i++)
        {
            if( this.nobook_serviceList.indexOf(utlAsInt(this.dsList_service[i].service_id)) == -1)
                availServices.push(utlAsInt(this.dsList_service[i].service_id));
        }

        this.flag_canBook = (availServices.length !== 0);
    }

    function fnRequestFail_getBookNow(jqXHR, textStatus, errorThrown, cb_fail)
    {
        dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnRequestFail_getBookNow", "Ajax Error Callback Triggered", jqXHR, textStatus, errorThrown);
        if(cb_fail !== null)
            cb_fail(); //.call(this);
    }

    function fnGenerate_serviceIdx_refList()
    {
        this.dsList_serviceIdx_byId = {};
        var set, val, bActive, dispatchMode;

        for(var i = 0; i < this.dsList_service.length; i++)
        {
            this.dsList_serviceIdx_byId[this.dsList_service[i].service_id] = i;
            this.dsList_service[i].useManualDispatch = false;
            this.dsList_service[i].useOpenCalDispatch = true;
            this.dsList_service[i].dispatchMode = null;

            //NEW Region mode -- data only used for region mode
            if( utlLC(this.dsList_service[i].location) == "home")
                this.athome_serviceList.push( utlAsInt(this.dsList_service[i].service_id) );

            bActive = true;

            this.dsList_service[i].props = utlSmartDecodeJson(this.dsList_service[i].settings_json);

            // DISABLE BOOKING SETTING
            if(this.dsList_service[i].props.service_disable_online_booking !== undefined)
            {
                if( (this.dsList_service[i].props.service_disable_online_booking.value === true))
                {
                    this.nobook_serviceList.push(utlAsInt(this.dsList_service[i].service_id));
                    bActive = false;
                }
            }

            //Duration ZERO disable booking
            if( parseInt(this.dsList_service[i].duration, 10) <= 0)
            {
                this.nobook_serviceList.push(utlAsInt(this.dsList_service[i].service_id));
                bActive = false;
            }


            if(utlIsVarObject(this.dsList_service[i].props.service_dispatch_appts) === true)
            {
                if( (utlEvalAsBool(this.dsList_service[i].props.service_dispatch_appts.enabled) === true) &&
                    (utlEvalAsBool(this.dsList_service[i].props.service_dispatch_appts.value) === true) )
                {
                    dispatchMode = {enabled: false, value:''};

                    if(utlIsVarObject(this.dsList_service[i].props.service_dispatch_mode) === true)
                        dispatchMode = this.dsList_service[i].props.service_dispatch_mode;

                    this.dsList_service[i].useManualDispatch = true;

                    if( utlEvalAsBool(dispatchMode.enabled) === true)
                    {
                        this.dsList_service[i].useOpenCalDispatch = (utlLC(dispatchMode.value) == "client_availability");
                        this.dsList_service[i].dispatchMode = utlLC(dispatchMode.value);
                    }
                }
            }

            if(bActive === true)
                this.activeServiceList.push(utlAsInt(this.dsList_service[i].service_id));
        }
    }

    function fnGenerate_staffIdx_refList()
    {
        this.dsList_staffIdx_byId = {};
        var bActive;

        var q;
        var newServList;

        for(var i = 0; i < this.dsList_staff.length; i++)
        {
            bActive = true;
            this.dsList_staffIdx_byId[this.dsList_staff[i].staff_id] = i;

            this.dsList_staff[i].props = utlSmartDecodeJson(this.dsList_staff[i].settings_json, {});

            if(this.dsList_staff[i].props.staff_disable_online_booking !== undefined)
            {
                var setting = this.dsList_staff[i].props.staff_disable_online_booking;
                if((setting.enabled === true) && (setting.value === true))
                {
                    this.nobook_staffList.push(utlAsInt(this.dsList_staff[i].staff_id));
                    bActive = false;
                }
            }

            if(bActive === true)
                this.activeStaffList.push(utlAsInt(this.dsList_staff[i].staff_id));
        }
    }

    function fnProcess_staffServiceOverride(item)
    {
        if((item.service_id === undefined) || (item.staff_id === undefined) )
            return;

        var key = item.service_id + '_' + item.staff_id;

        this.overrideTable[key] = item;

        var preServiceOvr = this.serviceHasOverride[ utlAsString(item.service_id) ];
        var type = (preServiceOvr !== undefined) ? preServiceOvr : 0;

        if( (item.duration_override !== undefined) || (item.price_json_override !== undefined) )
        {
            if(type === 0)
            {
                if(item.duration_override !== undefined)
                    type = (item.price_json_override !== undefined) ? 3 : 1;
                else
                    type = 2;
            }
            else
            {
                if( (item.duration_override !== undefined) && (type == 2))
                    type = 3;

                if( (item.price_json_override !== undefined) && (type == 1))
                    type = 3;
            }


            this.staffHasOverride[ utlAsString(item.staff_id) ] = true;
            this.serviceHasOverride[ utlAsString(item.service_id) ] = type;
        }

        //this.staffHasOverride = {};
        //this.serviceHasOverride = {};
        //duration_override, price_json_override
    }

    // type int ok
    function fnGet_staffServiceOverride(service_id, staff_id)
    {
        var key = service_id + '_' + staff_id;

        if(this.overrideTable[key] !== undefined)
            return this.overrideTable[key];

        return null;
    }

    // type int ok
    function fnTest_serviceHasOverride(service_id)
    {
        if(this.serviceHasOverride[ utlAsString(service_id) ] === undefined)
            return false;

        return this.serviceHasOverride[ utlAsString(service_id) ];
    }

    function fnTest_serviceHasOverrideByType(service_id)
    {
        var res = { hasOvrPrice: false, hasOvrDuration: false };

        if(this.serviceHasOverride[ utlAsString(service_id) ] === undefined)
            return res;

        var ovrState = this.serviceHasOverride[ utlAsString(service_id) ];

        if( (ovrState == 2) || (ovrState == 3) )
            res.hasOvrPrice = true;

        if( (ovrState == 1) || (ovrState == 3) )
            res.hasOvrDuration = true;

        return res;
    }

    // type int ok
    function fnTest_staffHasOverride(staff_id)
    {
        return (this.staffHasOverride[ utlAsString(staff_id) ] === true);
    }

    //GOOD
    function fnProcess_staff_service_list()
    {
        var canBookServ = {};
        var canBookStaff = {};

        var groupByStaff = {};
        var servByStaff = {};
        var staffByServ = {};

        var i, cnt;

        cnt = this.activeServiceList.length;
        for(i = 0; i < cnt; i++)
        {
            canBookServ[utlAsString(this.activeServiceList[i])] = true;
        }

        cnt = this.activeStaffList.length;
        for(i = 0; i < cnt; i++)
        {
            canBookStaff[utlAsString(this.activeStaffList[i])] = true;
        }

        //console.debug(this.dsList_assignments);
        cnt = this.dsList_assignments.length;
        var list = this.dsList_assignments;

        var serviceRecord;

        for(i = 0; i < cnt; i++)
        {
            if( (canBookServ[utlAsString(list[i].service_id)] === undefined) || (canBookStaff[utlAsString(list[i].staff_id)] === undefined) )
                continue;

            //double key entry
            dc.fnBKNow_fnProcess_staffServiceOverride.call(this, list[i]);

            if( servByStaff[utlAsString(list[i].staff_id)] === undefined )
                servByStaff[utlAsString(list[i].staff_id)] = [];

            //todo test if service dispatch
            //this.dsList_service[i].useManualDispatch

            serviceRecord = dc.fnBKNow_fnGetBuffered_serviceById.call(this, list[i].service_id);

            if(serviceRecord.useManualDispatch !== true)
                servByStaff[utlAsString(list[i].staff_id)].push(utlAsInt(list[i].service_id));

            if( groupByStaff[ utlAsString(list[i].staff_id)  ] === undefined )
                groupByStaff[utlAsString(list[i].staff_id)] = [];

            groupByStaff[utlAsString(list[i].staff_id)].push( dc.fnBKNow_fnGetGroupId_byServiceId.call(this, list[i].service_id) );


            if( staffByServ[ utlAsString(list[i].service_id)  ] === undefined )
                staffByServ[ utlAsString(list[i].service_id)  ] = [];

            staffByServ[utlAsString(list[i].service_id)].push(utlAsInt(list[i].staff_id));
        }

        var lbl, tmpObj;

        for(lbl in servByStaff)
        {
            if(utlIsVarArray(servByStaff[lbl]))
                servByStaff[lbl] = utlArray_removeDuplicates(servByStaff[lbl]);
        }

        for(lbl in staffByServ)
        {
            if(utlIsVarArray(staffByServ[lbl]))
                staffByServ[lbl] = utlArray_removeDuplicates(staffByServ[lbl]);
        }

        for(lbl in groupByStaff)
        {
            if(utlIsVarArray(groupByStaff[lbl]))
                groupByStaff[lbl] = utlArray_removeDuplicates(groupByStaff[lbl]);
        }


        //TODO add exception dual key table
        // also add look up methods

        // make book now method to eval and update price, single method will eval is service or override
        //todo

        //utlArray_removeDuplicates
        this.staffListBy_service_id = staffByServ;
        this.serviceListBy_staff_id = servByStaff;
        this.groupListBy_staff_id = groupByStaff;
    }

    function fnProcess_service_group_list()
    {
        this.serviceListBy_group_id = {};
        this.serviceListBy_group_id.no_group = {label:'', list:[]};

        for(var i in this.dsList_service)
        {
            if(( utlAsInt(this.dsList_service[i].group_id) === 0) || (this.dsList_service[i].group_id === '') || (this.dsList_service[i].group_id === null))
            {
                this.serviceListBy_group_id.no_group.list.push(utlAsInt(this.dsList_service[i].service_id));
                continue;
            }

            if(this.dsList_service[i].service_id in this.nobook_serviceList)
                continue;

            if(!(this.dsList_service[i].group_id in this.serviceListBy_group_id))
                this.serviceListBy_group_id[this.dsList_service[i].group_id] = {label:this.dsList_service[i].group_name, list:[]};

            this.serviceListBy_group_id[this.dsList_service[i].group_id].list.push(utlAsInt(this.dsList_service[i].service_id));
        }
    }

    function fnPostProcess_group_list()
    {
        var i, q, sCnt, id;

        for(var o in this.serviceListBy_group_id)
        {
            if(o == 'no_group')
            {
                this.serviceListBy_group_id[o].group_id = 0;
                this.serviceListBy_group_id[o].img_url = null;
                this.serviceListBy_group_id[o].name = utlWrpSpanByBxLang('biz_page_28'); //"General Services";
                this.serviceListBy_group_id[o].short_desc = utlWrpSpanByBxLang('biz_page_28'); //"General Services";
                this.serviceListBy_group_id[o].display_order = 9999;
            }

            id = utlAsInt(o);

            //////////////////
            sCnt = 0;

            for(q = 0; q < this.serviceListBy_group_id[o].list.length; q++ )
            {
                if(this.nobook_serviceList.indexOf(this.serviceListBy_group_id[o].list[q]) == -1)
                    sCnt++;
                /*
                if(this.staffListBy_service_id[this.serviceListBy_group_id[o].list[q]] !== undefined)
                    sCnt++;
                    */
            }

            if(sCnt === 0)
            {
                delete this.serviceListBy_group_id[o];
                continue;
            }
            /////////////////

            if(o == 'no_group')
                continue;

            for(i = 0; i < this.dsList_groups.length; i++)
            {
                if(id == utlAsInt(this.dsList_groups[i].group_id) )
                {
                    this.serviceListBy_group_id[o].group_id = utlAsInt(this.dsList_groups[i].group_id);
                    this.serviceListBy_group_id[o].img_url = this.dsList_groups[i].img_url;
                    this.serviceListBy_group_id[o].name = this.dsList_groups[i].name;
                    this.serviceListBy_group_id[o].short_desc = this.dsList_groups[i].short_desc;
                    this.serviceListBy_group_id[o].display_order = utlAsInt(this.dsList_groups[i].display_order);
                    continue;
                }
            }
        }
    }

    // type int ok
    function fnGetStaffByServiceId(service_id)
    {
        return (this.staffListBy_service_id[ utlAsString(service_id) ] !== undefined) ? this.staffListBy_service_id[ utlAsString(service_id )] : [];
    }

    // type int ok
    function fnGetServiceByStaffId(staff_id)
    {
        return (this.serviceListBy_staff_id[ utlAsString(staff_id) ] !== undefined) ? this.serviceListBy_staff_id[ utlAsString(staff_id) ] : [];
    }

    // type int ok
    function fnGetGroupByStaffId(staff_id)
    {
        return (this.groupListBy_staff_id[ utlAsString(staff_id )] !== undefined) ? this.groupListBy_staff_id[ utlAsString(staff_id) ] : [];
    }

    // type int ok
    function fnGetStaffListForServiceId(service_id)
    {
        if(this.staffListBy_service_id[ utlAsString(service_id) ] === undefined)
            return [];

        return this.staffListBy_service_id[ utlAsString(service_id) ];
    }

    function fnGetDataByObjectLabel(oLabel)
    {
        if(this[oLabel] === undefined)
            return undefined;

        return this[oLabel];
    }

    // type int ok
    function fnSetMerchant_id(id)
    {
        dc.fnBKNow_fnReset_bookNowSessionData.call(this);
        this.s_merchId = id;
    }

    // type int ok
    function fnGetGroupId_byServiceId(service_id)
    {
        service_id = utlAsInt(service_id);

        for(var i = 0; i < this.dsList_service.length; i++)
        {
            if( service_id == utlAsInt(this.dsList_service[i].service_id) )
                return utlAsInt(this.dsList_service[i].group_id);
        }
        return null;
    }

    function fnTest_this(id)
    {
        //console.debug(this);
    }

    // type int ok
    function fnGenList_servicesOfferedByStaffID(staff_id)
    {
        var filterList = this.serviceListBy_staff_id[ utlAsString(staff_id)];

        var result = [];

        if(filterList === undefined)
            return result;

        for(var i = 0; i < this.dsList_service.length; i++)
        {
            if( filterList.indexOf( utlAsInt(this.dsList_service[i].service_id) ) == -1)
                continue;

            result.push(this.dsList_service[i]);
        }

        return result;
    }

    // type int ok
    function fnCheck_staffServiceCount(staff_id)
    {
        var filterList = this.serviceListBy_staff_id[ utlAsString(staff_id)];
        var cnt = 0;

        if(filterList === undefined)
            return cnt;

        for(var i = 0; i < this.dsList_service.length; i++)
        {
            if( filterList.indexOf( utlAsInt(this.dsList_service[i].service_id) ) == -1 )
                continue;

            cnt++;
        }

        return cnt;
    }

    // type int ok
    function fnGenList_staffOfferByServiceID(service_id)
    {
        var filterList = this.staffListBy_service_id[ utlAsString(service_id) ];

        var result = [];

        if(filterList === undefined)
            return result;

        for(var i = 0; i < this.dsList_staff.length; i++)
        {
            if( filterList.indexOf( utlAsInt(this.dsList_staff[i].staff_id)) == -1)
                continue;

            result.push(this.dsList_staff[i]);
        }

        return result;
    }

    // type int ok
    function fnCheck_serviceStaffCount(service_id)
    {
        var filterList = this.staffListBy_service_id[ utlAsString(service_id) ];
        var cnt = 0;

        if(filterList === undefined)
            return cnt;

        for(var i = 0; i < this.dsList_staff.length; i++)
        {
            if( filterList.indexOf( utlAsInt(this.dsList_staff[i].staff_id)) == -1)
                continue;

            cnt++;
        }

        return cnt;
    }


    function fnGetBuffered_serviceGroupById(group_id)
    {
        group_id = utlAsInt(group_id);

        for(var i = 0; i < this.dsList_groups.length; i++)
        {
            if(utlAsInt(this.dsList_groups[i].group_id) == group_id)
                return this.dsList_groups[i];
        }

        return null;
    }

    // type int ok
    function fnGetBuffered_serviceById(service_id)
    {
        service_id = utlAsInt(service_id);

        for(var i = 0; i < this.dsList_service.length; i++)
        {
            if(utlAsInt(this.dsList_service[i].service_id) == service_id)
                return this.dsList_service[i];
        }

        return null;
    }

    // type int ok
    function fnGetBuffered_staffById(staff_id)
    {
        staff_id = utlAsInt(staff_id);

        for(var i = 0; i < this.dsList_staff.length; i++)
        {
            if(utlAsInt(this.dsList_staff[i].staff_id) == staff_id)
                return this.dsList_staff[i];
        }

        return null;
    }

    // type int ok
    function fnTestServiceID_canStaffBook(service_id)
    {
        service_id = utlAsInt(service_id);

        if(this.nobook_serviceList.indexOf(service_id) !== -1)
            return false;

        var sRec = dc.fnBKNow_fnGetBuffered_serviceById.call(this, service_id);

        if(sRec === null)
            return false;

        if(sRec.useManualDispatch === true)
            return false;

        return true;
    }

    function fnInjectStaticJSON(json, callback)
    {
        dc.fnBKNow_fnReset_bookNowSessionData.call(this);
        dc.fnBKNow_fnProcessRequestData.call(this, json);

        callback();
    }

    function fnForceRequest_serviceByID(service_id,  cb_success, cb_fail)
    {
        var cbs = cb_success || null;
        var cbf = cb_fail || null;
        var temp_data = {what:'service', merch_id: this.s_merchId, service_id:service_id, lang:core.defLang, fmt:'JSON'};
        dc.fnAjax_asPost(this.session_id, core.getAjaxPath()+'getBNMerchant.php', temp_data, cbs, cbf, 'fnBKNow_fnForceReqSuccess_serviceByID', 'fnBKNow_fnForceReqFail_serviceByID');
    }

    function fnForceReqSuccess_serviceByID(aData, textStatus, jqXHR, cb_success, cb_fail)
    {
        if(aData.service === undefined)  //parseInt(aData.result, 10) !== 0
        {
            dc.serverLog("LOG_ERR", "dataMod_bookNow.js", "fnForceReqSuccess_serviceByID", "Service data is undefined.");
            if(cb_fail !== null) cb_fail.call(this);
            return;
        }

        var servID = aData.service.service_id;
        var serviceRecord = aData.service;
        serviceRecord.props = utlSmartDecodeJson(serviceRecord.settings_json);
        if(serviceRecord.props.service_dispatch_appts !== undefined)
        {
            var dispatchMode = serviceRecord.props.service_dispatch_mode || {};
            var val = serviceRecord.props.service_dispatch_appts.value;

            if( (val !== 0) && (val !== false) && (val !== "false") && (val !== "0"))
            {
                serviceRecord.useManualDispatch = true;
                serviceRecord.useOpenCalDispatch = ( utlLC(dispatchMode.value) == "client_availability" ) || ( utlLC(dispatchMode.value) == "ask" );
            }
        }

        var iFound = -1;
        for(var i = 0; i < this.dsList_service.length; i++)
        {
            if(iFound !== -1)
                continue;

            if( utlAsInt(this.dsList_service[i].service_id) == utlAsInt(servID))
            {
                this.dsList_service[i] = serviceRecord;
                iFound = i;
            }
        }

        if(iFound === -1)
            this.dsList_service.push(serviceRecord);

        //Update data
        dc.fnBKNow_fnProcess_service_group_list.call(this);
        dc.fnBKNow_fnPostProcess_group_list.call(this);
        dc.fnBKNow_fnTestCanBook.call(this);

        if(cb_success !== null)
            cb_success.call(this);
    }

    function fnForceReqFail_serviceByID(aData, textStatus, jqXHR, cb_fail)
    {
        dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnForceReqFail_serviceByID", "Ajax Error Callback Triggered", jqXHR, textStatus, errorThrown);

        if(utlIsVarFunction(cb_fail) === true)
            cb_fail(); //.call(this);
    }

    function fnGetBookNowState(key, cb_success)
    {
        var cbs = cb_success || null;
        var reqData = {what:'booknow_state', apikey:key}; // key should be varchar 32


        dc.fnAjax_asPost(this.session_id, core.getAjaxPath()+'getMerchant.php', reqData, cbs, null, 'fnBKNow_fnRequestSuccess_getBookNowState');
    }

    function fnRequestSuccess_getBookNowState(aData, textStatus, jqXHR, cb_success, cb_fail)
    {
        if(utlAsInt_nullOnNaN(aData.result) !== 0)
        {
            var logMsg = "Ajax Response result not valid. Result = " + aData.result;
            dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnRequestSuccess_getBookNowState", logMsg, textStatus, jqXHR, '');
        }

        //if(cb_success !== null)
        if(utlIsVarFunction(cb_success) === true)
            cb_success.apply(this,[aData]);
    }

    function fnRequest_getClientInfo(info_key, cb_success, cb_fail)
    {
        var cbs = cb_success || null;
        var cbf = cb_fail || null;

        var reqData = {client_update_info_key: info_key};

        dc.fnAjax_asPost(this.session_id, core.getAjaxPath()+'getClientInfoBN.php', reqData, cbs, cbf, 'fnBKNow_fnReqSuccess_getClientInfo', 'fnBKNow_fnReqFail_getClientInfo');
    }

    function fnReqSuccess_getClientInfo(aData, textStatus, jqXHR, cb_success, cb_fail)
    {
        if(utlAsInt_nullOnNaN(aData.result) !== 0)
        {
            var logMsg = "Ajax Response result not valid. Result = " + aData.result;
            dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnReqSuccess_getClientInfo", logMsg, textStatus, jqXHR, '');

            if(utlIsVarFunction(cb_fail) === true)
                cb_fail();

            return;
        }

        if(utlIsVarFunction(cb_success) === true)
            cb_success(aData);
    }

    function fnReqFail_getClientInfo(aData, textStatus, jqXHR, cb_fail)
    {
        dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnReqFail_getClientInfo", "Ajax Error Callback Triggered", jqXHR, textStatus, errorThrown);

        if(utlIsVarFunction(cb_fail) === true)
            cb_fail();
    }

    function fnRequest_setClientInfo(info_key, info_data, cb_success, cb_fail)
    {
        var cbs = cb_success || null;
        var cbf = cb_fail || null;

        var reqData =
        {
            client_update_info_key: info_key,
            client_info: info_data
        };

        dc.fnAjax_asPost(this.session_id, core.getAjaxPath()+'setClientInfoBN.php', reqData, cbs, cbf, 'fnBKNow_fnReqSuccess_setClientInfo', 'fnBKNow_fnReqFail_setClientInfo');
    }

    function fnReqSuccess_setClientInfo(aData, textStatus, jqXHR, cb_success, cb_fail)
    {
        if(utlAsInt_nullOnNaN(aData.result) !== 0)
        {
            var logMsg = "Ajax Response result not valid. Result = " + aData.result;
            dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnReqSuccess_setClientInfo", logMsg, textStatus, jqXHR, '');
        }

        if(utlIsVarFunction(cb_success) === true)
            cb_success(aData);
    }

    function fnReqFail_setClientInfo(aData, textStatus, jqXHR, cb_fail)
    {
        dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnReqFail_setClientInfo", "Ajax Error Callback Triggered", jqXHR, textStatus, errorThrown);

        if(utlIsVarFunction(cb_fail) === true)
            cb_fail();
    }


    function fnSetVirtualGeneralServiceGroup()
    {
        if(utlIsVarArray(this.dsList_groups) !== true)
            return;

        var cnt = this.dsList_groups.length;

        for(var i = 0; i < cnt; i++)
        {
            if(utlAsInt(this.dsList_groups[i].group_id) === 0)
                return; //group is defined we are done here
        }

        this.dsList_groups.push({
            group_id: "0",
            display_column : "-1",
            display_order: "0",
            img_url: null,
            name: utlBxLang("biz_page_28"),
            short_desc: ''
        });
    }

    function fnUpdate_dataOrderGroupList()
    {
        if(utlIsVarArray(this.dsList_groups) !== true)
            return;

        this.dsList_groups.sort(function(valA, valB)
        {
            var a = parseInt(valA.display_order, 10);
            var b = parseInt(valB.display_order, 10);

            if(a < b)
                return 1;

            if (a > b)
                return -1;

            return 0;
        });
    }

    function fnGetEvalMerchantSetting_byLabel(lbl)
    {
        if(this.bizMercSettings[lbl] === undefined)
            return null;

        var tmpSet = this.bizMercSettings[lbl];

        if(tmpSet.enabled === undefined)
        {
            if(tmpSet.value !== undefined)
                return tmpSet.value;
        }
        else
        {
            if(utlEvalAsBool(tmpSet.enabled) === true)
                return tmpSet.value;
        }

        return null;
    }

    function fnTestCanBookById_serviceAndStaff(service_id, staff_id)
    {
        var service = dc.fnBKNow_fnGetBuffered_serviceById.call(this, service_id);
        var staff = dc.fnBKNow_fnGetBuffered_staffById.call(this, staff_id);



        if( (service === null) || (staff === null) )
            return false;

        if(service.useManualDispatch === true)
            return false;

        if( (staff.props.staff_disable_online_booking.enabled === true) && (staff.props.staff_disable_online_booking.value === true) )
            return false;

        var serviceByStaff = this.serviceListBy_staff_id[staff.staff_id];


        if(utlArrayIndexOf(utlAsInt(service_id), serviceByStaff) == -1)
            return false;

        return true;
    }

    // == New Region Selection ----------------------------------

    function fnGet_serviceByGroupList_filtherByRegion(regionId)
    {
        var returnObj = {};
        var serviceByRegion = [];
        var staffByRegion = [];

        if( this.serviceListBy_regionId[ utlAsString(regionId) ] !== undefined )
            serviceByRegion = this.serviceListBy_regionId[ utlAsString(regionId) ];

        if(this.staffListBy_regionId[ utlAsString(regionId) ] !== undefined)
            staffByRegion = this.staffListBy_regionId[ utlAsString(regionId) ];

        var tmpArr, cnt, i, newServiceList, tmpStaffList;
        for(var key in this.serviceListBy_group_id)
        {
            newServiceList = [];
            tmpArr = this.serviceListBy_group_id[key].list;

            cnt = tmpArr.length;
            for(i = 0; i < cnt; i++)
            {
                if( utlArrayIndexOf( utlAsInt( tmpArr[i] ), this.athome_serviceList) == -1)
                {
                    newServiceList.push( utlAsInt( tmpArr[i] ) );
                    continue;
                }

                if( utlArrayIndexOf( utlAsInt( tmpArr[i] ), serviceByRegion) != -1)
                {
                    //test for staff
                    tmpStaffList = [];
                    if(this.staffListBy_service_id[ utlAsString(tmpArr[i])] !== undefined)
                        tmpStaffList = this.staffListBy_service_id[ utlAsString(tmpArr[i])];

                    tmpStaffList = utlFindMatchingElements_inArray(tmpStaffList, staffByRegion);

                    if(tmpStaffList.length < 1)
                        continue;

                    newServiceList.push( utlAsInt( tmpArr[i] ) );
                }

            }

            if(newServiceList.length < 1)
                continue;



            returnObj[key] = {
                group_id: utlAsInt(this.serviceListBy_group_id[key].group_id),
                img_url: this.serviceListBy_group_id[key].img_url,
                label: this.serviceListBy_group_id[key].label,
                list: newServiceList,
                name: this.serviceListBy_group_id[key].name,
                short_desc: this.serviceListBy_group_id[key].short_desc
            };
        }

        return returnObj;

    }

    function fnGet_filteredService_byGroupId(groupId)
    {
        var out = [];
        var cnt = this.dsList_service.length;
        for(var i = 0; i < cnt; i++)
        {
            if( utlAsInt( this.dsList_service[i].group_id ) != utlAsInt( groupId ) )
                continue;

            /*
            // DIABLED -- Force to display list a specific service_id -- was used for Appt Recall
            if(exceptionServiceId !== null)
            {
                if(utlAsInt(this.dsList_service[i].service_id) === utlAsInt(exceptionServiceId))
                {
                    out.push(this.dsList_service[i]);
                    continue;
                }
            }
            */

            if(utlArrayIndexOf( utlAsInt(this.dsList_service[i].service_id), this.nobook_serviceList ) != -1)
                continue;

            out.push(this.dsList_service[i]);
        }

        return out;
    }

    function fnGet_serviceAtHome_byRegionId(regionId)
    {
        if(this.serviceListBy_regionId[ utlAsString(regionId) ] !== undefined)
            return this.serviceListBy_regionId[ utlAsString(regionId) ];

        return [];
    }

    function fnGet_filteredService_byGroupId_withRegionFilter(groupId, regionId)
    {
        var out = [];
        var atHomeList = dc.fnBKNow_fnGet_serviceAtHome_byRegionId.call(this, regionId);
        var list = dc.fnBKNow_fnGet_filteredService_byGroupId.call(this, groupId);

        var cnt = list.length;

        for(var i = 0; i < cnt; i++)
        {

            if( utlArrayIndexOf( utlAsInt( list[i].service_id ), this.athome_serviceList) == -1)
            {
                out.push(list[i]);
                continue;
            }


            if( utlArrayIndexOf( utlAsInt( list[i].service_id ), atHomeList) != -1)
                out.push(list[i]);
        }

        return out;
    }

    function fnGet_staffList_byServiceId(service_id)
    {
        var out = [];

        var cnt = this.dsList_staff.length;

        var serviceList;
        for(var i = 0; i < cnt; i++)
        {
            serviceList = dc.fnBKNow_fnGetServiceByStaffId.call(this, utlAsInt(this.dsList_staff[i].staff_id) );

            if(serviceList.length < 1)
                continue;

            if(utlArrayIndexOf( utlAsInt(service_id), serviceList) == -1)
                continue;

            if(utlArrayIndexOf( utlAsInt(this.dsList_staff[i].staff_id), this.nobook_staffList) != -1)
                continue;

            out.push(this.dsList_staff[i]);
        }

        return out;
    }

    function fnGet_staffList_forStartStaff()
    {
        var tmpStaffList = [];
        var cnt = this.dsList_staff.length;

        for(var i = 0; i < cnt; i++)
        {
            if(utlArrayIndexOf( utlAsInt(this.dsList_staff[i].staff_id), this.nobook_staffList) != -1)
                continue;

            tmpStaffList.push(this.dsList_staff[i]);
        }

        return tmpStaffList;
    }

    function fnGet_staffList_byServiceId_withRegionFilter(service_id, regionId)
    {
        var out = [];
        var list = dc.fnBKNow_fnGet_staffList_byServiceId.call(this, service_id);

        if(utlArrayIndexOf( utlAsInt(service_id), this.athome_serviceList) == -1)
            return list;

        var staffRegionList = [];
        if(this.staffListBy_regionId[ utlAsString(regionId) ] !== undefined)
            staffRegionList = this.staffListBy_regionId[ utlAsString(regionId) ];

        var cnt = list.length;

        for(var i = 0; i < cnt; i++)
        {
            if(utlArrayIndexOf( utlAsInt(list[i].staff_id), staffRegionList) == -1)
                continue;

            out.push(list[i]);
        }

        return out;
    }

    function fnTest_regionServiceHasAvailStaff(service_id)
    {
        if( this.staffListBy_service_id[utlAsString(service_id)] === undefined)
            return false;

        var staffList = this.staffListBy_service_id[utlAsString(service_id)];
        staffList = utlFilterArray(staffList, this.nobook_staffList);

        var cnt = staffList.length;
        for(var i = 0; i < cnt; i++)
        {
            if(this.regionsBy_staffId[utlAsString(staffList[i])] !== undefined)
                return true;
        }
        return false;
    }

    function fnTest_regionStaffHasAvailService(staff_id)
    {
        if( this.serviceListBy_staff_id[ utlAsString(staff_id) ] === undefined)
            return false;

        var serviceList = this.serviceListBy_staff_id[ utlAsString(staff_id) ];
        var tmpList = utlFilterArray(serviceList, this.athome_serviceList);

        if(tmpList.length > 0)
            return true;

        if( this.regionsBy_staffId[ utlAsString(staff_id) ] === undefined)
            return false;

        var regionList = this.regionsBy_staffId[ utlAsString(staff_id) ];
        var cnt = regionList.length;

        for(var i = 0; i < cnt; i++)
        {
            if( this.serviceListBy_regionId[ utlAsString(regionList[i]) ] === undefined)
                continue;

            tmpList = utlFindMatchingElements_inArray(this.serviceListBy_regionId[ utlAsString(regionList[i]) ], this.athome_serviceList);

            if(tmpList.length > 0)
                return true;
        }

        return false;
    }

    // == NEW : Payment Related ----------------------

    function fnReq_getBookingInvoice(reqData, cb_success, cb_fail)
    {
        var cbs = cb_success || null;
        var cbf = cb_fail || null;

        dc.fnAjax_asPost(this.session_id, core.getAjaxPath()+'previewBookingBN.php', reqData, cbs, cbf, 'fnBKNow_fnReqSucess_getBookingInvoice', 'fnBKNow_fnReqFail_getBookingInvoice');
    }

    function fnReqSucess_getBookingInvoice(resData, textStatus, jqXHR, cb_success, cb_fail)
    {
        if(utlAsInt_nullOnNaN(resData.result) !== 0)
        {
            var logMsg = "Ajax Response result not valid. Result = " + resData.result;
            dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnReqSucess_getBookingInvoice", logMsg, textStatus, jqXHR, '');
        }

        if(utlIsVarFunction(cb_success) === true)
            cb_success(resData);
    }

    function fnReqFail_getBookingInvoice(resData, textStatus, jqXHR, cb_fail)
    {
        dc.serverLog_xhrV2("DATA_CORE_BOOK_NOW", "LOG_ERR", "dataMod_bookNow.js", "fnReqFail_getBookingInvoice", "Ajax Error Callback Triggered", jqXHR, textStatus, errorThrown);
        if(utlIsVarFunction(cb_fail) === true)
            cb_fail();

    }

    // == NEW : Survey Related ----------------------

    function fnGet_surveyById(survey_id)
    {
        var needle = utlAsInt_nullOnNaN(survey_id);
        if(needle === null)
            return null;

        var cnt = this.dsList_surveys.length;
        for(var i = 0; i < cnt; i++)
        {
            if(utlAsInt_nullOnNaN(this.dsList_surveys[i].survey_id) === needle)
                return this.dsList_surveys[i].questions;
        }

        return null;
    }


    // == NEW get setting by name

    function fnGet_merchantSetting_byName(settingName)
    {
        if(this.bizMercSettings[utlAsString(settingName)] === undefined)
            return null;

        var tmp = this.bizMercSettings[utlAsString(settingName)];

        if(utlEvalAsBool(tmp.enabled) !== true)
            return false;

        return tmp.value;

    }


    // EXPOSE MODULE INTERFACE ////////////////////////
    return {

        // Restricted Access Methods /////////////////////////////////////////////
        _fnPriv_initModule:fnInitModule,
        _fnPriv_initSession:fnInitSession,

        // Properties
        _mod_flag_dataMod_bookNow: true,

        // Standard Access Methods ///////////////////////////////////////////////

        fnBKNow_fnReset_bookNowSessionData:fnReset_bookNowSessionData,
        fnBKNow_fnGetMerchant_byAPIKey:fnGetMerchant_byAPIKey,
        fnBKNow_fnGetMerchant_byUrl:fnGetMerchant_byUrl,
        fnBKNow_getFullData:fnLoadForBookNow,
        fnBKNow_fnAjaxRequest_getBookNow:fnAjaxRequest_getBookNow,
        fnBKNow_fnRequestSuccess_getBookNow:fnRequestSuccess_getBookNow,
        fnBKNow_fnRequestFail_getBookNow:fnRequestFail_getBookNow,
        fnBKNow_fnGenerate_serviceIdx_refList:fnGenerate_serviceIdx_refList,
        fnBKNow_fnProcess_service_group_list:fnProcess_service_group_list,
        fnBKNow_fnTestCanBook:fnTestCanBook,
        fnBKNow_fnPostProcess_group_list:fnPostProcess_group_list,
        fnBKNow_fnGenerate_staffIdx_refList:fnGenerate_staffIdx_refList,
        fnBKNow_fnProcess_staff_service_list:fnProcess_staff_service_list,
        //fnBKNow_getStaffByServiceId:fnGetStaffByServiceId,
        fnBKNow_fnGetStaffByServiceId:fnGetStaffByServiceId,
        //fnBKNow_getServiceByStaffId:fnGetServiceByStaffId,
        fnBKNow_fnGetServiceByStaffId:fnGetServiceByStaffId,
        fnBKNow_getDataByObjectLabel:fnGetDataByObjectLabel,
        fnBKNow_fnTest_this:fnTest_this,
        fnBKNow_fnGenList_servicesOfferedByStaffID:fnGenList_servicesOfferedByStaffID,
        fnBKNow_fnGenList_staffOfferByServiceID:fnGenList_staffOfferByServiceID,
        fnBKNow_fnCheck_staffServiceCount:fnCheck_staffServiceCount,
        fnBKNow_fnCheck_serviceStaffCount:fnCheck_serviceStaffCount,
        fnBKNow_fnGetGroupId_byServiceId:fnGetGroupId_byServiceId,
        fnBKNow_fnGetGroupByStaffId:fnGetGroupByStaffId,

        fnBKNow_fnGetBuffered_serviceGroupById:fnGetBuffered_serviceGroupById,
        fnBKNow_fnGetBuffered_serviceById:fnGetBuffered_serviceById,
        fnBKNow_fnGetBuffered_staffById:fnGetBuffered_staffById,
        fnBKNow_fnTestServiceID_canStaffBook:fnTestServiceID_canStaffBook,
        fnBKNow_fnGetStaffListForServiceId:fnGetStaffListForServiceId,
        fnBKNow_fnProcessRequestData:fnProcessRequestData,
        fnBKNow_fnInjectStaticJSON:fnInjectStaticJSON,
        fnBKNow_setMerchant_id:fnSetMerchant_id,
        fnBKNow_fnForceRequest_serviceByID:fnForceRequest_serviceByID,
        fnBKNow_fnForceReqSuccess_serviceByID:fnForceReqSuccess_serviceByID,
        fnBKNow_fnForceReqFail_serviceByID:fnForceReqFail_serviceByID,
        fnBKNow_fnGetBookNowState:fnGetBookNowState,
        fnBKNow_fnRequestSuccess_getBookNowState:fnRequestSuccess_getBookNowState,
        fnBKNow_fnRequest_getClientInfo:fnRequest_getClientInfo,
        fnBKNow_fnReqSuccess_getClientInfo:fnReqSuccess_getClientInfo,
        fnBKNow_fnReqFail_getClientInfo:fnReqFail_getClientInfo,
        fnBKNow_fnRequest_setClientInfo:fnRequest_setClientInfo,
        fnBKNow_fnReqSuccess_setClientInfo:fnReqSuccess_setClientInfo,
        fnBKNow_fnReqFail_setClientInfo:fnReqFail_setClientInfo,
        fnBKNow_fnSetVirtualGeneralServiceGroup:fnSetVirtualGeneralServiceGroup,
        fnBKNow_fnUpdate_dataOrderGroupList:fnUpdate_dataOrderGroupList,
        fnBKNow_fnGetEvalMerchantSetting_byLabel:fnGetEvalMerchantSetting_byLabel,
        fnBKNow_fnProcess_staffServiceOverride:fnProcess_staffServiceOverride,
        fnBKNow_fnGet_staffServiceOverride:fnGet_staffServiceOverride,
        fnBKNow_fnTest_serviceHasOverride:fnTest_serviceHasOverride,
        fnBKNow_fnTest_serviceHasOverrideByType:fnTest_serviceHasOverrideByType,
        fnBKNow_fnTest_staffHasOverride:fnTest_staffHasOverride,
        fnBKNow_fnTestCanBookById_serviceAndStaff:fnTestCanBookById_serviceAndStaff,
        fnBKNow_fnProcess_regionData:fnProcess_regionData,
        fnBKNow_fnGet_regionsByRegionGroupId:fnGet_regionsByRegionGroupId,
        fnBKNow_fnProcess_regionAssignment:fnProcess_regionAssignment,
        fnBKNow_fnGet_serviceByGroupList_filtherByRegion:fnGet_serviceByGroupList_filtherByRegion,
        fnBKNow_fnGet_filteredService_byGroupId:fnGet_filteredService_byGroupId,
        fnBKNow_fnGet_serviceAtHome_byRegionId:fnGet_serviceAtHome_byRegionId,
        fnBKNow_fnGet_filteredService_byGroupId_withRegionFilter:fnGet_filteredService_byGroupId_withRegionFilter,
        fnBKNow_fnGet_staffList_forStartStaff:fnGet_staffList_forStartStaff,
        fnBKNow_fnGet_staffList_byServiceId:fnGet_staffList_byServiceId,
        fnBKNow_fnGet_staffList_byServiceId_withRegionFilter:fnGet_staffList_byServiceId_withRegionFilter,
        fnBKNow_fnTest_regionServiceHasAvailStaff:fnTest_regionServiceHasAvailStaff,
        fnBKNow_fnTest_regionStaffHasAvailService:fnTest_regionStaffHasAvailService,
        fnBKNow_fnReq_getBookingInvoice:fnReq_getBookingInvoice,
        fnBKNow_fnReqSucess_getBookingInvoice:fnReqSucess_getBookingInvoice,
        fnBKNow_fnReqFail_getBookingInvoice:fnReqFail_getBookingInvoice,
        fnBKNow_fnGet_surveyById:fnGet_surveyById,
        fnBKNow_fnGet_merchantSetting_byName:fnGet_merchantSetting_byName
    };

}());
