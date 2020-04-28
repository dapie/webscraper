/*global chrome*/
chrome.browserAction.setBadgeBackgroundColor({color: '#222222'});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.message){
        case "icon":
            chrome.browserAction.setBadgeText({text: request.options.select ? request.options.text : ""});
            break;
        default:
    }
    sendResponse();
})