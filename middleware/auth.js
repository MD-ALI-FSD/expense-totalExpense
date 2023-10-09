const jwt = require("jsonwebtoken");
const userModel = require("../backend/models/userModel");

// Import the variable from loginController.js file
// const importedToken = require("../backend/controller/loginController");

exports.authenticate = (req, res, next) => {
  try {
    // console.log("inside auth");
    //token recived from the header of the GET request
    const token = req.header("Authorization");
    // console.log(token);
    // console.log("inside auth token");
    //decrypting tokenised user-id
    const user = jwt.verify(token, "69EdyIEvGh2Dj2jlihmhOhZ9S2VwvGMb");
    // console.log("inside auth user" + user);

    //checking the user table for a user with this user-id
    userModel
      .findByPk(user.userId)
      .then((user) => {
        //converting object type data recived into JSON type whis is more readable
        // console.log(JSON.stringify(user));
        // console.log("inside auth user.id" + user.id);
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};
