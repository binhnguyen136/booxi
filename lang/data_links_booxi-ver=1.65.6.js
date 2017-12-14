var altServerConst = "https://site.booxi.com/";

if(window.__site_env__ === 'booxi-test')
    altServerConst = "https://dev-site.booxi.com/";

_link = {};

_link.eng = {
    bizlogin :          'https://app.booxi.com/?locale=en#login',
    bizlogin_test :     'https://app.booxi.com/?env=dev&locale=en#login',
    home :              '',
    home_baked :        'en',
    feat_roi:           'roi',
    feat_page:          'features',
    search :            altServerConst,
    everyone :          'everyone',
    everyone_faq :      'everyone/faq',
    business :          'business',
    business_faq :      'business/faq',
    signup :            'business/signup',
    signup_done :       'complete',
    signup_complete :   'complete',
    about :             'about',
    press :             'about/press',
    legal :             'about/privacy-legal',
    company :           'about/company',
    fordev :            'developers',
    developers :        'developers',
    parnters_pages :    'https://www.booxi.com/partners/index-en/',
    associations :      'associations-schools',
    affiliates :        'affiliates',
    technology :        'technology',
    blog :              'https://www.booxi.com/blog/index-en/',
    feat_appointment :  'business/appointments',
    feat_clients :      'business/client-relations',
    feat_website :      'business/website',
    feat_manage :       'business/management',
    pricing:            'business/pricing',
    form_sales:         'form/sales',
    form_sales_ls:      'form/ls-sales',
    dev_book_now:       'developers/booknow',
    dev_wordpress:      'developers/wordpress',
    dev_wix:            'developers/wix',
    dev_ls:             'developers/lightspeed',
    // NEW
    web_store_apple :   'https://itunes.apple.com/ca/app/booxi-for-business/id742658170?mt=8&uo=4&l=en',
    web_store_google :  'https://play.google.com/store/apps/details?id=com.booxi.merchant&hl=en',
    social_facebook :   'https://www.facebook.com/booxicom',
    social_twitter :    'https://twitter.com/booxicom',
    social_linkedin :   'https://www.linkedin.com/company/booxi',
    social_google :     'https://plus.google.com/+booxicom/posts',
    social_youtube :    'https://www.youtube.com/channel/UCMNYIrJIXDZ6WWHUclnK28Q',
    // -------------
    help_center :       'http://help.booxi.com/english',
    vp__salon :         'https://www.booxi.com/b/salon-software/',
    vp__massage_therapy:'https://www.booxi.com/b/massage-therapy-software/',
    vp__nail_salon :    'https://www.booxi.com/b/nail-salon-software/',
    vp__nutritionist :  'https://www.booxi.com/b/nutritionist-software/',
    vp__pet_grooming :  'https://www.booxi.com/b/pet-grooming-software/',
    vp__osteopath :     'https://www.booxi.com/b/osteopath-software/',
    vp__eyelash :       'https://www.booxi.com/b/eyelash-extension-software/',
    vp__chiropractor :  'https://www.booxi.com/b/chiropractor-software/',
    vp__bike_shop :     'https://www.booxi.com/b/bike-shop-software/',
    vp__beauty :        'https://www.booxi.com/b/beauty-salon-software/',
    vp__tanning_salon : 'https://www.booxi.com/b/tanning-salon-software/',
    vp__tattoo :        'https://www.booxi.com/b/tattoo-shop-software/',
    //video links
    vid_idx_1:          'videos/shouli',
    vid_idx_2:          'videos/ragnok',
    vid_idx_3:          'videos/sab3000',
    contact_page:       'https://www.booxi.com/blog/index-en/#contact'
};

