import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,           // ✅ ✅ ADD THIS FOR DEPLOYED APP
      sameSite: "None",       // ✅ Required for cross-site
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }).json({
        success: true,
        message,
        user,
    });
};
