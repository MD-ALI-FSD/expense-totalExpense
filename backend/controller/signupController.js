//Importing "Product" model to save and retrive data from the products table in the database
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

/*************************************************************/
//  Fetching Data of Already Available Users
/*************************************************************/
exports.getUsers = async (req, res, next) => {
  try {
    console.log("inside getusers backend");
    const users = await userModel.findAll({
      attributes: ['email', 'phonenumber']
    });
    // console.log(users);
    res.status(200).json({ allUsers: users });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/*************************************************************/
//  Adding New User
/*************************************************************/
exports.postAddUser = async (req, res, next) => {
  try {
    console.log("inside add backend");
    const uname = req.body.username;
    const uemail = req.body.email;
    const uphonenumber = req.body.mobile;
    const upassword = req.body.password;
    console.log(uname, uemail, uphonenumber, upassword);

    bcrypt.hash(upassword, 10, async (err, hash) => {
      console.log(err);

      const data = await userModel.create({
        name: uname,
        email: uemail,
        phonenumber: uphonenumber,
        password: hash,
      });

      res.status(201).json({ newUserDetail: data });
    });
  } catch (err) {
    res.status(500).json(err);
  }
  // catch (err) {
  //     res.status(500).json({ error: err });
  //   }
};
//   const data = await userModel.create({
//     name: uname,
//     email: uemail,
//     phonenumber: uphonenumber,
//     password: upassword,
//   });
//   console.log(data.name);
//   console.log("after data");
//   res.status(201).json({ newUserDetail: data });
// } catch (err) {
//   res.status(500).json({ error: err });
// }

//Exporting middleware to be used in "router/admin.js" to delete a product.
exports.postDeleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await userModel.destroy({ where: { id: userId } });

    res.status(200).send("deleted succesfully");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

//edit data
exports.postEditUser = (req, res, next) => {
  console.log("inside post editer backend");
  const userId = req.params.userId;
  const updatedName = req.body.uname;
  const updatedEmail = req.body.email;
  const updatedPhonenumber = req.body.mobile;
  userModel
    .update(
      {
        name: updatedName,
        email: updatedEmail,
        phonenumber: updatedPhonenumber,
      },
      { where: { id: userId } }
    )
    .then((user) => {
      console.log("consoled updated succesfully");
      res.send("updated successfully");
    })
    .catch((err) => console.log(err.message));
};
