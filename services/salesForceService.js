import { SF_ACCESS_TOKEN_URL, SF_INSTANCE_URL } from "../useENV.js";
import axios from "axios";
import jsforce from "jsforce";
import { getSFAccessToken } from "../utils/sFTokenManagement.js";
import memoryCache from "memory-cache";

export class SalesForceService {
  sfAccessToken;
  instanceUrl;
  jsForceConnectionInstance;

  constructor() {
    this.initializeService();
    this.sfAccessToken=memoryCache.get("access_token")
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
      this.jsForceConnectionInstance.accessToken = token
      this.jsForceConnectionInstance.instanceUrl = this.instanceUrl
      console.log("Salesforce service initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize Salesforce service:", error);
      throw error; 
    }
  }

  async getAccessToken() {
    try {
      if (this.sfAccessToken) {
        console.log("Reusing cached Salesforce token", this.sfAccessToken);
        return this.sfAccessToken;
      }

      const response = await fetch(SF_ACCESS_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (data.access_token && data.instance_url) {
        this.sfAccessToken = data.access_token;
        this.instanceUrl = data.instance_url;
        memoryCache.put("access_token", this.sfAccessToken, 3600 * 2); 
        console.log("Fetched new Salesforce token:", this.sfAccessToken);
        console.log("Fetched new Salesforce instance URL:", this.instanceUrl);
        return this.sfAccessToken;
      } else {
        throw new Error(
          "Failed to fetch Salesforce access token or instance URL"
        );
      }
    } catch (error) {
      console.error("Error fetching Salesforce access token:", error);
      throw error;
    }
  }

  async refreshToken() {
    const newToken = await getSFAccessToken();
    this.jsForceConnectionInstance.accessToken = newToken;
    this.jsForceConnectionInstance.instanceUrl = this.instanceUrl;
    console.log("Salesforce token refreshed successfully.");
  }

  async querySOQL(soqlQuery) {
    try {
      const response = await axios.get(
        `${this.instanceUrl}/services/data/v52.0/query`,
        {
          headers: {
            Authorization: `Bearer ${this.sfAccessToken}`,
          },
          params: {
            q: soqlQuery,
          },
        }
      );
      console.log("Query results: ", response.data);
      return response.data;
    } catch (err) {
      console.error("Query error: ", err);
      throw err;
    }
  }

  async createRecord(objectType, recordData) {
    try {
      const response = await axios.post(
        `${this.instanceUrl}/services/data/v52.0/sobjects/${objectType}`,
        recordData,
        {
          headers: {
            Authorization: `Bearer ${this.sfAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Record created: ", response.data.id);
      return response.data.id;
    } catch (err) {
      console.error("Create error: ", err);
      throw err;
    }
  }

  async updateRecord(objectType, recordId, recordData) {
    try {
      await axios.patch(
        `${this.instanceUrl}/services/data/v52.0/sobjects/${objectType}/${recordId}`,
        recordData,
        {
          headers: {
            Authorization: `Bearer ${this.sfAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Record updated successfully");
    } catch (err) {
      console.error("Update error: ", err);
      throw err;
    }
  }

  async deleteRecord(objectType, recordId) {
    try {
      await axios.delete(
        `${this.instanceUrl}/services/data/v52.0/sobjects/${objectType}/${recordId}`,
        {
          headers: {
            Authorization: `Bearer ${this.sfAccessToken}`,
          },
        }
      );
      console.log("Record deleted successfully");
    } catch (err) {
      console.error("Delete error: ", err);
      throw err;
    }
  }

  
  // js force utils
  // get single record
  async jsForceFindOne(objectName, searchCondition) {
    try {
      const existingRecord = await this.jsForceConnectionInstance
        .sobject(objectName)
        .findOne(searchCondition);
      return existingRecord || null;
    } catch (error) {
      
      if (error.errorCode === "INVALID_SESSION_ID") {
        console.log("Session invalid or expired. Fetching new token...");
        await this.refreshToken(); 
        return await this.jsForceConnectionInstance
          .sobject(objectName)
          .findOne(searchCondition); 
      }
      throw error;
    }
  }
  // create
  async jsForceCreateOneRecordInObj(objectName, data) {
    try {
      const createdRecord = await this.jsForceConnectionInstance
        .sobject(objectName)
        .create(data);
      return createdRecord;
    } catch (error) {
      console.log(error);
      if (error.errorCode === "INVALID_SESSION_ID") {
        console.log("Session invalid or expired. Fetching new token...");
        await this.refreshToken(); 
        return await this.jsForceConnectionInstance
        .sobject(objectName)
        .create(data);
      }
      throw error;
    }
  }
  // update
  async jsForceUpdateOneRecordInObj(objectName, data) {
    try {
      const updatedRecord = await this.jsForceConnectionInstance
        .sobject(objectName)
        .update(data);
      return updatedRecord;
    } catch (error) {
      console.log(error);
      if (error.errorCode === "INVALID_SESSION_ID") {
        console.log("Session invalid or expired. Fetching new token...");
        await this.refreshToken(); 
        return await this.jsForceConnectionInstance
        .sobject(objectName)
        .create(data);
      }
      throw error;
    }
  }
}