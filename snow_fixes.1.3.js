// ==UserScript==
// @name           SNOW cleanup
// @include        *://*site.service-now.com/*
// @include        *://site.service-now.com/*
// @namespace      https://site.service-now.com
// @description    Don't eat yellow SNOW
// @version        1.3
// @run-at document-idle
// @grant unsafeWindow
// ==/UserScript==
// 1.0 Initial
// 1.2 Convert to functions

function remove_classes(nuke_classes) {
    var nuke_elements = document.querySelectorAll(nuke_classes);
    if (nuke_elements.length) {
        for (var c = 0; c < nuke_elements.length; c++) { nuke_elements[c].parentNode.removeChild(nuke_elements[c]); }
    }
}

function change_label_text(from, to, find_class) {
    var text_labels = document.getElementsByClassName(find_class);
    if (text_labels) {
        for (var l = 0; l < text_labels.length; l++) {
            if (text_labels[l].textContent) {
                if (text_labels[l].textContent.includes(from)) { text_labels[l].textContent = to; }
            }
        }
    }
}

function shorten_company_names(uuid, new_text) {
    var iframes = document.getElementsByTagName('iframe')
    if (iframes) {
        for (var i = 0; i < iframes.length; i++) {
            var innerDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
            if (innerDoc) {
                var text_nodes = innerDoc.querySelectorAll('[sys_id="' + uuid + '"]');
                if (text_nodes) { for (var a = 0; a < text_nodes.length; a++) { text_nodes[a].textContent = new_text; } }
            }
        }
    }
}

function tidy() {
    shorten_company_names('abcdef9f4fb8d60022c7202abcdefghi', 'Company');
    shorten_company_names('abcdefbd4f095a0022c7202abcdefghi', 'Company2');
    shorten_company_names('abcdef6b4f2a2240fda08ddabcdefghi', 'Company3');
    shorten_company_names('abcdef85db4d0b0046a5fc1abcdefghi', 'Company4');
    shorten_company_names('abcdefbedbdd33086e88da8abcdefghi', 'Company5');
    shorten_company_names('abcdefbd4f095a0022c7202abcdefghi', 'Company6');
    shorten_company_names('abcdefbd4f095a0022c7202abcdefghi', 'Company7');
    change_label_text('Technical Notification', 'Work+Public Notes', "label-text");
    change_label_text('Business Notification', 'Public Notes', "label-text");
    change_label_text('PENDING INFORMATION', 'Wait Info', "vt");
    change_label_text('PENDING CUSTOMER', 'Wait Cust', "vt");
    change_label_text('PENDING CHANGE', 'Wait CHG', "vt");
    change_label_text('Scheduled', 'Sched', "vt");
    change_label_text('3 - Moderate', '3', "vt");
    remove_classes('.list_decoration_cell.col-small.col-center'); // tick box and (i) thing
    remove_classes('.col-control.list-decoration-table'); // table header
}

tidy();
setTimeout(tidy, 3000);

(function () {
    var events = [ "scroll", "load", "DOMContentLoaded" ];
    var iframes = document.getElementsByTagName('iframe');
    for(var e = 0; e < events.length; e++) {
        window.addEventListener(events[e], () => { tidy(); setTimeout(tidy, 3000); });
        if (iframes) {
            for (var i = 0; i < iframes.length; i++) {
                iframes[i].addEventListener(events[e], () => { tidy(); setTimeout(tidy, 3000); });
            }
        }
    }
})();
