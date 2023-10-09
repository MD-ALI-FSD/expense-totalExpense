const eamount = document.querySelector("#eamount");
const ediscrp = document.querySelector("#ediscrp");
const ecategory = document.querySelector("#ecategory");
const submit = document.querySelector(".submit");
const rzpbtn = document.querySelector(".rzpbtn");
const afterpremium = document.querySelector(".after-premium");

var id = -2;

/****************************************************/
// Listen for a click on the "Add Expense" button
/****************************************************/
submit.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = eamount.value;
  const discription = ediscrp.value;
  const category = ecategory.value;

  //data validation
  if (amount === "" || discription === "" || category === "") {
    const msg = document.querySelector(".msg");
    msg.classList.add("error");
    msg.innerHTML = "Please enter values in all the fields!!!";
    // Remove error message after 3 seconds
    setTimeout(() => {
      msg.classList.remove("error");
      msg.innerHTML = "";
    }, 4000);
  }

  const newUserData = {
    amount: amount,
    discription: discription,
    category: category,
  };
  console.log(newUserData);

  //Fetching token from local storage
  const token = localStorage.getItem("token");
  //setting header
  const config = {
    headers: { Authorization: token },
  };

  if (id === -2) {
    // storing new data
    axios
      .post("http://localhost:3000/user/addexpense", newUserData, config)
      .then((res) => {
        // displayData();
        // window.location.href = "./homepage.html";
        // response.redirect("./signup.html");

        location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (id !== -2) {
    // Editing existing data
    axios
      .put(`http://localhost:3000/user/editexpense/${id}`, newUserData)
      .then((res) => {
        console.log(res.data);
        id = -2;
        // uname.value = "";
        // email.value = "";
        // mobile.value = "";
        location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

/****************************************************/
// Function to display data already available
/****************************************************/
async function displayData() {
  var html = "";
  //Fetching token from local storage
  const token = localStorage.getItem("token");
  //setting header
  const config = {
    headers: { Authorization: token },
  };

  //sending a GET request to the backend with token in the header to fetch particular users data only
  const userDetails = await axios.get("http://localhost:3000/user/getuser", config);
  const { users } = userDetails.data;
  console.log(users[0]);

  if (users[0].ispremiumuser === true) {
    rzpbtn.classList.add("hidden");
    afterpremium.classList.remove("hidden");
  }

  //sending a GET request to the backend with token in the header to fetch particular users data only
  const datarv = await axios.get("http://localhost:3000/user/getexpense", config);

  const { allExpenses: allData } = datarv.data;

  if (allData === null) return;

  for (let i = 0; i < allData.length; i++) {
    html = `<div class="child ${allData[i].id}">
            <div>Amount: Rs.${allData[i].amount}</div>
            <div>Description: ${allData[i].description}</div> 
            <div>Category: ${allData[i].category}</div>
            <button class="editbtn" id="${allData[i].id}">Edit</button>
            <button class="deletebtn" id="${allData[i].id}">Delete</button> 
        </div>`;

    const display = document.querySelector(".display");
    display.insertAdjacentHTML("afterbegin", html);
  }
}
displayData();

/******************************************************************/
// Listen for a click on the "Delete or Edit Expense" button
/******************************************************************/
const parent = document.querySelector(".display");

parent.addEventListener("click", async function editDelete(e) {
  e.preventDefault();

  //Fetching token from local storage
  const token = localStorage.getItem("token");
  //setting header
  const config = {
    headers: { Authorization: token },
  };

  if (e.target.className === "deletebtn") {
    console.log(e.target.id);
    axios
      .delete(`http://localhost:3000/user/deleteexpense/${e.target.id}`)
      .then((res) => {
        // displayData();
        // window.location.href = "./homepage.html";
        // response.redirect("./signup.html");
        location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (e.target.className === "editbtn") {
    //Fetching token from local storage
    const token = localStorage.getItem("token");
    //setting header
    const config = {
      headers: { Authorization: token },
    };

    //sending a GET request to the backend with token in the header to fetch particular users data only
    const datarv = await axios.get("http://localhost:3000/user/getexpense", config);
    const { allExpenses: allData } = datarv.data;
    if (allData === null) return;

    const idd = e.target.id;

    allData.forEach((object) => {
      if (object.id == idd) {
        // Populate form fields with the selected data
        console.log("inside if object");
        eamount.value = object.amount;
        ediscrp.value = object.description;
        ecategory.value = object.category;

        // Set the current ID for editing
        id = idd;
        return;
      }
    });
  }
});

/******************************************************************/
// Listen for a click on the "Buy Premium" button
/******************************************************************/
rzpbtn.addEventListener("click", async function (e) {
  console.log("inside razorpay button");
  const token = localStorage.getItem("token");
  //setting header
  const config = {
    headers: { Authorization: token },
  };
  //sending a GET request to backend to create an order
  const datarv = await axios.get("http://localhost:3000/user/purchasepremium", config);
  // console.log(datarv);
  const allData = datarv.data;
  console.log(allData);
  console.log(allData.order.status);

  let options = {
    key: allData.key_id, //enter the key ID generated from the dashboard
    order_id: allData.order.orderid, //for one time payment
    handler: async function (resp) {
      await axios.post(
        "http://localhost:3000/user/updatetransactionstatus",
        {
          order_id: allData.order.orderid,
          payment_id: resp.razorpay_payment_id,
        },
        config
      );
      alert("you are a Premium User Now");
      location.reload();
    },
  };
  // creates a new instance of Razorpay
  const rzpl = new Razorpay(options);
  // opens the Razorpay payment dialog on the user's screen
  rzpl.open();
  e.preventDefault();

  // event listener for the "payment.failed" event on the Razorpay instance.When a payment fails, Razorpay triggers this event.
  rzpl.on("payment.failed", function (allData) {
    console.log(allData);
    alert("something went wrong!");
  });
});
