const express = require("express");
const app = express();
const port = 3000;
const _ = require("lodash");
const getBlogData = require("./middleware/getBlogData");

const cacheDuration = 60 * 60 * 1000; 

const memoizedAnalytics = _.memoize(
  (blogData) => {
    const blogSize = _.size(blogData.blogs);
    const blogWithLongestTitle = _.maxBy(
      blogData.blogs,
      (blog) => blog.title.length
    );
    const blogSizeWithPrivacy = _.size(
      _.filter(blogData.blogs, (blog) =>
        blog.title.toLowerCase().includes("privacy")
      )
    );

    const uniqueTitle = _.uniqBy(blogData.blogs, "title");

    return {
      blogSize: blogSize,
      blogWithLongestTitle: blogWithLongestTitle,
      blogSizeWithPrivacy: blogSizeWithPrivacy,
      uniqueTitle: uniqueTitle,
    };
  },
  (blogData) => blogData,
  cacheDuration
);

const memoizedSearch = _.memoize(
  (blogData, query) => {
    const searchResults = _.filter(blogData.blogs, (blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    return {
      query: query,
      results: searchResults,
    };
  },
  (blogData, query) => query,
  cacheDuration
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Oops! Something went wrong 🥲" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/blog-stats", getBlogData, (req, res) => {
  try {
    const analyticsData = memoizedAnalytics(req.blogData);
    res.json(analyticsData);
  } catch (error) {
    next(error);
  }
});

app.get("/api/blog-search", getBlogData, (req, res) => {
  try {
    const blogData = req.blogData;
    const query = req.query.query;

    const searchResults = memoizedSearch(blogData, query);

    res.json(searchResults);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
