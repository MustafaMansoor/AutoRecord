
const crypto = require("crypto");
const Token = require("../model/TokenModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");


// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});




const invitePeople = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if token is provided
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const userRole = decodedToken.role;

    // Check if the user is an admin
    if (userRole !== 'admin') {
      return res.status(403).json({ error: "Access denied. Only admins can create companies." });
    }

    const { email, companyId, admin, company } = req.body;
    const inviteToken = await generateToken(email, "people", companyId); // renamed to avoid conflict
    const signupLink = `http://localhost:5173/login?token=${inviteToken}`;
    const status = await sendEmail(email, signupLink, admin, company);

    if (status) {
      res.status(200).json({ message: "User invited successfully" });
    } else {
      res.status(500).json({ message: "Error sending email" });
    }
  } catch (error) {
    console.error("Error inviting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const encrypt = (text) => {
  const algorithm = 'aes-256-ctr';
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    throw new Error('Secret key not defined in environment variables');
  }

  // Ensure the key is 32 bytes (64 hex characters)
  const keyBuffer = Buffer.from(secretKey, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('Secret key must be 32 bytes long');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const generateToken = async (email, role, companyId) => {
  if (role !== "admin" && role !== "people") {
    return "Invalid role";
  }

  const token = crypto.randomBytes(32).toString("hex");
  const newToken = new Token({ token, role, email, companyId });
  await newToken.save();

  const encryptedToken = encrypt(token);
  return encryptedToken;
};


const sendEmail = async (email, signupLink, admin, company ) => {
 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `AutoRecord Company Invitation by ${admin} for ${company}`,
    html: `
  <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #648435;">AutoRecord Company Invitation</h1>
    <p style="font-size: 16px;">You have been invited to join <strong>${company}</strong> by <strong>${admin}</strong>.</p>
    <p style="font-size: 16px;">Click the link below to sign up:</p>
    <a href="${signupLink}" style="
      display: inline-block;
      padding: 10px 20px;
      margin: 10px 0;
      font-size: 18px;
      color: #fff;
      background-color: #648435;
      text-decoration: none;
      border-radius: 5px;
    ">Sign Up</a>
    <p style="font-size: 12px; color: #999;">If you did not request this invitation, please ignore this email.</p>
  </div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};




const decrypt = (hash) => {
  const [iv, encrypted] = hash.split(':');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);

  return decrypted.toString();
};




module.exports = { invitePeople, generateToken, sendEmail };
