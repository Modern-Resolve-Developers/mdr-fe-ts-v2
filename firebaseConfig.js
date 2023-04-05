import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
// Initialize Firebase
const app = initializeApp ({
    apiKey: "AIzaSyDUhjr5KMMxFs_RZ_jeRi2esgf-vQ9KJiw",
    authDomain: "mdrv2-5ffb6.firebaseapp.com",
    projectId: "mdrv2-5ffb6",
    storageBucket: "mdrv2-5ffb6.appspot.com",
    messagingSenderId: "637902267798",
    appId: "1:637902267798:web:ab088b23749e16b0e429b7"
});
 
// Firebase storage reference
const storage = getStorage(app);
export default storage;