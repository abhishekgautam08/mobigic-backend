const { generateJwtToken } = require("../../utils/jwtHelpers");
const { User } = require("../../database/mongoDb/models/User");

// signup
const signupUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email }).lean().exec();

    if (user) {
      return res.status(403).json({
        success: false,
        error: "Sorry, a user with this email already exists",
      });
    }

    //Create a new User
    const createdUser = await User.create({
      name,
      email,
      password,
    });

    const payload = {
      id: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
    };

    const token = generateJwtToken(payload);

    return res
      .status(201)
      .json({ success: true, token, message: "User Succesfully Signin" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
};
//signup

//login
const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    }).exec();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please try to login with correct email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct email or password" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const token = generateJwtToken(payload);

    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error ");
  }
};
//

const whoAmIController = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  signupUserController,
  loginUserController,
  whoAmIController,
};
