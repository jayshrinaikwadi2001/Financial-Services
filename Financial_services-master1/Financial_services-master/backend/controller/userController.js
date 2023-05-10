const User = require("../model/User");
const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json("input feild is missing");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("user not found");
    }

    const isPresent = bcrypt.compareSync(password, user.password);

    if (!isPresent) {
      return res.status(500).json("email or password are not correct");
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("error while logging");
  }
};

const registerUser = async (req, res) => {
  const { userName, email, confirmPassword, password, selectedOption } =
    req.body;

  if (!userName || !email || !confirmPassword || !password || !selectedOption) {
    return res.status(500).json("input feild is missing");
  }
  if (confirmPassword !== password) {
    return res.status(500).json("password and confirm password not match");
  }
  let userIsOpationalManager = false;
  if (selectedOption === "Relationship_Manager") {
    userIsOpationalManager = false;
  } else {
    userIsOpationalManager = true;
  }
  try {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const user = new User({
      name: userName,
      email,
      password: hash,
      isOperationalManager: userIsOpationalManager,
    });
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json("enable to register User");
  }
};

module.exports = {
  loginUser,
  registerUser,
};

// const { userName, email, password, confirmPassword, profilePicture } = req.body;
// if (!userName || !email || !password || !confirmPassword) {
//   return res.status(500).json("check details");
// }
// if (password !== confirmPassword) {
//   return res.status(500).json("check password and confirm password again");
// }
// try {
//   const saltRounds = 10;
//   const salt = bcrypt.genSaltSync(saltRounds);
//   const hash = bcrypt.hashSync(password, salt);
//   const user = new User({
//     userName,
//     email,
//     password: hash,
//     profilePicture,
//   });
//   await user.save();
//   return res.status(200).json(user);
// } catch (err) {
//   console.error(err);
//   return res.status(500).json("enable to register User");
// }
