const login_email = document.querySelector("#login-email");
const login_password = document.querySelector("#login-password");
const signin = document.querySelector(".signin");

/****************************************************/
// Listening to the Click on SignIn button
/****************************************************/
signin.addEventListener("click", function (e) {
  e.preventDefault();

  const email = login_email.value;
  const password = login_password.value;

  //data validation
  if (email === "" || password === "") {
    const msg = document.querySelector(".msg");
    msg.classList.add("error");
    msg.innerHTML = "Please enter values in all the fields!!!";
    // Remove error after 3 seconds
    setTimeout(() => {
      msg.classList.remove("error");
      msg.innerHTML = "";
    }, 4000);
  }

  const loginObj = {
    email: email,
    password: password,
  };

  axios
    .post("http://localhost:3000/user/login", loginObj)
    .then((res) => {
      alert(res.data.message);
      //tokenised userId received from backend after user Logs-In successfully
      console.log(res.data.token);
      localStorage.setItem("token", res.data.token);
      window.location.href = "./Expense.html";
    })
    .catch((err) => {
      console.log(err);
    });

  // //datarv is an object
  // const datarv = await axios.get("http://localhost:3000/user/get-user");
  // //datarv.data is an array
  // const { allUsers: allData } = datarv.data;
  // console.log(allData);
  // // console.log(allData);
  // if (allData === null) return;

  // for (let i = 0; i < allData.length; i++) {
  //   if (allData[i].email === email && allData[i].password === password) {
  //     window.location.href = "./homepage.html";
  //   }
  // }
  // console.log(email, password);
});
