// ==UserScript==
// @name           Twitter Meta and Ad Buster
// @include        *://*twitter.com/*
// @include        *://www.twitter.com/*
// @include        http*://www.twitter.com/*
// @namespace      https://www.twitter.com
// @description    Remove tweets talking about tweets
// @version        1.5
// @run-at document-idle
// @grant unsafeWindow
// 0.9 Nuke sumall.com spam
// 1.0 Remove elements with Class promoted-tweet
// 1.1 Add all Twitters events for timeline mods
// 1.2 Xpath for promoted
// 1.3 Trim inline boxes
// 1.4 Dey chenged der werds
// 1.5 Promoted by
// ==/UserScript==

function remove_meta_tweets() {
    var anchors = document.getElementsByTagName('a');
    for(var i=0; i<anchors.length; i++){
        var raw_url = anchors[i].getAttribute('data-expanded-url');
        if(raw_url && raw_url.match(/https:\/\/sumall.com\/(.*)/)) {
            var parent_p = anchors[i].parentNode;
            var tweet_text_container = parent_p.parentNode;
            var stream_item_header = tweet_text_container.parentNode;
            var content = stream_item_header.parentNode;
            while (content.firstChild) content.removeChild(content.firstChild); // die die die die die
            content.parentNode.removeChild(content);
        }
    }
}

function nuke_path(xpath, layers, seeking) {
    try {
        var target_elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        if (target_elements) {
            var target_element = null;
            while(target_element = target_elements.iterateNext()) {
                let nuke_dis = target_element;
                for (var layer = 0; layer < layers; layer++) {
                    while (nuke_dis.firstChild) nuke_dis.removeChild(nuke_dis.firstChild); // die die die die die
                    nuke_dis = nuke_dis.parentNode;
                }
            }
        }
    } catch(err) {
        ;
    }
}

function tidy() {
    remove_meta_tweets();
    nuke_path("//span[text()='Follow']", 5, 'Lemmings');
    nuke_path("//span[text()='Who to follow']", 6, 'Lemmings');
    nuke_path("//span[text()='Topics to follow']", 4, 'Lemmings');
    nuke_path("//span[text()='Promoted']", 6, 'Promoted');
    nuke_path("//span[text()='Promoted Tweet']", 2, 'Promoted');
    nuke_path("//span[starts-with(text(),'Promoted by')]", 6, 'Promoted');
    nuke_path("//span[text()='Expand your timeline']", 2, 'Promoted');
    nuke_path("//div[@aria-label='Set as not interested']", 4, 'Lemmings');
    nuke_path("//div[@data-testid='UserCell']", 2, "Lemmings");
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
})();
