function display_tip_vp(ele)
{
    jQuery('.tt_parent_vp').attr('data-open', 'false');
    ele.setAttribute('data-open', 'true');
}

function vpGetStarted_onClick(ele)
{
    var rgx_email = /^[a-z0-9+\._%\-+]{1,256}@[a-z0-9][a-z0-9-]{0,64}(\.[a-z0-9][a-z0-9-]{0,25})+$/i;
    var target = ele.getAttribute('data-target-id');

    if((target === null) || (target === ''))
        return;

    var jq = jQuery('#'+target);

    if(jq.size() === 0)
        return;

    var userEmail = jq.val();

    if(rgx_email.test(userEmail) === false)
    {
        jq.attr('data-is-error', 'true');
        return;
    }

    pushEmailToHubspot(userEmail);

    var redir = jq.attr('data-redir-target');

    if(redir === undefined)
        return;

    if(redir == 'null')
    {
        //show popup
        jQuery('#vp_email_submit_form_box').attr('data-form-complete', 'true');
        vpOpenEmailLBX();
        return;
    }

    var mailArg = '?';
    if( (''+redir).search(/\?/) != -1  )
        mailArg = '&';

    // tag email for sign-up
    if( (''+redir).search('www.booxi.com') != -1  )
    {
        redir += mailArg + 'use_email='+userEmail;
    }

    window.location = redir;

}


function pushEmailToHubspot(emailVal)
{
    var lang = jQuery('body').attr('data-bx-lang');

    var reqData = {email: emailVal};
    reqData.lang = (lang == 'en') ? 'eng' : 'fre';

    var reqPath = 'https://www.booxi.com/web_php/svr/put_record_client_hub.php';
    var request = {
        url:reqPath,
        dataType: 'json',
        type: "POST",
        data: reqData,
        cache: false
    };

    jQuery.ajax(request);
}


function vpResetInput(ele)
{
    if((ele === null) || (ele === undefined))
        return;

    ele.setAttribute('data-is-error', 'false');
}


function vpOpenEmailLBX()
{
    jQuery('#VP-LBX').attr('data-is-open', 'true');
}


function createLBX(url)
{
    var lbx = jQuery('#LBX');
    if(lbx.size() !== 0)
    {
        //lbx.find('.lbx_img').css('background-image', 'url('+url+')');
        lbx.find('img').eq(0).attr('src', url);
        return;
    }

    var h = '';
    h += '<div id="LBX" class="promo_lbx bk_grd120_F5_FF" onclick="hideLBX()">';
    h += '<div class="lbx_inner promo_viewport">';

    h += '<div class="promo_center">';
    h += '<img src="'+url+'">';
    h += '</div>';
    h += '<div class="round_x_close lbx_exit">';
    h += '<div class="round_x_close_inner"></div>';
    h += '</div>';
    h += '</div>';
    h += '</div>';

    jQuery('body').append(h);

    setTimeout(function(){ jQuery('#LBX').attr('data-is-open', 'true'); }, 1);
}

function trigHideLBX()
{
    setTimeout(hideLBX, 0);
}

function vpHideLBX()
{
    jQuery('#VP-LBX').attr('data-is-open', 'false');
    jQuery('#vp_email_submit_form_box').attr('data-form-complete', 'false');
    jQuery('#bx_inp_lbx_email').attr('data-is-error', 'false').val('');

}

function hideLBX()
{
    jQuery('#LBX').attr('data-is-open', 'false');
    setTimeout(function(){ jQuery('#LBX').remove(); }, 250);
}

function showLBX(url)
{
    createLBX(url);
}

//----------------------
function open_ptn_menu_more()
{
    jQuery('#ptn_menu_more').attr('data-state-open', 'true');
}


function wpNavMenuClk(ele, evt)
{
    evt.stopImmediatePropagation();

    if(document.getElementById('wp_nav_menu_xx') !== null)
    {
        jQuery('#wp_nav_menu_xx').remove();
        return;
    }

    var jq = jQuery(ele).find('.bxh_menu').eq(0).clone();
    var box = jQuery('<div id="wp_nav_menu_xx" class="wp_nav_float_menu br_t6"></div>');
    box.append(jq);
    jQuery('body').append(box);
    box.attr('data-menu-open', 'true');
}


