import { verifyRequestBody } from "../middlewares/checkRequestBody.js";
import { SF_INSTANCE_URL, SF_OBJECT_URL } from "../useENV.js";
//Used to perform the query in salesforce data
export async function sFQuery(req, res) {
  try {
    let query = req.body.query || req.query.q;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, data: [], message: "No query provided" });
    }

    if (!query.toLowerCase().includes("select")) {
      return res
        .status(400)
        .json({ success: false, data: [], message: "Invalid query format" });
    }

    const sfQueryUrl = `${
      SF_INSTANCE_URL
    }/services/data/v52.0/query/?q=${encodeURIComponent(query)}`;
    const sfRes = await fetch(sfQueryUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!sfRes.ok) {
      const error = await sfRes.json();
      return res
        .status(sfRes.status)
        .json({ success: false, message: "Salesforce query failed", error });
    }

    const sfData = await sfRes.json();
    return res.json({ success: true, data: sfData });
  } catch (error) {
    console.error("Error executing Salesforce query:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
//For adding the new object in salesForce
export async function sFAddNewObject(req, res) {
  try {
    const missingFields = verifyRequestBody(req.body, ["objectName"]);
    if (missingFields) {
      return res.status(400).json({ success: false, data: { missingFields } });
    }
    const objectUrl = `${SF_OBJECT_URL}/${req.body.objectName}`;
    console.log(objectUrl);
    const { objectName, ...dataToSend } = req.body;
    const sFResp = await fetch(objectUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    let sFRes = await sFResp.json();
    if (sFRes.success) {
      return res.status(201).json({ success: true, sFRes });
    }
    return res.status(400).json({ success: false, sFRes });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
