// ==UserScript==
// @name           Magnets to rTorrent
// @include        /.*1337x\.to.*$/
// @include        /.*thepiratebay\.org.*$/
// @description    Magnets to rTorrent
// @version        1.0
// @run-at document-idle
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// ==/UserScript==
// 1.0 Initial

// Purpose: Make web page magnet URLs auto-post to your seedhost when clicked
//          Remove web page onclick() snoopy actions etc
// Setup:   Configure the four variables below before using
//          Use Chrome Developer Tools Network tab to acquire the
//          Basic auth value via an inital manual magnet add. It's in the HTTP headers

var seedhost_url = 'https://my.seedhost.com';
var seedhost_user = 'myuserid';
var seedhost_auth = 'abcdefbeefcoffeecacaca';
var magnet_done  = 'dookiepoo';

function seedhost_add(event) {
    var magnet_a = this;
    var magnet_url = magnet_a.dataset.magnet;
    // console.log('seedhost data : ' + magnet_url);
    GM_xmlhttpRequest({
        method: "POST",
        url: seedhost_url + '/' + seedhost_user + '/rutorrent/php/addtorrent.php',
        headers:{'Content-type':'application/x-www-form-urlencoded'},
        data: "url=" + encodeURIComponent(magnet_url),
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Basic ' + seedhost_auth); },
        onload: function(xhr) {
            // console.log('seedhost:' + xhr.responseText);
            magnet_a.style.backgroundColor='gold';
        }
    });
    event.preventDefault && event.preventDefault();
    return(false);
}

function fixmags() {
    var magnets = document.querySelectorAll('a[href^="magnet:"]');
    if (magnets) {
        for (var a = 0; a < magnets.length; a++) {
            if (magnets[a].classList.contains(magnet_done)) {
                // do nothing, already done it
            } else {
                //
                // Remove the A classes, innerHTML and all events
                //
                magnets[a].className = magnet_done;
                magnets[a].dataset.magnet = magnets[a].href;
                magnets[a].href = '#';
                magnets[a].onclick = null;
                magnets[a].mouseup = null;
                magnets[a].beforeunload = null;
                magnets[a].removeAttribute('onclick');
                magnets[a].innerHTML = "<B>MAG</B>";
                magnets[a].style.backgroundColor = 'white';
                magnets[a].addEventListener('click', seedhost_add);
                var element = magnets[a].parentNode;
                var els = [];
                while (element) {
                    element.onclick = null;
                    element.mouseup = null;
                    els.unshift(element);
                    element = element.parentNode;
                }
                document.onclick = null;
            }
        }
    }
}

fixmags();
setTimeout(fixmags, 3000);

(function () {
    var events = [ "mousedown", "scroll", "load", "DOMContentLoaded" ];
    for(var e = 0; e < events.length; e++) {
        window.addEventListener(events[e], () => { fixmags(); setTimeout(fixmags, 3000); });
        document.getElementsByTagName('script').type = "text/gzip";
        window.onbeforeunload = null;
        document.onclick = null;
    }
})();
