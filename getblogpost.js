var request = require('request');
var cheerio = require('cheerio');


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
    return [Month, month, day].join('-');

}

// var url = 'https://aws.amazon.com/blogs/compute/building-well-architected-serverless-applications-introduction/';
var url = process.argv[2];
request(url, function (error, response, responseHtml) {
    var blogobj = {};

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
        $date = $('meta[property="og:updated_time"]').attr('content'),
        $link = $('meta[property="og:url"]').attr('content'),
        $image = $('meta[property="og:image"]').attr('content'),
        $tags = $('meta[property="article:tag"]');

    if ($title) {
        blogobj.title = $title;
    }

    if ($intro) {
        blogobj.intro = $intro;
    }

    if ($author) {
        blogobj.author = $author;
    }

    if ($date) {
        const formatter = new Intl.DateTimeFormat('en', { month: "short", day: "2-digit", year: "numeric" });
        blogobj.date = formatter.format(new Date($date));
    }

    if ($link) {
        blogobj.link = $link;
    }

    if ($image) {
        blogobj.image = $image;
    }

    if ($tags) {
        blogobj.tags = [];
        for (var i = 0; i < $tags.length; i++) {
            blogobj.tags.push($($tags[i]).attr('content'));
        }
    }
    console.log(JSON.stringify(blogobj, null, '\t'));
}) ;