function evalAsLink(ele, evt)
{
    evt.stopImmediatePropagation();


    var link = ele.getAttribute('data-href');

    if( (link !== '') && (link !== null) )
        window.location = link;

}


function clearNavDropMenu()
{

    //bxh_parent
    //data-menu-open="false"
    jQuery('.tt_parent_vp').attr('data-open', 'false');
    jQuery('.bxh_parent').attr('data-menu-open', 'false');
    jQuery('#wp_nav_menu_xx').remove();
}

function searchKeyPress(ele, evt)
{
    //http://localhost/booxi_wp/en/
    var form = document.getElementById('menu-search-box');

    if( (form !== null) && (form.submit !== undefined) )
        form.submit();
}


function openSocialShare(ele)
{
    var share_url = ele.getAttribute('href');
    var w_width = 635;
    var w_height = 435;

    var left = (screen.width/2) - (w_width/2);
    var top = (screen.height/2) - (w_height/2);
    window.open(share_url, "_blank", "resizable=no, width="+w_width+", height="+w_height+", top="+top+", left="+left+"");
}


function utlToggle_uxSideMenu(ele)
{
    var jq = jQuery(ele);

    var state = (jq.attr('data-open') !== "true");
    jq.attr('data-open', (''+state));
}

function close_img_lbx()
{
    jQuery('#promo_lbx').remove();
}


function bx_show_img_full(ele)
{
    close_img_lbx();

    var img_url = ele.getAttribute('src');
    var h = '';

    h += '<div id="promo_lbx" class="oneRem promo_lbx" data-show="true">';

    h += '<div class="round_x_close lbx_exit" onclick="close_img_lbx();">';
    h += '<div class="round_x_close_inner"></div>';
    h += '</div>';

    h += '<div class="H W promo_viewport">';
    h += '<div class="promo_center">';
    h += '<img src="'+img_url+'" />';
    h += '</div>';
    h += '</div>';
    h += '</div>';

    jQuery('body').append(h);
}


function getTileFormData(action)
{
    var id = jQuery("#bx_tile_id").val();
    if(id == 'NEW')
        action = "create_tile";

    return {
        action: action, //"update_tile",
        id: id,
        label: jQuery("#bx_tile_label").val(),
        title: jQuery("#bx_tile_title").val(),
        sub_title: jQuery("#bx_tile_sub_title").val(),
        icon: jQuery("#bx_tile_icon").val(),
        link_type: jQuery("#bx_tile_link_type").val(),
        link_value: jQuery("#bx_tile_link_value").val(),
        show_tile: jQuery("#bx_tile_show_tile").val()
    };
}

function update_bx_tile()
{
    var path = jQuery("#tile_page_path").val(); ////leads_page_path
    var ds = getTileFormData("update_tile");

    jQuery.ajax({
        type: 'POST',   // Adding Post method
        url: the_ajax_script.ajaxurl, // Including ajax file
        data: ds, // Sending data to action function. // Sending data to action function.
        success: function(data)
        {
            // redirect after delete a record
            window.location = path;
        }
    });

}


//////////////////////////////////////////////////////////////

function utlBxhClick(ele, evt)
{
    evt.stopImmediatePropagation();

    var nstate = !(ele.dataset.menuOpen === "true");
    jQuery('.bxh_parent').attr('data-menu-open', 'false');

    if(nstate)
        ele.dataset.menuOpen = (''+nstate);

    //return true;
}

function openMenu()
{
    jQuery("body").addClass('sml-open');
    jQuery(".menuclose").css("display","block");
}

function hideMenu()
{
    setTimeout(function(){
        jQuery("body").removeClass('sml-open');
        jQuery(".menuclose").css("display","none");
    }, 0);
    // stops the click from propagating
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}

