const User = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const Token = require("../model/TokenModel");
const Company = require("../model/CompanyModel");

const nodemailer = require("nodemailer");

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const decrypt = (encryptedText) => {
  const algorithm = "aes-256-ctr";
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    throw new Error("Secret key not defined in environment variables");
  }

  // Ensure the key is 32 bytes (64 hex characters)
  const keyBuffer = Buffer.from(secretKey, "hex");
  if (keyBuffer.length !== 32) {
    throw new Error("Secret key must be 32 bytes long");
  }

  // Split the encryptedText into IV and encrypted data
  const parts = encryptedText.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted text format");
  }

  const [ivHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  // Create a decipher instance
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString();
};

// Register a new user (admin or people)
const register = async (req, res) => {
  const { name, email, password, token } = req.body;

  try {
    let role = "admin"; // Default role if no token is provided
    let companyId = null;

    if (token) {
      const decryptedToken = decrypt(token);
      const tokenDoc = await Token.findOne({ token: decryptedToken });
      if (!tokenDoc) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Check if the email matches the token's email
      if (email !== tokenDoc.email) {
        return res
          .status(400)
          .json({ message: "Email does not match the token" });
      }

      role = tokenDoc.role;
      companyId = tokenDoc.companyId;
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the determined role
    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
      role: role,
    });

    await newUser.save();

    // If the role is 'people' and a companyId is provided, add them to the specified company
    if (role === "people" && companyId) {
      const company = await Company.findById(companyId);
      if (company) {
        company.people.push(newUser._id);
        await company.save();
      }
    }

    if (token) {
      await Token.deleteOne({ token: decryptedToken }); // Remove the token after successful registration
    }

    // Generate a JWT token
    const jwtToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token: jwtToken });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password, token } = req.body;
  const headerToken = token;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If a token is provided in the header, handle the "people" role logic
    if (headerToken) {
      const decryptedToken = decrypt(headerToken);
      const tokenDoc = await Token.findOne({ token: decryptedToken });
      if (!tokenDoc) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Check if the user role is "people" and add them to the company
      if (user.role === "people" && tokenDoc.companyId) {
        const company = await Company.findById(tokenDoc.companyId);
        if (company && !company.people.includes(user._id)) {
          company.people.push(user._id);
          await company.save();
        }
      }
    }

    // Generate a JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token: jwtToken, role: user.role, adminName: user.username });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const validateToken = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ valid: false });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false });
    }

    // Optionally, you can add more checks here (e.g., check if the user still exists in the database)
    res.json({ valid: true });
  });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save the token to the database
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Create the reset password link
    const resetPasswordLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Send the reset password email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "AutoRecord - Password Reset Request",
      html: `
  <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
    <p style="font-size: 16px;">You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
    <br />
    <p style="font-size: 16px;">Click the link below to reset your password:</p>
    <a href="${resetPasswordLink}" style="
      display: inline-block;
      padding: 10px 20px;
      margin: 10px 0;
      font-size: 18px;
      color: #fff;
      background-color: #648435;
      text-decoration: none;
      border-radius: 5px;
    ">Reset Password</a>
    <p style="font-size: 12px; color: #999;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
  </div>
`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset link has been sent to your email" });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Hash the token to compare with the stored hash
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find the user by the reset token and ensure the token is not expired
    const user = await User.findOne({
      resetPasswordToken: hashedResetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token and expiry
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  validateToken,
  resetPassword,
  updatePassword,
};
