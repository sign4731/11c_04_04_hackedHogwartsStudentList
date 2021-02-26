"use strict";

let filter = "allStudents";
const expelledStudents = [];
const allStudents = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "undefined",
  responsibility: "",
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
};
let filterBy = "allStudents";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  listenToButtonClicks();

  let studentData = await loadJSON("https://petlatkea.dk/2021/hogwarts/students.json");
  bloodData = await loadJSON("https://petlatkea.dk/2021/hogwarts/families.json");
  console.log("done");
  prepareObjects(studentData);
}

function listenToButtonClicks() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
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

    // console.log(studentFullName);

    //First Name
    const studentFirstName = studentFullName[0];
    const firstNameFirstLetter = studentFirstName.substring(0, 1).toUpperCase();
    const firstNameRestOfLetters = studentFirstName.substring(1).toLowerCase();
    // console.log(`${firstNameFirstLetter}${firstNameRestOfLetters}`);
    const finalstudentFirstName = `${firstNameFirstLetter}${firstNameRestOfLetters}`;
    student.firstName = finalstudentFirstName;

    //Last name
    const arrayLength = studentFullName.length;
    // console.log(arrayLength);
    const studentLastName = studentFullName[arrayLength - 1];
    const lastNameFirstLetter = studentLastName.substring(0, 1).toUpperCase();
    const lastNameRestOfLetters = studentLastName.substring(1).toLowerCase();
    // console.log(`${lastNameFirstLetter}${lastNameRestOfLetters}`);
    const finalstudentLastName = `${lastNameFirstLetter}${lastNameRestOfLetters}`;
    student.lastName = finalstudentLastName;

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

    // House
    const studentHouse = jsonObject.house.trim();
    const houseFirstLetter = studentHouse.substring(0, 1).toUpperCase();
    const houseRestOfLetters = studentHouse.substring(1).toLowerCase();
    const finalstudentHouse = `${houseFirstLetter}${houseRestOfLetters}`;
    // console.log(`${houseFirstLetter}${houseRestOfLetters}`);
    student.house = finalstudentHouse;

    // Pictures
    if (finalstudentLastName.includes("-")) {
      const splittedLastName = finalstudentLastName.split("-");
      student.photo = `images/${splittedLastName[1]}_${student.firstName.charAt(0)}.png`;
    } else if (finalstudentLastName.includes("Patil")) {
      student.photo = `images/${student.lastName}_${student.firstName}.png`;
    } else {
      student.photo = `images/${student.lastName}_${student.firstName.charAt(0)}.png`;
    }

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
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
    console.log(filteredList);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "prefects") {
    filteredList = allStudents.filter(isPrefect);
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledStudents;
  } else if (settings.filterBy === "fullBlood") {
    filteredList = allStudents.filter(isFullBLood);
  } else if (settings.filterBy === "halfBlood") {
    filteredList = allStudents.filter(isHalfBLood);
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

function buildList() {
  const currentList = filterList(allStudents);
  const sortedCurrentList = sortList(currentList);
  showNumberOfStudents(currentList);

  // document.querySelector(".showing").textContent = `${filter} (${currentList.length})`;

  showList(sortedCurrentList);
}

function showNumberOfStudents(currentList) {
  document.querySelector(".showing").textContent = ` (${currentList.length})`;
}

function showList(students) {
  document.querySelector("#listview").innerHTML = "";

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

  if (bloodData.pure.includes(student.lastName)) {
    student.blood = "Pure blood";
  } else if (bloodData.half.includes(student.lastName)) {
    student.blood = "Half blood";
  } else {
    student.blood = "Mud blood";
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

  document.querySelector(".search").addEventListener("click", search);
}

// function search() {
//   let searchInput = document.querySelector("#search").value;
//   // let hej = allStudents.some(searchInput);
//   // console.log(hej);
//   let singleStudent;
//   let txtValue;

//   for (i = 0; i < allStudents.length; i++) {
//     singleStudent = allStudents[i].querySelector("#listview article")[0];
//     txtValue = singleStudent.textContent || singleStudent.innerText;
//     if (txtValue.toUpperCase().indexOf(filter) > -1) {
//       li[i].style.display = "";
//     } else {
//       li[i].style.display = "none";
//     }
//   }
// }

function showStudentPopup(student) {
  console.log(student);

  if (student.house.includes("Slytherin")) {
    popupSlytherin.style.display = "block";
    popupSlytherin.querySelector(".popupName").textContent = `${student.firstName} ${student.middleName} ${student.nickName} ${student.lastName}`;
    popupSlytherin.querySelector(".popupHouse").textContent = `House: ${student.house}`;
    popupSlytherin.querySelector(".popupResponsibility").textContent = `Respontibility: ${student.responsibility}`;
    popupSlytherin.querySelector(".popupBlood").textContent = `Blood: ${student.blood}`;
    popupSlytherin.querySelector(".popupPrefect").textContent = `Prefect: ${student.prefect}`;
    popupSlytherin.querySelector(".popupMember").textContent = `Member of inquisitorial squad: ${student.member}`;
    if (student.expelled) {
      popupSlytherin.querySelector(".popupExpelled").textContent = `Expelled: Yes`;
    } else {
      popupSlytherin.querySelector(".popupExpelled").textContent = `Expelled: No`;
    }

    popupSlytherin.querySelector(".popupImg").src = student.photo;
  } else if (student.house.includes("Gryffindor")) {
    popupGryffindor.style.display = "block";
    popupGryffindor.querySelector(".popupName").textContent = `${student.firstName} ${student.middleName} ${student.nickName} ${student.lastName}`;
    popupGryffindor.querySelector(".popupHouse").textContent = `House: ${student.house}`;
    popupGryffindor.querySelector(".popupResponsibility").textContent = `Respontibility: ${student.responsibility}`;
    popupGryffindor.querySelector(".popupBlood").textContent = `Blood: ${student.blood}`;
    popupGryffindor.querySelector(".popupPrefect").textContent = `Prefect: ${student.prefect}`;
    popupGryffindor.querySelector(".popupMember").textContent = `Member of inquisitorial squad: ${student.member}`;
    if (student.expelled) {
      popupGryffindor.querySelector(".popupExpelled").textContent = `Expelled: Yes`;
    } else {
      popupGryffindor.querySelector(".popupExpelled").textContent = `Expelled: No`;
    }
    popupGryffindor.querySelector(".popupImg").src = student.photo;
  } else if (student.house.includes("Hufflepuff")) {
    popupHufflepuff.style.display = "block";
    popupHufflepuff.querySelector(".popupName").textContent = `${student.firstName} ${student.middleName} ${student.nickName} ${student.lastName}`;
    popupHufflepuff.querySelector(".popupHouse").textContent = `House: ${student.house}`;
    popupHufflepuff.querySelector(".popupResponsibility").textContent = `Respontibility: ${student.responsibility}`;
    popupHufflepuff.querySelector(".popupBlood").textContent = `Blood: ${student.blood}`;
    popupHufflepuff.querySelector(".popupPrefect").textContent = `Prefect: ${student.prefect}`;
    popupHufflepuff.querySelector(".popupMember").textContent = `Member of inquisitorial squad: ${student.member}`;
    if (student.expelled) {
      popupHufflepuff.querySelector(".popupExpelled").textContent = `Expelled: Yes`;
    } else {
      popupHufflepuff.querySelector(".popupExpelled").textContent = `Expelled: No`;
    }
    popupHufflepuff.querySelector(".popupImg").src = student.photo;
  } else if (student.house.includes("Ravenclaw")) {
    popupRavenclaw.style.display = "block";
    popupRavenclaw.querySelector(".popupName").textContent = ` ${student.firstName} ${student.middleName} ${student.nickName} ${student.lastName}`;
    popupRavenclaw.querySelector(".popupHouse").textContent = `House: ${student.house}`;
    popupRavenclaw.querySelector(".popupResponsibility").textContent = `Respontibility: ${student.responsibility}`;
    popupRavenclaw.querySelector(".popupBlood").textContent = `Blood: ${student.blood}`;
    popupRavenclaw.querySelector(".popupPrefect").textContent = `Prefect: ${student.prefect}`;
    popupRavenclaw.querySelector(".popupMember").textContent = `Member of inquisitorial squad: ${student.member}`;
    if (student.expelled) {
      popupRavenclaw.querySelector(".popupExpelled").textContent = `Expelled: Yes`;
    } else {
      popupRavenclaw.querySelector(".popupExpelled").textContent = `Expelled: No`;
    }
    popupRavenclaw.querySelector(".popupImg").src = student.photo;
  }

  addListenersToCloseButtons();
}

function toggleMember(student) {
  if (student.member === true) {
    student.member = false;
    console.log("This student is not a member anymore");
  } else {
    tryToMakeMember(student);
  }

  buildList();
}

function tryToMakeMember(student) {
  if (student.blood === "Pure blood") {
    makeMember(student);
    console.log("This student is now a member!");
  } else if (student.house === "Slytherin") {
    makeMember(student);
  } else {
    showWarning();
  }

  function makeMember(student) {
    student.member = true;
  }
}

function showWarning() {
  console.log("This student cannot be member!");
  document.querySelector("#warning article").style.display = "block";
  document.querySelector(".understood_button").addEventListener("click", closeWarning);
}

function closeWarning() {
  document.querySelector("#warning article").style.display = "none";
  document.querySelector(".understood_button").removeEventListener("click", closeWarning);
}

function togglePrefect(student) {
  if (student.prefect === true) {
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
    document.querySelector(".prefect_warning [data-action=remove1]").addEventListener("click", clickRemoveA);
    document.querySelector(".prefect_warning [data-action=remove2]").addEventListener("click", clickRemoveB);

    function closeDialog() {
      document.querySelector(".prefect_warning article").style.display = "none";
      document.querySelector(".prefect_warning .close_button").removeEventListener("click", closeDialog);
      document.querySelector(".prefect_warning [data-action=remove1]").removeEventListener("click", clickRemoveA);
      document.querySelector(".prefect_warning [data-action=remove2]").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      removePrefect(prefectB);
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
  if (student.prefect === true) {
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
