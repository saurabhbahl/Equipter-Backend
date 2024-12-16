import { SF_ACCESS_TOKEN_URL } from "../useENV.js";

let sfAccessToken = "00DC0000000Piso!AQEAQMZDQiWn1TACL1E9Cp.O7Asp3DbKyvR5AUnUcaIYtnUsBK3qML1C9xpNrQRbPDXM0dUbQdzdTALuc90LZXenzzWlieQe";

export async function getSFAccessToken() {
  try {
    if (sfAccessToken) {
      console.log("Reusing cached Salesforce token");
      return sfAccessToken;
    }
    return sfAccessToken;

    const response = await fetch(SF_ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();

    if (data.access_token) {
      sfAccessToken = data.access_token;
      console.log("Fetched new Salesforce token:", sfAccessToken);
      return sfAccessToken;
    } else {
      throw new Error("Failed to fetch Salesforce access token");
    }
  } catch (error) {
    console.error("Error fetching Salesforce access token:", error);
    throw error;
  }
}
