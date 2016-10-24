var url = require("url");

/** load yml file**/
YAML = require('yamljs');
 
sitesYml = YAML.load('config/sites.yml');
console.log(sitesYml["www.inspireactachieve.com"].content);

/** X-ray **/
// var feedURL = 'https://www.google.com/alerts/feeds/01662123773360489091/16154056701822473634';
var Xray = require('x-ray');
var x = Xray({
  filters: {
    clean: function (value){
    	console.log(typeof value);
       value = value.replace(/"/g, '');
       value = value.replace(/(?:\r\n\t|\r|\n|\t)/g, '');
       return value;
    }
  }
});
for(var website in sitesYml) {
  var protocol = sitesYml[website].protocol + "://";
  website +=sitesYml[website].path;
  
  var sUrl = url.parse(protocol + website,true);
  var filename = "files/"+sUrl.hostname+".txt"
  // var filename = "files/"+sUrl.hostname.split('.')[1];
  // var sUrl = url.parse('http://www.hngn.com/science/',true);
  // console.log(sitesYml[sUrl.hostname].list_item);
  // console.log("********************");
   // setTimeout(function () {
  x(sUrl.href, sitesYml[sUrl.hostname].list,[
    sitesYml[sUrl.hostname].list_item
   ])
  .write(filename);
   // }, 10);
   // check if there is a domain in the path
 
};
for(var website in sitesYml) {
 fs = require('fs');
 var filename = "files/test.txt"
  console.log("file: ", filename);
  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    // console.log(data);
    var urls = JSON.parse(data);
    // remove duplicates from array
    urls_array = urls.filter(function(elem, pos) {
      return urls.indexOf(elem) == pos;
    });
    console.log("array: ",typeof urls);
    // loop through array
    for(var mUrl in urls_array) {
      var sUrl = url.parse(urls_array[mUrl],true);
      console.log("Murl: ",urls_array[mUrl]);
       // console.log("sUrl: ",sUrl);
      x(sUrl.href, sitesYml[sUrl.hostname].content,[{
       text: sitesYml[sUrl.hostname].article,
         image: sitesYml[sUrl.hostname].thumbnail
      }] 
      )
      (function(err, content) {
        // console.log(content);
        /**  BEGIN content clean **/
        // var jsdom = require('jsdom').jsdom
        // , myWindow = jsdom().createWindow()
        // , $ = require('jQuery')
        // , jq = require('jQuery').create()
        // , jQuery = require('jQuery').create(myWindow)
        // , body = $('<div/>').html(contents[0]['text']).contents()
        // ;
        // body.find('input');

        /**  END content clean **/

        var request = require('request'),
          username = "admin",
          password = "lovecandle",
          url = "http://" + username + ":" + password + "@192.168.0.12:8080/wp-json/wp/v2/posts";

          // console.log(content[0]['text']);
          request.post(
               url,
              { json: {
                  title: sUrl.hostname+" post",
                  content: content[0]['text'],
                  status: "publish"
              } },
              function (error, response, body) {
                  if (!error && response.statusCode == 200) 
                      console.log(body)
                  else
                    console.log(error);
                
              }
          );
        
        return;
        

      });
    } // end for


  }); // end fs

  } // end for

// var site = 'http://www.inquisitr.com/3596027/will-a-mars-colony-bring-back-the-city-states-of-ancient-greece/'


// /** Scraping with x-ray */
// x(site, sitesYml[sUrl.hostname].content,[{
// 	text: sitesYml[sUrl.hostname].article,
//    image: sitesYml[sUrl.hostname].thumbnail
// }] 
// ).write('../body.html');
// 
  
// })