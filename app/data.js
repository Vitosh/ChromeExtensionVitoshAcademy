var app = app || {};
app.data = app.data || {};
app.rssAddress = "http://www.vitoshacademy.com/feed/";


(function (scope) {
    function getXMLFeed() {
        var deferred = Q.defer();

        $.ajax(app.rssAddress,
            {
                method: "GET"
            })
            .success(function (data) {
                deferred .resolve(data);
            })
            .error(
            function (error) {
                deferred .reject(error);
            });
        return deferred .promise;
    }

    function saveReadNews(data) {
        var oldNews = getFeedIds(data);
        localStorage.setItem("oldNews", JSON.stringify(oldNews));
    }

    function getFeedIds(feedData){
        var oldNews = [];
        for (var feedIndex in feedData.rss.channel.item) {
            var id = feedData.rss.channel.item[feedIndex].guid['#text'];
            oldNews.push(id);
        }
        return oldNews;
    }

    function getLatestPosts() {
        return getXMLFeed().then(
            function (xmlData) {
                var feedJSQN = xmlToJson(xmlData);
                return feedJSQN;
            },
            function (error) {
                console.log(error)
            }
        );
    }

    function xmlToJson(xml) {

        var obj = {};
        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    }

    function isNew(id){
        var oldNews = localStorage.getItem('oldNews');
        if(!oldNews){
            return false;
        }
        oldNews = JSON.parse(oldNews);
        if(oldNews.indexOf(id) > -1){
            return false;
        }
        return true;

    }

    scope.data.saveReadNews = saveReadNews;
    scope.data.getLatestPosts = getLatestPosts;
    scope.data.isNew = isNew;
    scope.data.getFeedIds = getFeedIds;

})(app);