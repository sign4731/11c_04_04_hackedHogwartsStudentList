"use strict";

const expelledStudents = [];
const allStudents = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "undefined",
  expelled: false,
  member: false,
  prefect: false,
  blood: "",
  photo: "",
};
let bloodData = [];
const settings = {
  filter: "allStudents",
  sortBy: "firstName",
  isHacked: false,
};

window.addEventListener("DOMContentLoaded", init);

async function init() {
  setEventListeners();

  const jsonData = await loadJSON("https://petlatkea.dk/2021/hogwarts/students.json");
  bloodData = await loadJSON("https://petlatkea.dk/2021/hogwarts/families.json");
  console.log("done");
  prepareObjects(jsonData);
}

function setEventListeners() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));

  document.querySelector("input").addEventListener("input", search);
}

async function loadJSON(url) {
  const JSONData = await fetch(url);
  const result = await JSONData.json();
  console.log(result);
  return result;
}

function prepareObjects(jsonData) {
  //   console.table(jsonData);

  jsonData.forEach((jsonObject) => {
    const student = Object.create(Student);
    const studentFullName = jsonObject.fullname.trim().split(" ");

    console.log(studentFullName);

    //First Name
    const studentFirstName = studentFullName[0];
    const firstNameFirstLetter = studentFirstName.substring(0, 1).toUpperCase();
    const firstNameRestOfLetters = studentFirstName.substring(1).toLowerCase();
    // console.log(`${firstNameFirstLetter}${firstNameRestOfLetters}`);
    const finalstudentFirstName = `${firstNameFirstLetter}${firstNameRestOfLetters}`;

    //Last name
    const arrayLength = studentFullName.length;
    // console.log(arrayLength);
    const studentLastName = studentFullName[arrayLength - 1];
    const lastNameFirstLetter = studentLastName.substring(0, 1).toUpperCase();
    const lastNameRestOfLetters = studentLastName.substring(1).toLowerCase();
    // console.log(`${lastNameFirstLetter}${lastNameRestOfLetters}`);
    const finalstudentLastName = `${lastNameFirstLetter}${lastNameRestOfLetters}`;
    // if(studentFirstName.includes)

    //Middle name
    const studentFullName2 = jsonObject.fullname.trim();
    const firstSpace = studentFullName2.indexOf(" ");
    const lastSpace = studentFullName2.lastIndexOf(" ");
    const studentMiddleName = studentFullName2.substring(firstSpace, lastSpace);
    if (studentMiddleName.includes('"')) {
      //   const nickNameBeforeFirstLetter = studentMiddleName.substring(0, 2);
      const nickNameFirstLetter = studentMiddleName.substring(2, 3).toUpperCase();
      const nickNameRestOfLetters = studentMiddleName.substring(3, studentMiddleName.length - 1).toLowerCase();
      const finalstudentNickName = `${nickNameFirstLetter}${nickNameRestOfLetters}`;
      //   console.log(finalstudentNickName);
      student.nickName = finalstudentNickName;
    } else {
      // console.log(studentMiddleName);
      const middleNameFirstLetter = studentMiddleName.substring(1, 2).toUpperCase();
      const middleNameRestOfLetters = studentMiddleName.substring(2).toLowerCase();
      const finalstudentMiddleName = `${middleNameFirstLetter}${middleNameRestOfLetters}`;
      //   console.log(finalstudentMiddleName);
      student.middleName = finalstudentMiddleName;
    }
    // console.log(studentMiddleName);

    if (studentFullName.length === 1) {
      student.firstName = studentFullName;
    } else {
      student.firstName = finalstudentFirstName;
      student.lastName = finalstudentLastName;
    }

    // House
    const studentHouse = jsonObject.house.trim();
    const houseFirstLetter = studentHouse.substring(0, 1).toUpperCase();
    const houseRestOfLetters = studentHouse.substring(1).toLowerCase();
    const finalstudentHouse = `${houseFirstLetter}${houseRestOfLetters}`;
    // console.log(`${houseFirstLetter}${houseRestOfLetters}`);
    student.house = finalstudentHouse;

    // Pictures
    const lastNamePhoto = studentLastName.substring(0, 1).toLowerCase() + studentLastName.substring(1).toLowerCase();
    const firstNamePhoto = studentFirstName.substring(0, 1).toLowerCase() + studentFirstName.substring(1).toLowerCase();
    if (studentLastName.includes("-")) {
      const splittedLastName = lastNamePhoto.split("-");
      student.photo = `images/${splittedLastName[1]}_${firstNamePhoto.charAt(0)}.png`;
    } else if (studentLastName.includes("Patil")) {
      student.photo = `images/${lastNamePhoto}_${firstNamePhoto}.png`;
    } else if (studentFirstName.includes("Leanne")) {
      student.photo = `images/default_image.png`;
    } else {
      student.photo = `images/${lastNamePhoto}_${firstNamePhoto.charAt(0)}.png`;
    }

    // console.log(lastNamePhoto, firstNamePhoto);

    // console.log(Student);
    allStudents.push(student);
  });

  //   console.table(allStudents);

  buildList();
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  console.log(sortBy);
  document.querySelectorAll("[data-action='sort']").forEach((btn) => {
    btn.classList.remove("chosen");
  });
  this.classList.add("chosen");
  setSort(sortBy);
}

