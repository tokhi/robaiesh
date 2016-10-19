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
  // console.log(sUrl.href);
  // check if there is a domain in the path
  // check the url path is included in the path
  x(sUrl.href, sitesYml[sUrl.hostname].list,[{
    link: sitesYml[sUrl.hostname].list_item
  }])(console.log);
}

// var site = 'http://www.inquisitr.com/3596027/will-a-mars-colony-bring-back-the-city-states-of-ancient-greece/'


// /** Scraping with x-ray */
// x(site, sitesYml[sUrl.hostname].content,[{
// 	text: sitesYml[sUrl.hostname].article,
//    image: sitesYml[sUrl.hostname].thumbnail
// }] 
// ).write('../body.html');
// (function(err, content) {
  
// })