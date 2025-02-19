import { SF_ACCESS_TOKEN_URL } from "../useENV.js";
import { myCache } from "./cache.cjs";


export async function getSFAccessToken() {
  try {
    let sfAccessToken = myCache.get("access_token");
    console.log("Fetching Salesforce token...");
    if (sfAccessToken) {
      console.log("Reusing cached Salesforce token");
      return sfAccessToken;
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
      myCache.set("access_token", sfAccessToken, 3600 * 2); 
      console.log("Fetched new Salesforce token",sfAccessToken);
      return sfAccessToken;
    } else {
      throw new Error("Failed to fetch Salesforce access token");
    }
  } catch (error) {
    console.error("Error fetching Salesforce access token:", error);
    throw error;
  }
}


