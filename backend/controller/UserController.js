const User = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Token = require('../model/TokenModel');
const crypto = require('crypto');
const Company = require('../model/CompanyModel');

// Register a new user (admin or people)
const register = async (req, res) => {
  const { name, email, password, token } = req.body;

  try {
    // Find and validate the token
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check if the email matches the token's email
    if (email !== tokenDoc.email) {
      return res.status(400).json({ message: 'Email does not match the token' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
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
    if (tokenDoc.role === 'people' && tokenDoc.companyId) {
      const company = await Company.findById(tokenDoc.companyId);
      if (company) {
        company.people.push(newUser._id);
        await company.save();
      }
    }

    await Token.deleteOne({ token }); // Remove the token after successful registration

    // Generate a JWT token
    const jwtToken = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token: jwtToken });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to generate a token for registration (for admin or people)
const generateToken = async (req, res) => {
  const { email, role, companyId } = req.body;

  if (role !== 'admin' && role !== 'people') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const newToken = new Token({ token, role, email, companyId });

  await newToken.save();

  // Send the token to the user via email (use your preferred email service)

  res.status(201).json({ message: 'Token generated', token });
};

module.exports = { register, login, generateToken };
