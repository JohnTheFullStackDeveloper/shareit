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
  ref as stref,
  uploadBytesResumable,
  uploadBytes,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
const db = getDatabase();
const storage = getStorage();

document.getElementById("check").addEventListener("click", check);
document.getElementById("message-display").style.visibility = "hidden";
let userid = document.getElementById("Id");
let userpass = document.getElementById("Password");
function check() {
  document.getElementById("message-display").innerHTML = "";
  try {
    let uid = userid.value;
    let upass = userpass.value;
    let storageref = stref(storage, uid);
    let bdref = ref(db);
    get(child(bdref, uid)).then((snapshot) => {
      if (snapshot.exists()) {
        if (upass == "") upass = "none";
        if (snapshot.val().pass == "none") upass = "none";
        if (snapshot.val().pass == upass) {
          document.getElementById("msgdis").innerText =
            "Files gatherd From " + uid + " are showed in below";
          document.getElementById("msgdis").style.color = "green";
          document.getElementById("messagefromfiles").innerText = `${
            snapshot.val().msg
          }`;
          listAll(storageref).then((res) => {
            res.items.forEach((file) => {
              getDownloadURL(file).then((url) => {
                document.getElementById("message-display").style.visibility =
                  "visible";
                document.getElementById("mainbody").style.height = "100%";
                let fn = "";
                fn = file.name;
                if (
                  file.name.includes("dotexe") ||
                  file.name.includes("dotapk")
                ) {
                  let fn = "";
                  fn = file.name.replace(/dot/g, ".");
                  document.getElementById("message-display").innerHTML =
                    document.getElementById("message-display").innerHTML +
                    `<div class="filesin"><a id="${fn}" href="${url}" target="_blank"><img src="file.png" width=100% height=200px></a><div class="dow" id="${url}" onclick="download(this)">${fn}<br/><i class="fas fa-arrow-down"></i></div></div>`;
                } else
                  document.getElementById("message-display").innerHTML =
                    document.getElementById("message-display").innerHTML +
                    `<div class="filesin"><a href="${url}" target="_blank"><embed class="embedclass" src="${url}" width="100%" height="200px"></a><div class="dow" id="${url}" onclick="download(this)">${fn}<br/><i class="fas fa-arrow-down"></i></div></div>`;
              });
            });
          });
        } else {
          document.getElementById("msgdis").innerText = "wrong password";
          document.getElementById("msgdis").style.color = "red";
        }
      } else {
        document.getElementById("msgdis").innerText =
          "There is no id with " + uid;
        document.getElementById("msgdis").style.color = "red";
      }
    });
  } catch (e) {
    if (userid.value == "") {
      document.getElementById("msgdis").innerText = "Please enter Id";
      document.getElementById("msgdis").style.color = "red";
    } else {
      document.getElementById("msgdis").innerText = "Something went wrong";
      document.getElementById("msgdis").style.color = "red";
    }
  }
}
