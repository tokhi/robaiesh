# Scrap any website
Robaiesh helps you to scrap any website specified in the `config` file and post it to a content management system of your choice.

Using this tool you can scrap lists and article pages.


To add a website open the `sites.yml` file and provide the required elements, class names or class ids that you want to scrap.

```js
www.example.com:
  protocol: "http"   // website protocol http/https
  content: ".main_cont_sub" // the main article content
  thumbnail: ".img_article img@src" // article image
  title: ".art-ttl" // article title
  article: ".article@html | clean"
  list: ".sidebar" // list of articles from homepage or any index page
  list_item: ".all_box a@href" // items in the list mentioned above
  junks: ".user_tool,.addthis_toolbox" // the junk elements e.g; divs that you want to remove and not scrap.
  path: "/science/" // index page path
```

In above config we are try to extract the `example.com`

Run the app:

```bash
npm install

node app.js

```