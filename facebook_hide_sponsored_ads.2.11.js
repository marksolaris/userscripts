// ==UserScript==
// @name         Hide Ads on Facebook
// @version      2.11
// @description  Hide sponsored feeds on Facebook
// @include      https://*facebook.com*
// @exclude      https://*facebook.com/search*
// @exclude      https://*facebook.com/groups*
// @grant        none
// ==/UserScript==
// 1.25 - original
// 2.00 - FB new format 2020-08-02
// 2.01 - Shorter xpath
// 2.02 - FB hides Sponsored in <B>S</B>
// 2.03 - upload.facebook.com
// 2.04 - Generic count up container killer
// 2.05 - Invisible <B> -'s.
// 2.07 - include fixes
// 2.09 - Manual SPAN checks and use display=none 2021-08-26
// 2.10 - -
// 2.10 - B added

const HideAds = ()=> {
    examine_articles("//div[starts-with(@data-pagelet, 'FeedUnit_') and not(contains(@class,'divcleaned'))]");
}

function examine_articles(xpath) {
    var xpath_elements = scan_xpath(xpath);
    xpath_elements.forEach(examine_article);
}

function examine_article(target_element) {
    var nuke_it = false;
    var found_count = 0;
    console.log('examining target_element ' + target_element.tagName);
    var element_static_bs = target_element.querySelectorAll("B");
    if (element_static_bs) {
        for (var idx = 0; idx < element_static_bs.length; ++idx) {
            if (nuke_it) { continue; } // it's already dead, stop kicking
            if (! element_static_bs[idx]) { continue; }
            var text = element_static_bs[idx].textContent || element_static_spans[idx].innerText;
            if (text == 'n') { found_count++; console.log('found n'); }
            if (text == 'd') { found_count++; console.log('found d'); }
            if (text == 'p') { found_count++; console.log('found p'); }
            if (text == 'o') { found_count++; console.log('found o'); }
            if (found_count >= 4) { nuke_it = true; console.log('nuking Sponsored'); }
        }
    }
    var element_static_spans = target_element.querySelectorAll("SPAN");
    if (element_static_spans) {
        for (idx = 0; idx < element_static_spans.length; ++idx) {
            var style = element_static_spans[idx].getAttribute('style');
            // console.log("style is " + style);
            if (style == 'position: absolute; top: 3em;') { clear(element_static_spans[idx]); } // rude
        }
        for (idx = 0; idx < element_static_spans.length; ++idx) {
            if (nuke_it) { continue; } // it's already dead, stop kicking
            if (! element_static_spans[idx]) { continue; }
            text = element_static_spans[idx].textContent || element_static_spans[idx].innerText;
            if (text == 'S') { found_count++; console.log('found S'); }
            if (text == 'p') { found_count++; console.log('found p'); }
            if (text == 'o') { found_count++; console.log('found o'); }
            if (text == '-') { found_count++; console.log('found -'); }
            if (found_count >= 3) { nuke_it = true; console.log('nuking Sponsored'); }
            if (text == 'Subscribe') { nuke_it = true; console.log('nuking Subscribe'); }
            if (text == 'Shop Now') { nuke_it = true; console.log('nuking Shop Now'); }
            if (text == 'Donate Now') { nuke_it = true; console.log('nuking Donate Now'); }
            if (text == 'Learn More') { nuke_it = true; console.log('nuking Learn More'); }
            if (text == 'Watch More') { nuke_it = true; console.log('nuking Watch More'); }
            if (text == 'Suggested for you') { nuke_it = true; console.log('nuking Suggested for you'); }
            if (text == 'Ask the seller for more details') { nuke_it = true; console.log('nuking Ask the seller for more details'); }
        }
    }
    var element_static_as = target_element.querySelectorAll("A");
    if (element_static_as) {
        for (idx = 0; idx < element_static_as.length; ++idx) {
            if (nuke_it) { continue; }
            var href = element_static_as[idx].getAttribute('href');
            // console.log("A href is " + href);
            if (href.startsWith("/ad")) { nuke_it = true; console.log('nuking href /ad'); }
        }
    }
    if (nuke_it) {
        console.log('examine_article nuking!');
        target_element.style.display = "none";
        target_element.classList.add("divcleaned");
    } else { // didn't need nuking, so don't look again
        target_element.classList.add("divcleaned");
    }
    delete nuke_it;
    delete element_static_spans;
}

function scan_xpath (xpath) {
    try {
        const xpath_nodes = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        const xpath_elements = [];
        let xpath_element = null;
        while (xpath_element = xpath_nodes.iterateNext()) {
            xpath_elements.push(xpath_element);
        }
        return xpath_elements;
    } catch(err) {
        ;
    }
}

function clear(node) {
    while (node.hasChildNodes()) { clear(node.firstChild); }
    node.remove();
}

HideAds()
setTimeout(HideAds, 3000);
(function() {
    window.addEventListener('scroll', ()=>{
        HideAds()
        setTimeout(HideAds, 3000);
    });
})();
