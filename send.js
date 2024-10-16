import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
const firebaseConfig = {
  apiKey: "AIzaSyApXmOU_MW6Dd-gdFTwtsoYDt8SoMuLe_I",
  authDomain: "fileshareing-1774a.firebaseapp.com",
  databaseURL: "https://fileshareing-1774a-default-rtdb.firebaseio.com",
  projectId: "fileshareing-1774a",
  storageBucket: "fileshareing-1774a.appspot.com",
  messagingSenderId: "747633823888",
  appId: "1:747633823888:web:18ffc916a4fcea288d4815",
  measurementId: "G-K0HRDC215E",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import {
  getStorage,
  deleteObject,
  ref as stref,
  uploadBytesResumable,
  uploadBytes,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
const db = getDatabase();
const storage = getStorage();
var storageref = stref(storage, "files/");
document.getElementById("sendc").addEventListener("click", send);
let cId = document.getElementById("Id");
let cPass = document.getElementById("Password");
let cMsg = document.getElementById("messageInput");
let cFile = document.getElementById("fileInput");
var filenum = 0;
var filenames = [];
var files = [];
function send() {
  document.getElementById("loadingfiles").innerHTML = "";
  for (var i = 0; i < filenum; i++) {
    document.getElementById("loadingfiles").innerHTML =
      document.getElementById("loadingfiles").innerHTML +
      `<div class="loadingfileschilds"><div class="l" id="${
        "l" + i
      }"></div></div>`;
  }
  try {
    document.getElementById("sendc").innerHTML = `<div class="load"></div>`;
    document.getElementById("sendc").disabled = true;
    get(child(ref(db), cId.value)).then((snapshot) => {
      if (filenum == 0) {
        document.getElementById(
          "msgdis"
        ).innerText = `Please select a File to Share`;
        document.getElementById("msgdis").style.color = "red";
        document.getElementById("sendc").disabled = false;
        document.getElementById("sendc").innerHTML = `Send`;
      } else {
        if (snapshot.exists()) {
          if (snapshot.val().pass == cPass.value) {
            document.getElementById(
              "msgdis"
            ).innerHTML = `<div class="sendingloader"></div>`;
            document.getElementById("msgdis").style.color = "blue";
            if (cMsg.value == "") cMsg.value = "unknown";
            if (cPass.value == "") cPass.value = "none";
            var countfile = 0;
            var task = [];
            for (let i = 0; i < filenum; i++) {
              if (
                files[i].name.endsWith(".apk") ||
                files[i].name.endsWith(".Apk") ||
                files[i].name.endsWith(".exe") ||
                files[i].name.endsWith(".Exe")
              ) {
                let filenameapk = files[i].name;
                let lastdot = filenameapk.lastIndexOf(".");
                if (lastdot != -1) {
                  filenameapk =
                    filenameapk.slice(0, lastdot) +
                    "dot" +
                    filenameapk.slice(lastdot + 1);
                }
                storageref = stref(storage, cId.value + "/" + filenameapk);
              } else {
                storageref = stref(storage, cId.value + "/" + files[i].name);
              }
              task[i] = uploadBytesResumable(storageref, files[i]);
              task[i].on("state_changed", (s) => {
                let percentage = Math.floor(
                  (s.bytesTransferred / s.totalBytes) * 100
                );
                document.getElementById(`${"l" + i}`).style.backgroundColor =
                  "rgb(107, 107, 218)";
                if (percentage == 100) {
                  document.getElementById(`${"l" + i}`).style.backgroundColor =
                    "green";
                }
                document.getElementById(`${"l" + i}`).style.width = `${
                  percentage + "%"
                }`;
              });
              task[i]
                .then((snapshot) => {
                  countfile = countfile + 1;
                  document.getElementById("msgdis").innerText =
                    countfile + " file sented";
                  document.getElementById("msgdis").style.color = "blue";
                  if (countfile == filenum) {
                    set(ref(db, cId.value), {
                      pass: cPass.value,
                      msg: cMsg.value,
                    }).then(() => {
                      document.getElementById(
                        "msgdis"
                      ).innerText = `Send Successfully`;
                      document.getElementById("loadingfiles").innerHTML = "";
                      document.getElementById("msgdis").style.color = "green";
                      document.getElementById("sendc").disabled = false;
                      document.getElementById("sendc").innerHTML = `Send`;
                    });
                  }
                })
                .catch((e) => {
                  document.getElementById("msgdis").innerText =
                    "error in " + countfile + " file";
                  document.getElementById("msgdis").style.color = "red";
                  document.getElementById(
                    `${"l" + countfile}`
                  ).style.color = `red`;
                });
            }
          } else {
            document.getElementById(
              "msgdis"
            ).innerText = `Already a user with this Id ${cId.value}`;
            document.getElementById("msgdis").style.color = "red";
            document.getElementById("loadingfiles").innerHTML = "";
            document.getElementById("sendc").disabled = false;
            document.getElementById("sendc").innerHTML = `Send`;
          }
        } else {
          document.getElementById(
            "msgdis"
          ).innerHTML = `<div class="sendingloader"></div>`;
          document.getElementById("msgdis").style.color = "blue";
          if (cMsg.value == "") cMsg.value = "unknown";
          if (cPass.value == "") cPass.value = "none";
          var countfile = 0;
          var task = [];
          for (let i = 0; i < filenum; i++) {
            if (
              files[i].name.endsWith(".apk") ||
              files[i].name.endsWith(".Apk") ||
              files[i].name.endsWith(".exe") ||
              files[i].name.endsWith(".Exe")
            ) {
              let filenameapk = files[i].name;
              let lastdot = filenameapk.lastIndexOf(".");
              if (lastdot != -1) {
                filenameapk =
                  filenameapk.slice(0, lastdot) +
                  "dot" +
                  filenameapk.slice(lastdot + 1);
              }
              storageref = stref(storage, cId.value + "/" + filenameapk);
            } else {
              storageref = stref(storage, cId.value + "/" + files[i].name);
            }

            task[i] = uploadBytesResumable(storageref, files[i]);
            task[i].on("state_changed", (s) => {
              let percentage = Math.floor(
                (s.bytesTransferred / s.totalBytes) * 100
              );
              document.getElementById(`${"l" + i}`).style.backgroundColor =
                "rgb(107, 107, 218)";
              if (percentage == 100) {
                document.getElementById(`${"l" + i}`).style.color = "green";
              }
              document.getElementById(`${"l" + i}`).style.width = `${
                percentage + "%"
              }`;
            });
            task[i]
              .then((snapshot) => {
                countfile = countfile + 1;
                document.getElementById("msgdis").innerText =
                  countfile + " file sented";
                document.getElementById("msgdis").style.color = "blue";
                if (countfile == filenum) {
                  set(ref(db, cId.value), {
                    pass: cPass.value,
                    msg: cMsg.value,
                  }).then(() => {
                    document.getElementById(
                      "msgdis"
                    ).innerText = `Send Successfully`;
                    document.getElementById("loadingfiles").innerHTML = "";
                    document.getElementById("msgdis").style.color = "green";
                    document.getElementById("sendc").disabled = false;
                    document.getElementById("sendc").innerHTML = `Send`;
                  });
                }
              })
              .catch((e) => {
                document.getElementById("msgdis").innerText =
                  "error in " + countfile + " file";
                document.getElementById("msgdis").style.color = "red";
                document.getElementById(
                  `${"l" + countfile}`
                ).style.color = `red`;
              });
          }
        }
      }
    });
  } catch (e) {
    document.getElementById("sendc").disabled = false;
    document.getElementById("sendc").innerHTML = `Send`;
    if (cId.value == "") {
      document.getElementById("msgdis").innerText = `Please enter Id`;
    } else {
      document.getElementById(
        "msgdis"
      ).innerText = `Id can't contain "." , "#" , "$" , "[" , or "]"`;
    }
    document.getElementById("msgdis").style.color = "red";
  }
}
document.getElementById("delete").addEventListener("click", deletefrom);
function deletefrom() {
  try {
    get(child(ref(db), cId.value)).then((snapshot) => {
      if (snapshot.exists()) {
        if (cPass.value == "") cPass.value = "none";
        if (snapshot.val().pass == cPass.value) {
          remove(child(ref(db), cId.value)).then(() => {
            cPass.value = "";
            let storageref = stref(storage, cId.value);
            listAll(storageref).then((res) => {
              res.items.forEach((fileRef) => {
                deleteObject(fileRef);
              });
            });
            document.getElementById(
              "msgdis"
            ).innerText = `Deleted Successfully`;
            document.getElementById("msgdis").style.color = "green";
          });
        } else {
          document.getElementById("msgdis").innerText = `Wrong Password`;
          document.getElementById("msgdis").style.color = "red";
        }
      } else {
        document.getElementById(
          "msgdis"
        ).innerText = `There is no user name with ${cId.value}`;
        document.getElementById("msgdis").style.color = "red";
      }
    });
  } catch (e) {
    if (cId.value == "") {
      document.getElementById("msgdis").innerText = `Please enter Id`;
      document.getElementById("msgdis").style.color = "red";
    } else {
      document.getElementById("msgdis").innerText = `Please Provide Correct Id`;
      document.getElementById("msgdis").style.color = "red";
    }
  }
}
cFile.onchange = function getfile(e) {
  files = e.target.files;
  filenum = files.length;
  for (var i = 0; i < filenum; i++) {
    filenames[i] = files[i].name;
  }
};
