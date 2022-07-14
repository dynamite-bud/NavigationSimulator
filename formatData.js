const fs = require("fs");

(async () => {
  try {
    const data = await fs.promises.readFile(
      "./static/mock-data/data.txt",
      "utf-8"
    );

    const regex = /^QJsonDocument\((.+)\)/gm;
    const results = data.matchAll(regex);
    resultArr = [];
    for (const result of results) {
      if (typeof result[1] === "string") {
        resultArr.push(JSON.parse(result[1]));
      }
    }
    await fs.promises.writeFile(
      "./static/mock-data/data.json",
      JSON.stringify(resultArr)
    );
  } catch (error) {
    console.error(error);
  }
})();