function getLeadFormData_create(action)
{
    return {
        action: action, //"insert_lead",
        business_name: jQuery("#business_name").val(),
        business_segment: jQuery("#business_segment").val(),
        business_postalcode: jQuery("#business_postalcode").val(),
        business_city: jQuery("#business_city").val(),
        business_province: jQuery("#business_province").val(),
        business_address_line: jQuery("#business_address_line").val(),
        business_country: jQuery("#business_country").val(),
        client_name: jQuery("#client_name").val(),
        client_phone: jQuery("#client_phone").val(),
        client_email: jQuery("#client_email").val(),
        signup_step: jQuery("#signup_step").val(),
        promo_code_submitted: jQuery("#promo_code_submitted").val()
    };
}

function validate_html_form()
{
    var mail_pat = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var fValid = true;

    var jq_business_name = jQuery("#business_name");
    var jq_client_name = jQuery("#client_name");
    var jq_client_phone = jQuery("#client_phone");
    var jq_client_email = jQuery("#client_email");

    if(jq_business_name.val() === '')
    {
        jq_business_name.attr('data-valid', 'false');
        fValid = false;
    }

    if(jq_client_name.val() === '')
    {
        jq_client_name.attr('data-valid', 'false');
        fValid = false;
    }

    if(jq_client_phone.val() === '')
    {
        jq_client_phone.attr('data-valid', 'false');
        fValid = false;
    }

    if(jq_client_email.val() !== '')
    {
        if(mail_pat.test(jq_client_email.val()) === false)
        {
            jq_client_email.attr('data-valid', 'false');
            fValid = false;
        }
    }

    return fValid;
}

function form_leads_submit()
{
    var path = jQuery("#leads_page_path").val(); ////leads_page_path
    var ds = getLeadFormData_create("insert_lead");

    if(validate_html_form())
    {
        jQuery.ajax({
            type: 'POST',   // Adding Post method
            url: the_ajax_script.ajaxurl, // Including ajax file
            data:ds,
            success: function(data)
            {
                window.location = path;
            }
        });
    }
    else
    {
        window.scrollTo(0, 0);
    }
}

function delete_my_lead(lead_id){

  if (confirm("Are you sure you want to DELETE?")){
    var path = window.location.pathname; // -> "/wordpress/en/find-my-lead/"
    var id = lead_id; //jQuery("#lead_id").val();
    var num = -1;
    var stat = parseInt(num);
    jQuery.ajax({
        type: 'POST',   // Adding Post method
        url: the_ajax_script.ajaxurl, // Including ajax file
        data: {"action": "delete_lead", "lead_id":id, "lead_status":stat}, // Sending data dname to post_word_count function.
          success: function(data){ // Show returned data using the function.
            // redirect after delete a record
              alert("delete was a success");
              alert(status);
               window.location = path;
          }
      });
  }else {
    alert("The Delete was canceled");
  }
}

function getLeadFormData_update(action)
{
    var lead_id = jQuery("#lead_id").val() || -1;

    return {
        action: action, //"update_lead",
        lead_id: lead_id,
        business_name: jQuery("#business_name").val(),
        business_segment: jQuery("#business_segment").val(),
        business_address_line: jQuery("#business_address_line").val(),
        business_postalcode: jQuery("#business_postalcode").val(),
        business_city: jQuery("#business_city").val(),
        business_province: jQuery("#business_province").val(),
        business_country: jQuery("#business_country").val(),
        client_name: jQuery("#client_name").val(),
        client_phone: jQuery("#client_phone").val(),
        client_email: jQuery("#client_email").val(),
        signup_step: jQuery("#signup_step").val()
    };
}

function update_my_lead()
{
    if(validate_html_form())
    {
        var path = jQuery("#leads_page_path").val(); ////leads_page_path
        var ds = getLeadFormData_update("update_lead");
        jQuery.ajax({
            type: 'POST',   // Adding Post method
            url: the_ajax_script.ajaxurl, // Including ajax file
            data: ds, // Sending data to action function. // Sending data to action function.
            success: function(data)
            {
                window.location = path;
            }
        });
    }
    else
    {
        window.scrollTo(0, 0);
    }
}



/* ----------------------- */

function toggleLeadsMenu(ele)
{
    var v = (ele.parentNode.dataset.menuOpen == "true");
    ele.parentNode.dataset.menuOpen = (''+(!v));
}

