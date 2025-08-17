// netlify/functions/sharepoint-proxy.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "*"
      }
    };
  }

  // Base SharePoint link (client can give any link)
  let SHAREPOINT_URL = "https://taqwamd.sharepoint.com/:u:/g/Ee_hH6MgsThDptAh7Oz4R5kBo0puWT3PSeB38g-CJ8d5XA?e=kMg4zk";

  // 👉 Ensure it always has &download=1
  if (!SHAREPOINT_URL.includes("download=1")) {
    SHAREPOINT_URL += (SHAREPOINT_URL.includes("?") ? "&" : "?") + "download=1";
  }

  try {
    const resp = await fetch(SHAREPOINT_URL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const text = await resp.text();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: `Upstream error: ${resp.statusText}\n` + text.slice(0, 400),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/plain"
        }
      };
    }

    return {
      statusCode: 200,
      body: text,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: "Proxy error: " + e.message,
      headers: { "Access-Control-Allow-Origin": "*" }
    };
  }
};
