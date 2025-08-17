// netlify/functions/sharepoint-proxy.js
const fetch = require("node-fetch");   // 👈 add this

exports.handler = async (event) => {
  // Handle preflight if any
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

const SHAREPOINT_URL =
  "https://taqwamd.sharepoint.com/:u:/g/Ee_hH6MgsThDptAh7Oz4R5kBo0puWT3PSeB38g-CJ8d5XA?e=kMg4zk&download=1";

  try {
    const resp = await fetch(SHAREPOINT_URL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const text = await resp.text();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: `Upstream error: ${resp.statusText}\n` + text.slice(0, 400),
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "text/plain" }
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