_link.fre = {
    bizlogin :          'https://app.booxi.com/?locale=fr#login',
    bizlogin_test :     'https://app.booxi.com/?env=dev&locale=fr#login',
    home :              '',
    home_baked :        'fr',
    feat_roi:           'retour-sur-investissement',
    feat_page:          'fonctionnalites',
    search :            altServerConst,
    everyone :          'tous',
    everyone_faq :      'tous/faq',
    business :          'affaires',
    business_faq :      'affaires/faq',
    signup :            'affaires/inscription',
    signup_done :       'complet',
    signup_complete :   'complet',
    about :             'a-propos',
    press :             'a-propos/presse',
    legal :             'a-propos/mentions-legales',
    company :           'a-propos/entreprise',
    fordev :            'developpeurs',
    developers :        'developpeurs',
    parnters_pages :    'https://www.booxi.com/partners/index-fr/',
    associations :      'associations-ecoles',
    affiliates :        'affilies',
    technology :        'technologie',
    blog :              'https://www.booxi.com/blog/index-fr/',
    feat_appointment :  'affaires/rendez-vous',
    feat_clients :      'affaires/relation-client',
    feat_website :      'affaires/site-web',
    feat_manage :       'affaires/gestion-flexible',
    pricing:            'affaires/tarification',
    form_sales:         'form/ventes',
    form_sales_ls:      'form/ls-ventes',
    dev_book_now:       'developpeurs/booknow',
    dev_wordpress:      'developpeurs/wordpress',
    dev_wix:            'developpeurs/wix',
    dev_ls:             'developpeurs/lightspeed',
    // NEW
    web_store_apple :   'https://itunes.apple.com/ca/app/booxi-for-business/id742658170?mt=8&uo=4&l=fr',
    web_store_google :  'https://play.google.com/store/apps/details?id=com.booxi.merchant&hl=fr',
    social_facebook :   'https://www.facebook.com/booxicom',
    social_twitter :    'https://twitter.com/booxicom',
    social_linkedin :   'https://www.linkedin.com/company/booxi',
    social_google :     'https://plus.google.com/+booxicom/posts',
    social_youtube :    'https://www.youtube.com/channel/UCMNYIrJIXDZ6WWHUclnK28Q',
    // -------------
    help_center :       'http://help.booxi.com/french',
    vp__salon :         'https://www.booxi.com/b/logiciel-salons-de-coiffure/',
    vp__massage_therapy:'https://www.booxi.com/b/massotherapeutes/',
    vp__nail_salon :    'https://www.booxi.com/b/salon-de-manucure/',
    vp__nutritionist :  'https://www.booxi.com/b/nutritionnistes/',
    vp__pet_grooming :  'https://www.booxi.com/b/logiciel-toiletteur-pour-animaux/',
    vp__osteopath :     'https://www.booxi.com/b/osteopathes/',
    vp__eyelash :       'https://www.booxi.com/b/extensions-de-cils/',
    vp__chiropractor :  'https://www.booxi.com/b/chiropraticien/',
    vp__bike_shop :     'https://www.booxi.com/b/magasin-de-velos/',
    vp__beauty :        'https://www.booxi.com/b/salon-de-beaute/',
    vp__tanning_salon : 'https://www.booxi.com/b/tanning-salon-software',
    vp__tattoo :        'https://www.booxi.com/b/logiciel-salon-de-tatouage/',
    //video links
    vid_idx_1:          'videos-fr/shouli',
    vid_idx_2:          'videos-fr/ragnok',
    vid_idx_3:          'videos-fr/sab3000',
    contact_page:       'https://www.booxi.com/blog/index-fr/#contact'
};



_link.spa = $.extend(true, {}, _link.eng); // cloneBaseObject( _link.eng );
//_link.spa.search = 'buscar';
_link.spa.bizlogin = 'https://app.booxi.com/?locale=es#login';
_link.spa.bizlogin_test = 'https://app.booxi.com/?env=dev&locale=es#login';


_link.por = $.extend(true, {}, _link.eng); // cloneBaseObject( _link.eng );
//_link.por.search = 'search-pt';
_link.por.bizlogin = 'https://app.booxi.com/?locale=pt#login';
_link.por.bizlogin_test = 'https://app.booxi.com/?env=dev&locale=pt#login';


_link.nld = $.extend(true, {}, _link.eng); // cloneBaseObject( _link.eng );
//_link.nld.search = 'search-nl';