const request = require('request');
const cheerio = require('cheerio');

// const url = 'https://aws.amazon.com/blogs/compute/building-well-architected-serverless-applications-introduction/';
const url = process.argv[2];
request(url, function (error, response, responseHtml) {
    let blogobj = {};

    //if there was an error
    if (error) {
        res.end(JSON.stringify({error: 'Unable to read URL'}));
        return;
    }

    //create the cheerio object
    blogobj = {},
    //set a reference to the document that came back
    $ = cheerio.load(responseHtml),
    //create a reference to the meta elements
    $title = $('head title').text(),
    $intro = $('meta[property="og:description"]').attr('content'),
    $author = $('meta[name="twitter:creator"]').attr('content'),
    $author = $('footer.blog-post-meta').children().eq(0).text(),
    $date = $('meta[property="article:published_time"]').attr('content'),
    $link = $('meta[property="og:url"]').attr('content'),
    $image = $('meta[property="og:image"]').attr('content'),
    $tags = $('meta[property="article:tag"]');
    console.log($tags.length);

    if ($title) {
      blogobj.title = $title;
    } else {
      blogobj.title = "";
    };

    if ($intro) {
        blogobj.intro = $intro;
      } else {
        blogobj.intro = "";
      };
  
    if ($author) {
        blogobj.author = $author;
      } else {
        blogobj.author = "";
      };
  
    if ($date) {
        const formatter = new Intl.DateTimeFormat('en', { month: "short", day: "2-digit", year: "numeric" });
        blogobj.date = formatter.format(new Date($date));
      } else {
        blogobj.date = "";
      };
  
    if ($link) {
        blogobj.link = $link;
      } else {
        blogobj.link = "";
      };
  
    if ($image) {
        blogobj.image = $image;
      } else {;
        blogobj.image = "";
      };
  
    if ($tags && $tags.length > 0) {
        let mySet = new Set();
        for (var i = 0; i < $tags.length; i++) {
            mySet.add($($tags[i]).attr('content'));
        }
        blogobj.tags = Array.from(mySet);
      } else {
        blogobj.tags = "";
      };
      console.log(JSON.stringify(blogobj, null, '\t'));
}) ;