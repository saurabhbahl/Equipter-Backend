import { SF_INSTANCE_URL } from "../useENV.js";
import axios from "axios";
import jsforce from "jsforce";
import { getSFAccessToken } from "../utils/sFTokenManagement.js";
import { myCache } from "../utils/cache.cjs";

export class SalesForceService {
  sfAccessToken;
  instanceUrl;
  jsForceConnectionInstance;

  constructor() {
    this.sfAccessToken = myCache.get("access_token");
    this.instanceUrl = SF_INSTANCE_URL;
    this.jsForceConnectionInstance = new jsforce.Connection({
      accessToken: this.sfAccessToken,
      instanceUrl: this.instanceUrl,
    });
  }

  async initializeService() {
    try {
      const token = await getSFAccessToken();
      this.sfAccessToken = token;
      this.jsForceConnectionInstance.accessToken = token;
      console.log("Salesforce service initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize Salesforce service:", error);
      throw error;
    }
  }

  /**
   * Refresh token once, then invoke the callback.
   */
  async refreshToken(operationFn) {
    try {
      console.log("Refreshing Salesforce token...");
      const newToken = await getSFAccessToken();
      this.sfAccessToken = newToken;
     // Re-instantiate the Connection
    this.jsForceConnectionInstance = new jsforce.Connection({
      accessToken: newToken,
      instanceUrl: this.instanceUrl,
    });
      console.log("Salesforce token refreshed successfully.");

      return await operationFn(); 
      // return await operationFn.apply(this, args);
    } catch (error) {
      console.error("Failed to refresh Salesforce token:", error);
      throw error;
    }
  }

  async querySOQL(soqlQuery, skipRefresh = false) {
    try {
      const response = await axios.get(
        `${this.instanceUrl}/services/data/v52.0/query`,
        {
          headers: {
            Authorization: `Bearer ${this.sfAccessToken}`,
          },
          params: { q: soqlQuery },
        }
      );
      console.log("Query results:", response.data);
      return response.data;
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.errorCode === "INVALID_SESSION_ID" &&
        !skipRefresh
      ) {
        console.log("Session invalid or expired. Fetching new token...");
        // Refresh once, then call querySOQL again with skipRefresh = true
        return this.refreshToken(() => this.querySOQL(soqlQuery, true));
      }
      console.error("Query error:", err);
      throw err;
    }
  }
  // js force utils
  // 1. find one
  async jsForceFindOne(objectName, searchCondition, skipRefresh = false) {
    try {
      const existingRecord = await this.jsForceConnectionInstance
        .sobject(objectName)
        .findOne(searchCondition);
      return existingRecord || null;
    } catch (error) {
      if (error.errorCode === "INVALID_SESSION_ID" && !skipRefresh) {
        console.log("Session invalid or expired. Fetching new token...");
        return this.refreshToken(() =>
          this.jsForceFindOne(objectName, searchCondition, true)
        );
      }
      throw error;
    }
  }
  // 2. create a record in obj
  async jsForceCreateOneRecordInObj(objectName, data, skipRefresh = false) {
    try {
      const createdRecord = await this.jsForceConnectionInstance
        .sobject(objectName)
        .create(data);
      return createdRecord;
    } catch (error) {
      if (error.errorCode === "INVALID_SESSION_ID" && !skipRefresh) {
        console.log("Session invalid or expired. Fetching new token...");
        return this.refreshToken(() =>
          this.jsForceCreateOneRecordInObj(objectName, data, true)
        );
      }
      throw error;
    }
  }
  // 3. update a record
  async jsForceUpdateOneRecordInObj(objectName, data, skipRefresh = false) {
    try {
      const updatedRecord = await this.jsForceConnectionInstance
        .sobject(objectName)
        .update(data);
      return updatedRecord;
    } catch (error) {
      if (error.errorCode === "INVALID_SESSION_ID" && !skipRefresh) {
        console.log("Session invalid or expired. Fetching new token...");
        return this.refreshToken(() =>
          this.jsForceUpdateOneRecordInObj(objectName, data, true)
        );
      }
      throw error;
    }
  }
}