function setSort(sortBy) {
  settings.sortBy = sortBy;
  buildList();
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  document.querySelector(".showing").textContent = `${filter} `;
  console.log(filter);
  document.querySelectorAll("[data-action='filter']").forEach((btn) => {
    btn.classList.remove("chosen");
  });
  this.classList.add("chosen");
  setFilter(filter);
}

function setFilter(filter) {
  settings.filter = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filter === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
    console.log(filteredList);
  } else if (settings.filter === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filter === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filter === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filter === "prefects") {
    filteredList = allStudents.filter(isPrefect);
  } else if (settings.filter === "expelled") {
    filteredList = expelledStudents;
  } else if (settings.filter === "pureBlood") {
    filteredList = allStudents.filter(isFullBLood);
  } else if (settings.filter === "halfBlood") {
    filteredList = allStudents.filter(isHalfBLood);
  } else if (settings.filter === "mudBlood") {
    filteredList = allStudents.filter(isMudBLood);
  }

  return filteredList;
}

function sortList(sortedList) {
  if (settings.sortBy === "firstName") {
    sortedList = sortedList.sort(compareFirstName);
  } else if (settings.sortBy === "lastName") {
    sortedList = sortedList.sort(compareLastName);
  } else if (settings.sortBy === "house") {
    sortedList = sortedList.sort(compareHouse);
  }

  return sortedList;
}

function determineBloodStatus(student) {
  if (!settings.isHacked) {
    if (bloodData.pure.includes(student.lastName)) {
      student.blood = "Pure blood";
    } else if (bloodData.half.includes(student.lastName)) {
      student.blood = "Half blood";
    } else {
      student.blood = "Mud blood";
    }
  } else {
    if (bloodData.pure.includes(student.lastName)) {
      makeBloodTypeRandom(student);
    } else if (bloodData.half.includes(student.lastName)) {
      student.blood = "Pure blood";
    } else {
      student.blood = "Pure blood";
    }
  }
}

function search() {
  let searchInput = document.querySelector("#search").value;
  // console.log(searchInput);
  let preparedSearchInput = searchInput.charAt(0).toUpperCase() + searchInput.substring(1);
  console.log(preparedSearchInput);

  const searchedData = allStudents.filter((student) => {
    return (
      student.firstName.includes(preparedSearchInput) ||
      student.firstName.includes(searchInput) ||
      student.lastName.includes(preparedSearchInput) ||
      student.lastName.includes(searchInput) ||
      student.middleName.includes(preparedSearchInput) ||
      student.middleName.includes(searchInput) ||
      student.house.includes(preparedSearchInput) ||
      student.house.includes(searchInput)
    );
  });
  console.log(searchedData);
  showList(searchedData);
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedCurrentList = sortList(currentList);

  showList(sortedCurrentList);
}

function showNumberOfStudents(currentList) {
  document.querySelector(".showing_number").textContent = ` (${currentList.length})`;
}

function showList(students) {
  document.querySelector("#listview").innerHTML = "";
  showNumberOfStudents(students);

  students.forEach(showStudent);
}

