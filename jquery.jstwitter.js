$(function() {		
				
    JQTWEET = {		    
        search: '%kisschoice',
        appendTo: '#jstwitter',
        numTweets: 50,
        useGridalicious: true,
        template: '<div class="item">{IMG}<div class="tweet-wrapper"><span class="text">{TEXT}</span>\
                   <span class="time"><a href="{URL}" target="_blank">{AGO}</a></span>\
                   by <span class="user">{USER}</span></div></div>',

        loadTweets: function() {

            var datas = '';                        

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'twitterScript.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                // do something to response                
                var data = $.parseJSON('[' + this.responseText + ']')[0];
                var numberOfResults = data.length; 

                // append tweets into page
                for (var i = 0; i < data.length; i++) {
                    img = '';
                    url = 'http://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str;
                    try {
                        if (data[i].entities['media']) {
                            img = '<a href="' + url + '" target="_blank"><img src="' + data[i].entities['media'][0].media_url + '" /></a>';
                        }
                    } catch (e) {  
                        //no media
                    }

                    $(JQTWEET.appendTo).append( 
                      JQTWEET.template.replace('{TEXT}', JQTWEET.ify.clean(data[i].text) )
                      .replace('{USER}', data[i].user.screen_name)
                      .replace('{IMG}', img)                                
                      .replace('{AGO}', JQTWEET.timeAgo(data[i].created_at) )
                      .replace('{URL}', url )			                            
                    );
                }
                
                if (JQTWEET.useGridalicious) {                
                    //run grid-a-licious
                    $(JQTWEET.appendTo).gridalicious({
                        gutter: 13, 
                        width: 250, 
                        animate: false
                    });	                   
                }                

            };
            xhr.send(datas);
        }, 

        loadInstagrams: function() {

            var datas = '';                        

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'instagramScript.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                // do something to response                
                var data = $.parseJSON('[' + this.responseText + ']')[0];
                var numberOfResults = data.length; 
                console.log(data);
                // append tweets into page
                for (var i = 0; i < data.length; i++) {
                    img = '';
                    url = data[i].link;
                    try {
                        if (data[i].images.standard_resolution.url) {
                            img = '<a href="' + url + '" target="_blank"><img src="' + data[i].images.standard_resolution.url + '" /></a>';
                        }
                    } catch (e) {  
                      //no media
                    }

                    $(JQTWEET.appendTo).append( 
                      JQTWEET.template.replace('{TEXT}', JQTWEET.ify.clean(data[i].caption.text) )
                      .replace('{USER}', data[i].user.username)
                      .replace('{IMG}', img)                                
                      .replace('{AGO}', JQTWEET.timeAgo(data[i].created_at) )
                      .replace('{URL}', url )			                            
                    );
                }
                
                if (JQTWEET.useGridalicious) {                
                    //run grid-a-licious
                    $(JQTWEET.appendTo).gridalicious({
                        gutter: 13, 
                        width: 250, 
                        animate: false
                    });	                   
                }                

            };
            xhr.send(datas);
        },


        /**
          * relative time calculator FROM TWITTER
          * @param {string} twitter date string returned from Twitter API
          * @return {string} relative time like "2 minutes ago"
          */
        timeAgo: function(dateString) {
            var rightNow = new Date();
            var then = new Date(dateString);

            if ($.browser.msie) {
                // IE can't parse these crazy Ruby dates
                then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
            }

            var diff = rightNow - then;

            var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;

            if (isNaN(diff) || diff < 0) {
                return ""; // return blank string if unknown
            }

            if (diff < second * 2) {
                // within 2 seconds
                return "right now";
            }

            if (diff < minute) {
                return Math.floor(diff / second) + " seconds ago";
            }

            if (diff < minute * 2) {
                return "about 1 minute ago";
            }

            if (diff < hour) {
                return Math.floor(diff / minute) + " minutes ago";
            }

            if (diff < hour * 2) {
                return "about 1 hour ago";
            }

            if (diff < day) {
                return  Math.floor(diff / hour) + " hours ago";
            }

            if (diff > day && diff < day * 2) {
                return "yesterday";
            }

            if (diff < day * 365) {
                return Math.floor(diff / day) + " days ago";
            }

            else {
                return "over a year ago";
            }
        }, // timeAgo()


        /**
          * The Twitalinkahashifyer!
          * http://www.dustindiaz.com/basement/ify.html
          * Eg:
          * ify.clean('your tweet text');
          */
        ify:  {
          link: function(tweet) {
            return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
              var http = m2.match(/w/) ? 'http://' : '';
              return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
            });
          },

          at: function(tweet) {
            return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
              return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
            });
          },

          list: function(tweet) {
            return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
              return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
            });
          },

          hash: function(tweet) {
            return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
              return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
            });
          },

          clean: function(tweet) {
            return this.hash(this.at(this.list(this.link(tweet))));
          }
        } // ify


    };		
	
});
