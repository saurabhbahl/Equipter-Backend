import { SF_ACCESS_TOKEN_URL } from "../useENV.js";

let sfAccessToken = null;

export async function checkSFAccessToken(req, res, next) {
  try { 
    if (sfAccessToken) {
      console.log("Reusing cached Salesforce token");
      req.accessToken = sfAccessToken; 
      return next(); 
    }
    const response = await fetch(SF_ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();

    if (data.access_token) {
      sfAccessToken = data.access_token; 
      req.accessToken = sfAccessToken; 
      console.log("Fetched new Salesforce token:", sfAccessToken);
      return next(); 
    } else {
      throw new Error("Failed to fetch Salesforce access token");
    }
  } catch (error) {
    console.error("Error fetching Salesforce access token:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Salesforce access token",
      error: error.message,
    });
  }
}