function showStudent(student) {
  const templatePointer = document.querySelector("template");
  const sectionPointer = document.querySelector("#listview");

  const klon = templatePointer.cloneNode(true).content;

  klon.querySelector(".firstName").textContent = student.firstName;
  klon.querySelector(".lastName").textContent = student.lastName;
  klon.querySelector(".house").textContent = student.house;
  klon.querySelector(".ifExpelled").textContent = student.expelled;
  klon.querySelector(".student_img").src = student.photo;

  determineBloodStatus(student);
  if (student.prefect) {
    klon.querySelector(".make_prefect").textContent = "Remove prefect";
  } else {
    klon.querySelector(".make_prefect").textContent = "Make prefect";
  }

  if (student.expelled) {
    klon.querySelector(".ifExpelled").textContent = "Expelled";
    klon.querySelector(".expel").style.display = "none";
  } else {
    klon.querySelector(".ifExpelled").textContent = "";
  }

  if (student.member) {
    klon.querySelector(".make_member").textContent = "Remove as member";
  } else {
    klon.querySelector(".make_member").textContent = "Make member";
  }

  klon.querySelector(".expel").addEventListener("click", clickExpelled);

  function clickExpelled() {
    console.log("Expelled clicked");
    expelled(student);
    // console.log(student);
  }

  klon.querySelector(".make_prefect").addEventListener("click", clickPrefect);

  function clickPrefect() {
    console.log("Prefect clicked");
    togglePrefect(student);
  }

  klon.querySelector(".make_member").addEventListener("click", clickMember);

  function clickMember() {
    toggleMember(student);
  }

  klon.querySelector(".details").addEventListener("click", () => showStudentPopup(student));
  sectionPointer.appendChild(klon);
}

function makeBloodTypeRandom(student) {
  let myRandom = Math.floor(Math.random() * 2 + 1);
  if (myRandom === 1) {
    student.blood = "Half blood";
  } else {
    student.blood = "Mud blood";
  }
}

function showStudentPopup(student) {
  console.log(student);

  console.log(`#popup${student.house}`);
  document.querySelector(`#popup${student.house}`).style.display = "block";
  document.querySelector(`#popup${student.house} .popupName`).textContent = `${student.firstName} ${student.middleName} ${student.nickName} ${student.lastName}`;
  document.querySelector(`#popup${student.house} .popupHouse`).textContent = `${student.house}`;
  document.querySelector(`#popup${student.house} .popupBlood`).textContent = `${student.blood}`;
  if (student.prefect) {
    document.querySelector(`#popup${student.house} .popupPrefect`).textContent = `Prefect`;
  } else {
    document.querySelector(`#popup${student.house} .popupPrefect`).textContent = null;
  }
  if (student.member) {
    document.querySelector(`#popup${student.house} .popupMember`).textContent = `Member of inquisitorial squad`;
  } else {
    document.querySelector(`#popup${student.house} .popupMember`).textContent = null;
  }

  document.querySelector(`#popup${student.house} .popupImg`).src = student.photo;
  if (student.expelled) {
    document.querySelector(`#popup${student.house} .popupExpelled`).textContent = `Expelled`;
  } else {
    document.querySelector(`#popup${student.house} .popupExpelled`).textContent = null;
  }

  addListenersToCloseButtons();
}

function toggleMember(student) {
  if (student.member) {
    student.member = false;
    console.log("This student is not a member anymore");
  } else if (student.blood === "Pure blood" || student.house === "Slytherin") {
    student.member = true;
    if (settings.isHacked) {
      setTimeout(function () {
        toggleMember(student);
      }, 2000);
    }
  } else {
    showWarning();
  }

  buildList();
}

function showWarning() {
  console.log("This student cannot be member!");
  document.querySelector("#warning article").style.display = "block";
  document.querySelector("#warning article p").textContent = "This student is not classified to be a member if the Inquisitorial squad!";
  document.querySelector(".understood_button").addEventListener("click", closeWarning);
}

function showExpelWarning() {
  console.log("You cannot expel me!");
  document.querySelector("#warning article").style.display = "block";
  document.querySelector("#warning article p").textContent = "You can not expel me!";
  document.querySelector(".understood_button").addEventListener("click", closeWarning);
}

function closeWarning() {
  document.querySelector("#warning article").style.display = "none";
  document.querySelector(".understood_button").removeEventListener("click", closeWarning);
}

