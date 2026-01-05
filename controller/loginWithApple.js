// controllers/apple.controller.js
import jwt from "jsonwebtoken";
// import User from "../models/User.js";
import { verifyAppleIdentityToken } from "../utils/appleAuth.js";

export const appleLogin = async (req, res) => {
  try {
    const { identityToken } = req.body;

    if (!identityToken) {
      return res.status(400).json({ message: "identityToken is required" });
    }

    // 1️⃣ Verify Apple token
    const appleData = await verifyAppleIdentityToken(identityToken);

    /*
      appleData contains:
      sub  -> Apple unique user id
      email -> may exist only first time
    */

    const appleId = appleData.sub;
    console.log("appleId", appleId);
    console.log("appleData", appleData);

    // 2️⃣ Find user in DB
    // let existingUser = await User.findOne({ appleId });

    // // 3️⃣ Create user if not exists
    // if (!existingUser) {
    //   existingUser = await User.create({
    //     appleId,
    //     email: appleData.email || email,
    //     firstName: fullName?.givenName || "",
    //     lastName: fullName?.familyName || "",
    //   });
    // }

    // 4️⃣ Create JWT for your app
    // const token = jwt.sign(
    //   { userId: existingUser._id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error("Apple login error:", error);
    return res.status(401).json({
      success: false,
      message: "Apple authentication failed",
    });
  }
};
