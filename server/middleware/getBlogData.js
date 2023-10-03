const axios = require("axios");
const getBlogData = async (req, res, next) => {
  try {
    const curlOptions = {
      method: "GET",
      url: "https://intent-kit-16.hasura.app/api/rest/blogs",
      headers: {
        "x-hasura-admin-secret":
          "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
      },
    }
    const response = await axios(curlOptions);

    req.blogData = response.data;
    next();
  } catch (error) {
    console.error("Error fetching blog data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = getBlogData;
