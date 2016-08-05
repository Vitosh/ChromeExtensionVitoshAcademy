var app = app || {};
app.refreshTime = parseInt(localStorage.getItem("refresh") || "1") * 60000;

(function () {
    setInterval(function () {
        app.data.getLatestPosts().then(
            function (feedData) {
                var newData = JSON.stringify(app.data.getFeedIds(feedData));
                var oldData = localStorage.getItem('oldNews');
                console.log(oldData);
                console.log(newData);
                if (newData != oldData) {
                    chrome.runtime.sendMessage({"newIconPath": "img/icon_small_notify.png"});
                } else {
                    chrome.runtime.sendMessage({"newIconPath": "img/icon_small.png"});
                }
            },
            function (error) {
                console.log(error);
            }
        );
    }, app.refreshTime);
})();


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.browserAction.setIcon({
            path: request.newIconPath
        });
    });