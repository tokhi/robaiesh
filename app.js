var url = require("url");

/** load yml file**/
YAML = require('yamljs');
var config = "config/" + process.argv[2] + ".yml";
console.log("yml file", config);
sitesYml = YAML.load(config);
var Xray = require('x-ray');
var x = Xray({
  filters: {
    clean: function (value){
       value = value.replace(/"/g, '');
       value = value.replace(/(?:\r\n\t|\r|\n|\t)/g, '');
       return value;
    },
    noSpecialChar: function (value) {
      value = value.replace(/[‘–’]/g,'');
      return value;
    }
  }
});
for(var website in sitesYml) {
  var protocol = sitesYml[website].protocol + "://";
  website +=sitesYml[website].path;
  
  var sUrl = url.parse(protocol + website,true);
  var filename = "files/"+sUrl.hostname+".txt"
  x(sUrl.href, sitesYml[sUrl.hostname].list,[
    sitesYml[sUrl.hostname].list_item
   ])
     .write(filename);
}


function xrayArticles(articleList, sitesYml, iterator, callback) {
  var sUrl = '';
  var articleSize = 0;
  if (articleList.length >= 5) articleSize = 5;
  console.log('size | '+articleList[0].split(".")[1],articleList.length);
  function report() {
   callback(sUrl)
  } // end report
  for(var i=0;i<articleSize;i++){
    sUrl = url.parse(articleList[i],true);
    iterator(sUrl, report)
  }// end for
}
var initPostRequest = function(sUrl, content) {
  console.log('~>|',sUrl.href);
  /**  BEGIN content clean **/
  var junks = sitesYml[sUrl.hostname].junks.split(",")
  , title = content[0]['title'];
  var jsdom = require("jsdom");

  jsdom.env(
    content[0]['text'],
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      window.$(sitesYml[sUrl.hostname].title).remove();
      window.$('script').remove();
     for(var i in junks) {
        window.$(junks[i]).remove();
      }
      if(!title.includes("Video"))
        postToWordpress(window.$("body").html(), sUrl, title);
    }
  );
   /**  END content clean **/

}


var contentFetchInit = function(err,data) {
  // var domainKeys = Object.keys(sitesYml);
  var count = 0;
 
  if(data != null && data != ""){
     var urls = JSON.parse(data);
     // remove duplicates from array
    urls_array = Array.from(new Set(urls));
   
    if(urls_array.length > 0){     
      xrayArticles(urls_array, sitesYml, function(sUrl, report) {
        x(sUrl.href, sitesYml[sUrl.hostname].content,[{
             title: sitesYml[sUrl.hostname].title,
             text: sitesYml[sUrl.hostname].article,
             image: sitesYml[sUrl.hostname].thumbnail
            }] 
            )
            (function(err, content) {
              if(content.length > 0)
                initPostRequest(sUrl, content)
             
            }); // end x
      }, initPostRequest); // end xrayArticles
    }
  } // end if

}; // end contentFetch

var readFilesCallback = function () {
  for(var website in sitesYml) {
    var fs = require('fs');
    var sUrl = url.parse(protocol + website,true);
    var filename = "files/"+sUrl.hostname+".txt"

    fs.readFile(filename, 'utf8', contentFetchInit )
  } // end for
};

setTimeout(readFilesCallback, 5000);


function postToWordpress(content,sUrl, title) {
  var request = require('request'),
  username = process.env.WP_USER,
  password = process.env.WP_PASSWORD,
  url = "http://" + username + ":" + password + "@" + process.argv[2] + ".goweird.site/wp-json/wp/v2/posts";
  console.log(url);
  searchPost(request, url, title, function(response, slug) {
    url = encodeURI(url);
    if(response.body == '[]'){
      request.post(
        url,
        { json: {
          title: title,
          content: content,
          status: "publish",
          slug: slug
          // tags: [4,10] // TODO: get the tags from the api and choose it based on the title
        } },
        function (error, response, body) {
          console.log("sttus: ", response.statusCode);
          if (response.statusCode == 200) 
            console.log("content posted!");
          else
            console.log(error);          
        }
      ); // end post request
    }
    else
      console.log("*~>* Post already exist!", response.statusCode);
  }); // end search
 
} // end postToWordpress

function searchPost(request, url, title, callback) {
  url = "http://" + process.argv[2] + ".goweird.site/wp-json/wp/v2/posts";
  // slugify the title
  var mtitle = title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
  var mUrl = url+'?slug=' + mtitle;

  mUrl = encodeURI(mUrl);
  
  request(mUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("** NO error");
    return callback(response, mtitle);
  }
  else
    return callback(404,'');
})
}

