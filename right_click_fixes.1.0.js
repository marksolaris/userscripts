// ==UserScript==
// @name           Right click fixes - regain context menu
// @include        *://*alamy.com/*
// @include        *://www.twitter.com/*
// @description    Right click fixes
// @version        1.0
// @run-at document-idle
// @grant unsafeWindow
// ==/UserScript==

function enable_right_click() {
    window.oncontextmenu = null;
    var elements = document.getElementsByTagName("*");
    for(var id = 0; id < elements.length; ++id) {
        elements[id].oncontextmenu = null;
    }
}

function tidy() {
    enable_right_click();
}

tidy();
setTimeout(tidy, 3000);

(function () {
    let events = [
        "scroll", "click", "uiHasInjectedNewTimeline", "uiHasInjectedOldTimelineItems",
        "uiHasInjectedRangeTimelineItems", "uiHasInjectedNewTimelineItems", "uiOverlayPageChanged",
        "uiPermalinkThreadExpanded", "uiExpandedConversationRendered", "uiTweetInserted", "uiPageChanged",
        "uiShowRelatedVideoTweets", "uiLoadDynamicContent", "uiDMConversationUpdated"
    ];
    for(var i=0; i < events.length; i++) {
        window.addEventListener(events[i], () => {
            tidy();
            setTimeout(tidy, 3000);
        });
    }
    javascript:(function(w){
        var arr = ['contextmenu','copy','cut','paste','mousedown','mouseup','beforeunload','beforeprint'];
        for(var i = 0, x; x = arr[i]; i++){
            if(w['on' + x]) w['on' + x] = null;
            w.addEventListener(x, function(e){
                e.stopPropagation()}, true);
            };
        for(var j = 0, f; f = w.frames[j]; j++){
            try{
                arguments.callee(f)
            } catch(e){}
        }
    }
    )(window);
})();
