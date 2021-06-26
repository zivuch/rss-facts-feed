const exp = require('express');
const bp = require('body-parser');
const dotenv = require('dotenv');
const Parser = require('rss-parser');
const cors = require('cors');

dotenv.config();
const app = exp();

app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())
app.use(cors());

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
// index page
app.get('/', (req, res) => {
  rss()
  .then(data => {
    res.render('pages/index', {
      posts: data,
    });
  })
  .catch(err => {
    console.log(err);
  })
});

// search page
app.get('/search', (req, res) => {
  rss()
  .then(data => {
    res.render('pages/search', {
      posts: [],
      catg: data
    });
  })
  .catch(err => {
    console.log(err);
  })
});

app.post('/search/title', (req, res) => {
  searchTitle(req.body.title)
  .then(data => {
    res.render('pages/search', {
      posts: data.filteredPosts,
      catg: data.posts
    });
  })
  .catch(err => {
    console.log(err);
  })
});

app.post('/search/category', (req, res) => {
  searchCategory(req.body.category)
  .then(data => {
    res.render('pages/search', {
      posts: data.filteredPosts,
      catg: data.posts
    });
  })
  .catch(err => {
    console.log(err);
  })
});

const searchCategory = async (val) => {
  let posts = await rss();
  let filteredPosts = posts.filter( post => {
    return post.categories.includes(val)
  })
  return {filteredPosts,posts};
};

const searchTitle = async (val) => {
  let posts = await rss();
  let filteredPosts = posts.filter( post => {
    return post.title.toLowerCase().includes(val.toLowerCase())
  })
  return {filteredPosts,posts};
};

const rss = async () => {
  const parser = new Parser();
  const feed = await parser.parseURL('https://www.thefactsite.com/feed/');
  return feed.items;
};

app.set('port',process.env.PORT || 3000);
app.listen(app.get('port'), ()=>{
  console.log(`Server listining to port ${app.get('port')}`);
})
