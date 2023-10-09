//Importing "Product" model to save and retrive data from the products table in the database
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//helper function to verify credentials
function isstringinvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

// var token = "";
//helper function to generate tokenised user Id
function generateAccessToken(id) {
  // exports.token = generateRandomToken(32);
  // console.log(token);
  return jwt.sign({ userId: id }, "69EdyIEvGh2Dj2jlihmhOhZ9S2VwvGMb");
}
//helper function to generate token
function generateRandomToken(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let gtoken = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    gtoken += charset[randomIndex];
  }
  return gtoken;
}

// Generate a random access token with a specific length (e.g., 32 characters)
// const accessToken = generateRandomToken(32);
// console.log(accessToken);

/***********************************************************/
//  Controller to verify User before loggin in
/***********************************************************/
exports.postVerifyUser = async (req, res, next) => {
  try {
    const uemail = req.body.email;
    const upassword = req.body.password;

    //data validation
    if (isstringinvalid(uemail) || isstringinvalid(upassword)) {
      console.log("inside verify invalidstring backend");
      return res
        .status(400)
        .json({ message: "Email id or password is missing" });
    }
    console.log(uemail, upassword);

    //data fetching from the user table and then comparing it
    const user = await userModel.findAll({ where: { email: uemail } });
    if (user.length > 0) {
      //comparing tokenised user-id with real user-id in the table
      bcrypt.compare(upassword, user[0].password, (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
        }
        if (result === true) {
          console.log("inside verify response backend");
          console.log(user[0].id);
          res.status(200).json({
            success: true,
            message: "user logged in successfully",
            // dat: user[0].id, //sending tokenised user-id to the frontend
            token: generateAccessToken(user[0].id),
          });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "password is incorrect" });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};

// Export the variable so it can be used in other files
// module.exports = token;
