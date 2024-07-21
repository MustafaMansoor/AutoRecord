const User = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const Token = require("../model/TokenModel");
const Company = require("../model/CompanyModel");

const decrypt = (encryptedText) => {
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

  // Split the encryptedText into IV and encrypted data
  const parts = encryptedText.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted text format');
  }

  const [ivHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  // Create a decipher instance
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString();
};


// Register a new user (admin or people)
const register = async (req, res) => {
  const { name, email, password, token } = req.body;
  
  const decryptedToken = decrypt(token);
  try {
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

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the role from the token
    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
      role: tokenDoc.role,
    });

    await newUser.save();
    
    // If the role is 'people', add them to the specified company
    if (tokenDoc.role === "people" && tokenDoc.companyId) {
      const company = await Company.findById(tokenDoc.companyId);
      if (company) {
        company.people.push(newUser._id);
        await company.save();
      }
    }

    await Token.deleteOne({ token: decryptedToken }); // Remove the token after successful registration
    
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

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

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

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, role: user.role, adminName: user.username });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


  const validateToken= (req, res) => {
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

module.exports = { register, login, validateToken };
