const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "../../.cache/espea.json");
const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzMGj17FSefqDLu0Qa3Sq282kmQb3QQ6cMXV5UDdlLuamYeR_ZkuxyAvZfWfxgyhxYk/exec";

const FALLBACK = {
  revenue: 85,
  europeanShare: 5,
  jobs: "1M+",
  metaShare: 55,
  updatedAt: null,
};

module.exports = async function () {
  try {
    const res = await fetch(ENDPOINT, { redirect: "follow" });
    if (!res.ok) throw new Error(`ESPEA fetch failed: ${res.status}`);

    const json = await res.json();
    const data = {
      revenue: json.revenue,
      europeanShare: json.europeanShare,
      jobs: String(json.jobs).trim(),
      metaShare: json.metaShare,
      updatedAt: new Date().toISOString(),
    };

    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    console.log(`ESPEA data fetched: revenue=${data.revenue}, share=${data.europeanShare}%, jobs=${data.jobs}, meta=${data.metaShare}%`);
    return data;
  } catch (err) {
    console.warn(`ESPEA fetch error: ${err.message}`);

    if (fs.existsSync(CACHE_FILE)) {
      console.log("Using cached ESPEA data");
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }

    console.log("No cached ESPEA data, using fallback");
    return FALLBACK;
  }
};
