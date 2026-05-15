import https from "https";

https
  .get("https://api.mobileapi.dev/v1/devices?search=iphone", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      console.log("status", res.statusCode);
      try {
        const obj = JSON.parse(data);
        console.log(Object.keys(obj));
        console.log(JSON.stringify(obj.results?.slice(0, 1), null, 2));
      } catch (e) {
        console.error(e.message);
      }
    });
  })
  .on("error", (e) => console.error(e));
