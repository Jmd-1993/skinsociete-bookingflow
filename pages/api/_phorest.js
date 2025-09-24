const BASE = "https://platform-us.phorest.com/third-party-api-server/api";

function getAuthHeaders() {
  const username = process.env.PHOREST_USER;
  const password = process.env.PHOREST_PASS;
  const token = Buffer.from(`${username}:${password}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

const BUSINESS_ID = process.env.PHOREST_BUSINESS_ID;
const COTTESLOE_BRANCH = "wQbnBjP6ztI8nuVpNT6MsQ";
const SKIN_NEEDLING_SERVICE_COTT = "z5dmn_xMisQXNyFNbu4ktw";

module.exports = {
  BASE,
  getAuthHeaders,
  BUSINESS_ID,
  COTTESLOE_BRANCH,
  SKIN_NEEDLING_SERVICE_COTT
};
