
    if(window.__geo__ !== undefined)
    {
        delete window.__geo__;
    }

    function notify_i18n()
    {
        if(window.__i18n__ !== undefined)
            window.__i18n__.fnSetCountryCode(__geo__);
        else
            setTimeout(notify_i18n, 100);
    }

    try
    {
        var __geo__ = {country:'VN', region:'', city:'hochiminh', lat:'45.508670', lng:'-73.553992'};
        notify_i18n();
    }
    catch(err)
    {
        var __geo__ = {country:"CA", region:"qc", city:"Montreal", lat:"45.508670", lng:"-73.553992"};
        notify_i18n();
    }
    