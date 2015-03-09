/**
 * Object: hashtagContentLoader
 * Version: 0.0.0
 * Author: Edouard Kombo
 * Twitter: @EdouardKombo
 * Github: Edouard Kombo
 * Url: https://github.com/edouardkombo/hashtagContentLoader
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Load hashtags content 
 */

var hashtagContentLoader= function(){};

hashtagContentLoader.prototype = {
    twitterUrl: 'http://twitter.com/{USERNAME}/status/{ID}',
    lap: 6,
    timer: 0,
    counter: 1,
    styleId: 'styleId',
    maxTimer: 0,

    /**
     * Create style tag
     * 
     * @returns {undefined}
     */
    createStyleTag: function (){
        var css     = document.createElement("style");
        css.type    = "text/css";
        css.id      = this.styleId;
        document.body.appendChild(css);                                          
    },

    /**
     * Load all tweets
     * 
     * @returns {undefined}
     */
    loadTweets: function (){
        var datas = '';                        
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../twitterScript.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            // do something to response                
            var data = JSON.parse('[' + xhr.responseText + ']')[0]; 
            if (data.length > 0){    
                // append tweets into page
                for (var i = 0; i < data.length; i++) {
                    var text        = data[i].text;
                    var username    = data[i].user.screen_name;
                    var id          = data[i].id_str;
                    var ago         = data[i].created_at;
                    var media       = (data[i].entities['media']) ? 
                                      data[i].entities['media'][0].media_url : '' ;
                    var url         = this.twitterUrl
                                      .replace('{USERNAME}', username)
                                      .replace('{ID}', id);

                    if (media.length > 0) {
                        this.timer  = (i === 0) ? 0 : this.lap * i;
                        this.addContent(media, text);                    
                    }
                }
            }
        }.bind(this);
        xhr.send(datas);
    },
    
    /**
     * Load all instagram hashtags
     * 
     * @returns {undefined}
     */
    loadInstagrams: function (){
        var datas = '';                        

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../instagramScript.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            // do something to response 
            var data = JSON.parse('[' + xhr.responseText + ']')[0];

            if (data.length > 0){
                // append tweets into page
                for (var i = 0; i < data.length; i++) {               
                    var text        = data[i].caption.text;
                    var username    = data[i].user.username;
                    var likes       = data[i].likes.count;
                    var comments    = data[i].comments.count;
                    var commentDatas= data[i].comments.data;
                    var username    = data[i].user.username;
                    var userPicture = data[i].user.profile_picture;
                    var userLink    = "https://instagram.com/"+username+"/";                    
                    var inside      = data[i].users_in_photo.length;                    
                    var location    = data[i].location;
                    var type        = data[i].type;
                    var tags        = data[i].tags;                    
                    var id          = data[i].caption.id;
                    var ago         = data[i].created_at;
                    var media       = (data[i].images.standard_resolution.url) ? 
                                      data[i].images.standard_resolution.url : '' ;
                    var url         = data[i].link;
                    
                    if (media.length > 0) {
                        if ((this.timer === 0) && (i === 0)) {
                            this.timer  = 0;
                        } else if ((i !== 0)) {
                            this.timer  = this.timer + this.lap;
                        }
                        this.maxTimer = (i === (data.length-1)) ? this.timer + this.lap : this.maxTimer;
                        this.addContent(media, text);                    
                    }  
                }
            }
        }.bind(this);
        xhr.send(datas);
    },
    
    /**
     * Add css and "ul" result
     * 
     * @param {string} media Media url
     * @param {string} text  Content message
     * @returns {undefined}
     */
    addContent: function (media, text){
        
        if (this.maxTimer > 0) {
            var _css      = ".cb-slideshow li span {-webkit-backface-visibility: hidden;-webkit-animation: imageAnimation "+this.maxTimer+"s linear infinite 0s;-moz-animation: imageAnimation "+this.maxTimer+"s linear infinite 0s;-o-animation: imageAnimation "+this.maxTimer+"s linear infinite 0s;-ms-animation: imageAnimation "+this.maxTimer+"s linear infinite 0s;animation: imageAnimation "+this.maxTimer+"s linear infinite 0s;}.cb-slideshow li div {-webkit-animation: titleAnimation "+this.maxTimer+"s linear infinite 0s;-moz-animation: titleAnimation "+this.maxTimer+"s linear infinite 0s;-o-animation: titleAnimation "+this.maxTimer+"s linear infinite 0s;-ms-animation: titleAnimation "+this.maxTimer+"s linear infinite 0s;animation: titleAnimation "+this.maxTimer+"s linear infinite 0s; }";
            var _cssContent          = document.getElementById(this.styleId);
            _cssContent.innerHTML    = _cssContent.innerHTML + _css;            
        }
        
        var result  = "<li><span>Kisschoice "+this.counter+"</span><div><h3>"+text+"</h3></div></li>";
        var ul      = document.getElementsByClassName("cb-slideshow");
        ul[0].innerHTML = ul[0].innerHTML + result;        
        
       var css      = ".cb-slideshow li:nth-child("+this.counter+") span {background-image: url("+media+");-webkit-animation-delay: "+this.timer+"s;-moz-animation-delay: "+this.timer+"s;-o-animation-delay: "+this.timer+"s;-ms-animation-delay: "+this.timer+"s;animation-delay: "+this.timer+"s;}";
        var cssContent          = document.getElementById(this.styleId);
        cssContent.innerHTML    = cssContent.innerHTML + css;
                
        ++this.counter;
    }    
};