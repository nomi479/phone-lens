const https = require("https");
const url = "https://api.mobileapi.dev/v1/devices?search=iphone";

https
  .get(url, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      console.log("status", res.statusCode);
      try {
        const obj = JSON.parse(data);
        console.log(Object.keys(obj));
        console.log(JSON.stringify(obj.results?.slice(0, 1), null, 2));
      } catch (e) {
        console.error("parse error", e.message);
        console.error(data);
      }
    });
  })
  .on("error", (e) => console.error("request error", e.message));
