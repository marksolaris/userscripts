// ==UserScript==
// @name           Facebook Link Cleanse Spa
// @include        *://*facebook.com*
// @description    Remove tracking URL components
// @version        1.8
// @run-at document-idle
// @grant unsafeWindow
// ==/UserScript==

function remove_l_php() {
    var anchors = document.getElementsByTagName('a');
    for(var i=0; i<anchors.length; i++){
        var raw_url = anchors[i].getAttribute('href');
        if(raw_url && raw_url.match(/(http|https):\/\/(l|www).facebook.com\/l\.php\?u\=(.*)/g)) {
            console.log("link pre-cleaning " + raw_url);
            raw_url = raw_url.replace(/(http|https):\/\/(l|www).facebook.com\/l\.php\?u\=/g, '');
            raw_url = raw_url.replace(/\&h\=.*/g, '');
            if (anchors[i].classList != null) {
                var classes = anchors[i].classList;
                var classarray = classes.values();
                for (var classname of classarray) {
                    if (classname) { anchors[i].classList.remove(classname); }
                }
            }
            anchors[i].setAttribute('class', '');
            anchors[i].setAttribute('onclick', '');
            anchors[i].setAttribute('target', '_blank');
            var clean_url = decodeURIComponent(raw_url);
            anchors[i].setAttribute('href', clean_url);
            anchors[i].removeAttribute("onclick");
            console.log("link post-cleaned " + clean_url);
            let anchorclone = anchors[i].cloneNode(true); // react memoizedProp fix
            anchors[i].parentNode.appendChild(anchorclone);
            anchors[i].remove();
        }
    }
}

function clean_key_value(param) {
    if (param == null) { return; }
    var anchors = document.getElementsByTagName('a');
    if (anchors == null) { return; }
    var param_rex = new RegExp(param, "i");
    var local_regex = new RegExp('^\/', "i");
    var fb_regex = new RegExp('^https:\/\/www.facebook.com\/', "i");
    var amp_rex_str = '\\&' + param + '\.\*';
    var qtn_rex_str = '\\?' + param + '\.\*';
    var amp_rex = new RegExp(amp_rex_str, "g");
    var qtn_rex = new RegExp(qtn_rex_str, "g");
    for(var i=0; i<anchors.length; i++){
        if (anchors[i] == null) { continue; }
        var raw_url = anchors[i].getAttribute('href');
        if (raw_url == null) { continue; }
        if (raw_url.match(local_regex)) { continue; } // tags on the site OK
        if (raw_url.match(fb_regex)) { continue; } // tags on the site OK
        if (raw_url.match(param_rex)){ // if /fbclid=/i
            console.log('clean_key_value: ' + param + " URL is " + raw_url);
            var raw_url_one = raw_url.replace(amp_rex, ''); // s/&.*//;
            var raw_url_two = raw_url_one.replace(qtn_rex, ''); // s/?.*//;
            if (anchors[i].classList != null) {
                var classes = anchors[i].classList;
                var classarray = classes.values();
                for (var classname of classarray) {
                    if (classname) { anchors[i].classList.remove(classname); }
                }
            }
            anchors[i].removeAttribute("onclick");
            anchors[i].setAttribute('href', raw_url_two);
            anchors[i].setAttribute('href', raw_url_two);
            console.log('clean_key_value: ' + param + " fixed is " + raw_url_two);
         }
    }
}

function parse_all_url_params() {
    clean_key_value('campaign_id=');
    clean_key_value('fbclid=');
    // clean_key_value('fbid=');
    clean_key_value('fref=');
    clean_key_value('fcref=');
    clean_key_value('fb_ref=');
    clean_key_value('ref=');
    clean_key_value('acontext=');
    clean_key_value('__tn__=');
    clean_key_value('hc_ref=');
    clean_key_value('hc_location=');
    clean_key_value('eid=');
    clean_key_value('__xts__%5B0%5D=');
    clean_key_value('cmpid=');
    clean_key_value('utm_source=');
    clean_key_value('utm_medium=');
    clean_key_value('utm_campaign=');
}

function tidy() {
    remove_l_php();
    parse_all_url_params();
}

tidy();
setTimeout(tidy, 3000);

(function () {
    window.addEventListener('scroll', () => {
        tidy();
        setTimeout(tidy, 3000);
    });
})();