function toggleLeadsExtraView(ele)
{
    ele.parentNode.parentNode.dataset.menuOpen = 'false';
    var p = jQuery(ele).parents('.lead_item');

    if(p.size() === 0)
        return;

    var v = (p.eq(0).attr('data-menu-open') == "true");

    p.eq(0).attr('data-menu-open', (''+(!v)));

}

function filterLeads()
{
    var url = jQuery('#lead_head_page_url').val();
    var status = jQuery('#lead_head_status_code').val();
    var filter = jQuery('#lead_head_label_filter').val();

    if((url === undefined) || (url === ''))
        return;

    var args = '';
    var biz = '';

    if((status !== undefined) && (status !== '') && (status !== '-1'))
        args = 'statusfilter='+status;

    if((filter !== undefined) && (filter !== ''))
        args = (args === '') ? 'txfilter='+filter : '&txfilter='+filter;

    if((filter !=='') && (status !== ''))
    // for both filters
      args = 'statusfilter='+status+'&txfilter='+filter;

    if((status == '-1') && (filter !== ''))
      args = 'txfilter='+filter;

    args = (args.length > 0) ? '?' + args : '';

    window.location = url + args;
}


function openPasswordMenu()
{
    jQuery("#password_light_box").attr('data-open', 'true')
}

function closePasswordMenu()
{
    jQuery("#password_light_box").attr('data-open', 'false')
}

function form_pass_submit()
{
    //var x = jQuery("#bx_change_pass_form");
    //console.debug(x);

    jQuery("#bx_change_pass_form").eq(0).submit();
}

function validatePasswordChange()
{
    var p1 = jQuery("#new_pass_one");
    var p2 = jQuery("#new_pass_two");
    var user = jQuery("#user_id");

    p1.attr("data-valid", 'true');
    p2.attr("data-valid", 'true');

    var val_p1 = p1.val() || '';
    var val_p2 = p2.val() || '';

    if(val_p1 === '') p1.attr("data-valid", 'false');
    if(val_p2 === '') p2.attr("data-valid", 'false');


    if(user === undefined )
        return false;

    if((p1 === '') || (p2 === ''))
        return false;


    if(p1 != p2)
    {
        p1.attr("data-valid", 'false');
        p2.attr("data-valid", 'false');
        return false;
    }


    return true;

}
///////////////////////////////////

function testMenu(ele, evt)
{
    evt.stopImmediatePropagation();

    var p = ele.parentNode.parentNode;

    p.dataset.open = (p.dataset.open != 'true');

    return false;
}

function redirectLeads()
{
  // will need to reconfigure for live
  var page_url = "http://localhost/wordpress/index.php/en/creating-a-lead/";
   window.location = page_url;
}


// ADVERT SCROLL BEHAVIOR

function evalUsePromo()
{
    var usePromo = jQuery('body').eq(0).attr('data-use-promo');

    if(usePromo == 'false')
        return; // no promo

    if(usePromo == 'true')
    {
        calculatePromo();
        return;
    }


    var promo = jQuery('#bx_promo_slide');
    var promo_start = jQuery('#bx_promo_start');
    var promo_end = jQuery('#bx_promo_end');

    if( (promo.length === 0) || (promo_start.length === 0) ||(promo_end.length === 0))
    {
        jQuery('body').eq(0).attr('data-use-promo', 'false');
    }
    else
    {
        jQuery('body').eq(0).attr('data-use-promo', 'true');
    }
}

function calculatePromo()
{
    var scrollTop = jQuery(window).scrollTop();
    var start = jQuery('#bx_promo_start').offset().top;
    var end = jQuery('#bx_promo_end').offset().top;

    if( (scrollTop > start) && (scrollTop < end))
        jQuery('#bx_promo_slide').attr('data-open', 'true');
    else
        jQuery('#bx_promo_slide').attr('data-open', 'false');
}

function close_bx_promo()
{
    jQuery('#bx_promo_slide').attr('data-open', 'false');
    jQuery('body').eq(0).attr('data-use-promo', 'false');
}

jQuery(document).ready(function($)
{
    jQuery(document).scroll(function()
    {
        jQuery('#promo_lbx').remove();
        evalUsePromo();
    });

});