function togglePrefect(student) {
  if (student.prefect) {
    student.prefect = false;
  } else {
    tryToMakePrefect(student);
    // student.prefect = true;
  }

  buildList();
}

function tryToMakePrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);

  // const numberOfPrefects = prefects.length;

  const other = prefects.filter((student) => student.house === selectedStudent.house);

  if (other.length >= 2) {
    console.log("There can be only two prefects of each house!");
    removeAorB(other[0], other[1]);
  } else {
    makePrefect(selectedStudent);
  }
  console.log(prefects);
  console.log(other);

  // function removeOtherPrefect(other) {}

  function removeAorB(prefectA, prefectB) {
    console.log(prefectA, prefectB);
    document.querySelector(".prefect_warning article").style.display = "block";
    document.querySelector(".prefect_warning .close_button").addEventListener("click", closeDialog);
    document.querySelector(".prefect_warning [data-action=remove1]").textContent = `Remove ${prefectA.firstName}`;
    document.querySelector(".prefect_warning [data-action=remove2]").textContent = `Remove ${prefectB.firstName}`;
    document.querySelector(".prefect_warning [data-action=remove1]").addEventListener("click", function () {
      changePrefectStatus(prefect);
    });
    document.querySelector(".prefect_warning [data-action=remove2]").addEventListener("click", function () {
      changePrefectStatus(prefect);
    });

    function closeDialog() {
      document.querySelector(".prefect_warning article").style.display = "none";
      document.querySelector(".prefect_warning .close_button").removeEventListener("click", closeDialog);
      document.querySelector(".prefect_warning [data-action=remove1]").removeEventListener("click", function () {
        changePrefectStatus(prefect);
      });
      document.querySelector(".prefect_warning [data-action=remove2]").removeEventListener("click", function () {
        changePrefectStatus(prefect);
      });
    }

    function changePrefectStatus(prefect) {
      removePrefect(prefect);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}
function expelled(student) {
  if (student.expelled === true) {
    console.log("This student is alredy expelled!");
    // showExpelWarning();
  } else if (student.firstName === "Signe") {
    showExpelWarning();
  } else {
    student.expelled = true;
    let expelledIndex = allStudents.indexOf(student);
    console.log(expelledIndex);
    let expelledStudent = allStudents.splice(expelledIndex, 1);
    console.log(expelledStudent, "the one expelled student");
    expelledStudents.push(expelledStudent[0]);
    console.log(expelledStudents, "Expelled students array");
  }
  buildList();
}

function addListenersToCloseButtons() {
  document.querySelector(".closeRavenclaw").addEventListener("click", () => (popupRavenclaw.style.display = "none"));
  document.querySelector(".closeSlytherin").addEventListener("click", () => (popupSlytherin.style.display = "none"));
  document.querySelector(".closeGryffindor").addEventListener("click", () => (popupGryffindor.style.display = "none"));
  document.querySelector(".closeHufflepuff").addEventListener("click", () => (popupHufflepuff.style.display = "none"));
}

//Sorting
function compareFirstName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function compareLastName(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function compareHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}

//Filtering
function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isPrefect(student) {
  if (student.prefect) {
    return true;
  } else {
    return false;
  }
}

function isFullBLood(student) {
  if (student.blood === "Pure blood") {
    return true;
  } else {
    return false;
  }
}

function isHalfBLood(student) {
  if (student.blood === "Half blood") {
    return true;
  } else {
    return false;
  }
}

function isMudBLood(student) {
  if (student.blood === "Mud blood") {
    return true;
  } else {
    return false;
  }
}

// hack the system

function hackTheSystem() {
  settings.isHacked = true;
  console.log("The system is hacked");
  changeLooks();
  addMeAsStudent();
  //fuck with inquisitorial squad
}

function changeLooks() {
  document.querySelector("h1").classList.add("hacked");
  document.querySelector("body").classList.add("hacked");
}

function addMeAsStudent() {
  const me = Object.create(Student);

  me.firstName = "Signe";
  me.lastName = "Mathiasen";
  me.middleName = "Marie";
  me.house = "Hufflepuff";
  me.blood = "Mud blood";
  me.photo = "images/me_hogwarts.png";
  allStudents.push(me);
  buildList();
}
