import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import {
  generateToken,
  getSalt,
  hashPassword,
  matchPassword,
} from "../utils/jwtUtils.js";
import { dbInstance } from "../config/dbConnection.cjs";
import { users } from "../models/userModel.js";
import { eq } from "drizzle-orm";
import { FRONTEND_URL, MAILER_EMAIL, MAILER_PASSWORD } from "../useENV.js";
import {
  userForgetPasswordSchema,
  userLoginSchema,
  userRegisterSchema,
  userResetPasswordSchema,
} from "../validators/userSchema.js";
import { getDetailedErrors } from "../utils/validationUtil.js";

export async function registerUser(req, res) {
  try {
    const parsedData = userRegisterSchema.safeParse(req.body);

    if (!parsedData.success) {
      const errorDetails = await getDetailedErrors(parsedData);
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errorDetails,
      });
    }

    const { name, email, password, role } = parsedData.data;

    // Check for existing user
    const existingUser = await dbInstance
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use." });
    }

    const salt = await getSalt();
    const hashedPassword = await hashPassword(password, salt);

    const newUser = await dbInstance
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
}

export async function loginUser(req, res) {
  try {
    const parsedData = userLoginSchema.safeParse(req.body);

    if (!parsedData.success) {
      const errorDetails = await getDetailedErrors(parsedData);
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errorDetails,
      });
    }

    const { email, password } = parsedData.data;
    const userExists = await dbInstance
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!userExists?.[0]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isPasswordValid = await matchPassword(
      password,
      userExists?.[0].password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const userData = {
      id: userExists[0]?.id,
      email: userExists[0]?.email,
      name: userExists[0]?.name,
      role: userExists[0]?.role,
    };
    const token = await generateToken(userData);
    return res.status(200).json({ success: true, token, userData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
}

export async function forgetPassword(req, res) {
  try {
    const parsedData = userForgetPasswordSchema.safeParse(req.body);

    if (!parsedData.success) {
      const errorDetails = await getDetailedErrors(parsedData);
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errorDetails,
      });
    }

    const { email } = parsedData.data;
    const userExists = await dbInstance
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!userExists?.[0]) {
      return res
        .status(400)
        .json({ success: false, message: "Email address does not exist." });
    }
    const token = jwt.sign(
      { id: userExists?.[0].id },
      userExists?.[0].password,
      {
        expiresIn: "10m",
      }
    );
    console.log(token);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: MAILER_EMAIL,
        pass: MAILER_PASSWORD,
      },
    });
    // Email configuration
    let resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
      from: MAILER_EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `
     <div style="font-family: 'Work Sans', sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; border-radius: 10px; background-color: #f5f5f5;">
      <h1 style="color: #ea7600; text-align: center; font-size: 32px; margin-bottom: 20px;">Reset Your Password</h1>
      <p style="color: #444; font-size: 17px;">We received a request to reset your password. Click on the link below to reset it:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #F6841F; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 19px;">Click Here to Reset Your Password</a>
      </p>
      <p>or directly paste the link below in your browser:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="color: #F6841F; font-weight: bold;">${resetLink}</a>
      </p>
      <p style="color: #444; font-size: 17px;">This link is valid for 10 minutes and can only be used once.</p>
      <p style="color: #444; font-size: 17px;">If you didn't request a password reset, please ignore this email.</p>
      <p style="color: #444; font-size: 17px;">Thank you!</p>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: err.message, success: false });
      }else{
   
         res.status(200).json({ message: "Password reset link sent.", success: true });
      }
     
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token } = req.params;

    let decoded = jwt.decode(token);
    console.log("Decoded", decoded);
    if (!decoded?.id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token." });
    }

    const userExists = await dbInstance
      .select()
      .from(users)
      .where(eq(users.id, decoded.id));
      console.log(userExists)

    if (!userExists?.[0]) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist." });
    }

    const parsedData = userResetPasswordSchema.safeParse(req.body);

    if (!parsedData.success) {
      const errorDetails = await getDetailedErrors(parsedData);
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errorDetails,
      });
    }

    try {
      decoded = jwt.verify(token, userExists[0].password);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }
    console.log("Decoded 2", decoded);
    const { password } = parsedData.data;

    // new password isn't the same as the old one
    const isSamePassword = await bcryptjs.compare(
      password,
      userExists[0].password
    );
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Please choose more secure password.",
      });
    }

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    await dbInstance
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, decoded.id))
      .returning();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
}
