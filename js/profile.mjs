import { auth, db, storage } from "./firebase.mjs";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getDownloadURL,
  ref,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(collection(db, "users"), where("user", "==", user.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      getDownloadURL(ref(storage, doc.data().email)).then((url) => {
        console.log(url);
        document.querySelector(".profile-container").innerHTML = `
            <img src='${url}}' />
            <h1>${doc.data().first_name} ${doc.data().last_name}</h1>
            <h1>Password</h1>
            <input type="password" placeholder="Old password" />
            <input type="password" placeholder="New password" />
            <input type="password" placeholder="Repeat password" />
            <button>Update Password</button>
        `;
      });
      document.querySelector("#profile").innerHTML = `${
        doc.data().first_name
      }  ${doc.data().last_name}`;
      document.querySelector("#logout").addEventListener("click", () => {
        signOut(auth)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {});
      });
    });
  } else {
    console.log("sad");
  }
});
