import { SalesForceService } from "../services/salesForceService.js";

export class salesForceHooksService{
  
  static async webQuoteHandler(req,res) {
    try {
      // const userAgent=req.headers["user-agent"];
      // const isAllowed=userAgent.includes("SFDC-Callout")
      // if(!isAllowed){
      //   console.log("Not Allowed for this request:",isAllowed,userAgent)
      //   return res.status(401).json({ success: false, error: "Unauthorized Access!"});
      // }      
      console.log("Request Body:", req.body);
      console.log("Request Headers:", req.headers);  
      const newSf=await SalesForceService.preCallService();
      console.log("=>",newSf)

          
      return res.status(200).json({msg:"!"})      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  
  static async orderHandler(req,res) {
    try {
      // const userAgent=req.headers["user-agent"];
      // const isAllowed=userAgent.includes("SFDC-Callout")
      // if(!isAllowed){
      //   console.log("Not Allowed for this request:",isAllowed,userAgent)
      //   return res.status(401).json({ success: false, error: "Unauthorized Access!"});
      // }      
      // console.log("Request Body:", req.body);
      // console.log("Request Headers:", req.headers);  
          
      return res.status(300).json({msg:"!"}) 
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  
  
}