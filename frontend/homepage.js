/****************************************************/
// Function to display data already available
/****************************************************/
async function displayData() {
  var html = "";
  //datarv is an object
  const datarv = await axios.get("http://localhost:3000/user/get-user");
  //datarv.data is an array
  const { allUsers: allData } = datarv.data;
  // console.log(allData);
  if (allData === null) return;

  for (let i = 0; i < allData.length; i++) {
    html = `<div class="child ${allData[i].id}">
            <div>${allData[i].name}</div>
            <div>${allData[i].email}</div> 
            <div>${allData[i].phonenumber}</div>
            <button class="editbtn" id="${allData[i].id}">Edit</button>
            <button class="deletebtn" id="${allData[i].id}">Delete</button> 
        </div>`;

    const display = document.querySelector(".display");
    display.insertAdjacentHTML("afterbegin", html);
  }
}
// displayData();
