 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyDc86l5nGQW5BgRZ87g0HiskLQFpojkF80",
   authDomain: "kann-yama-kann-firestore.firebaseapp.com",
   projectId: "kann-yama-kann-firestore",
   storageBucket: "kann-yama-kann-firestore.appspot.com",
   messagingSenderId: "138428441492",
   appId: "1:138428441492:web:03accd6edfc2e4b2b16581"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 

 import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField,onSnapshot} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js"

 const db = getFirestore();

 // -----------------------------------------------REFFERENCES-------------------------------------------
 
 let mealId = document.getElementById("meal-id");
 let mealName = document.getElementById("meal-name");
 let mealDesc = document.getElementById("meal-desc");
 let mealPrice = document.getElementById("meal-price");
 let mealCateg = document.getElementById("meal-categ");



 let insBtn = document.getElementById("Insbtn");
 let selBtn = document.getElementById("Selbtn");
 let updBtn = document.getElementById("Updbtn");
 let delBtn = document.getElementById("Delbtn");


 // -------------------------------------------- ADD Documents ------------------------------------------

 async function AddDocument_AutoID(e){
     e.preventDefault()
     var ref = collection(db, "meals");

     const docRef = await addDoc(
         ref, {
             MealName : mealName.value,
             MealDesc : mealDesc.value,
             MealPrice : mealPrice.value,
             mealCateg : mealCateg.value,
         }
     )
     .then(()=>{
         alert("data has been added Succesfuly");
     })
     .catch((error)=>{

      alert("Unsuccesfuly data has not been added:"+ error);
     });
     mealId.value = "";
         mealName.value = "";
         mealDesc.value = "";
         mealPrice.value = "";
         mealCateg.value = "";
     GetAllDocumentsOnce();
 }

 async function AddDocument_CustomID(e){
     e.preventDefault()
     var ref = doc(db, "meals",mealId.value);

      await setDoc(
         ref, {
             MealId : mealId.value,
             MealName : mealName.value,
             MealDesc : mealDesc.value,
             MealPrice : mealPrice.value,
             MealCateg : mealCateg.value,
         }
     )
     .then(()=>{
         alert("data has been added Succesfuly");
     })
     .catch((error)=>{

      alert("Unsuccesfuly data has not been added");
     });
         mealId.value = "";
         mealName.value = "";
         mealDesc.value = "";
         mealPrice.value = "";
         mealCateg.value = "";
     GetAllDocumentsOnce();
 }


 //----------------------------------------------------------Getting Documents----------------------------------------------------


 async function GetADocument(e){
     e.preventDefault();
     var ref = doc(db, "meals",mealId.value);
     const docSnap = await getDoc(ref)
     .then((docSnap)=>{
         
         mealName.value = docSnap.data().MealName;
         mealDesc.value = docSnap.data().MealDesc;
         mealPrice.value = docSnap.data().MealPrice;
         mealCateg.value = docSnap.data().MealCateg;
     }).catch(()=> alert("No Such Document"));
 }



 //---------------------------------------------------------Updating Document Data--------------------------------------------------

 async  function updateFieldsInADocument(e){
     e.preventDefault();

     var ref = doc(db, "meals",mealId.value);

     await updateDoc(
         ref, {
             MealId : mealId.value,
             MealName : mealName.value,
             MealDesc : mealDesc.value,
             MealPrice : mealPrice.value,
             MealCateg : mealCateg.value,
         }
     )
     .then(()=>{
         alert("data has been updated Succesfuly");
     })
     .catch((error)=>{

     alert("Unsuccesfuly data has not been updated:" + error);
     });
         mealId.value = "";
         mealName.value = "";
         mealDesc.value = "";
         mealPrice.value = "";
         mealCateg.value = "";
     GetAllDocumentsOnce();
             }

 //-----------------------------------------Deleting Document-------------------------------------------------------------------


 async function DeleteDocument(e){
     e.preventDefault()
     var ref = doc(db, "meals",mealId.value);
     const docSnap = await getDoc(ref);

     if(!docSnap.exists()){
         alert("Document does not exist");
         return;
     }

     await deleteDoc(ref)
     .then(()=>{
         alert("data has been deleted Succesfuly");
     })
     .catch((error)=>{

     alert("Unsuccesfuly data has not been deleted:" + error);
     });
         mealId.value = "";
         mealName.value = "";
         mealDesc.value = "";
         mealPrice.value = "";
         mealCateg.value = "";
     GetAllDocumentsOnce();
 }


 // --------------------------------------- buttons event -----------------------------------------------------------------------

 insBtn.addEventListener("click",AddDocument_CustomID);
 selBtn.addEventListener("click",GetADocument);
 updBtn.addEventListener("click",updateFieldsInADocument);
 delBtn.addEventListener("click",DeleteDocument)


 //----------------------------------------Table oF Data-----------------------------------

 let tableBody = document.querySelector(".tbody1")
 let mealNo = 0;

  function AddItemToTable(mealId,mealName,mealDesc,mealPrice,mealCateg){

     let tableTr = document.createElement("tr");
     let tableTd1 = document.createElement("td");
     let tableTd2 = document.createElement("td");
     let tableTd3 = document.createElement("td");
     let tableTd4 = document.createElement("td");
     let tableTd5 = document.createElement("td");
     let tableTd6 = document.createElement("td");

     tableTd1.innerHTML = ++mealNo;
     tableTd2.innerHTML = mealId;
     tableTd3.innerHTML = mealName;
     tableTd4.innerHTML = mealDesc ;
     tableTd5.innerHTML = mealPrice;
     tableTd6.innerHTML = mealCateg;


     tableTr.appendChild(tableTd1);
     tableTr.appendChild(tableTd2);
     tableTr.appendChild(tableTd3);
     tableTr.appendChild(tableTd4);
     tableTr.appendChild(tableTd5);
     tableTr.appendChild(tableTd6);

     tableBody.appendChild(tableTr);
 }


 function AddAllItemsToTable(meals){
     mealNo = 0
         tableBody.innerHTML ="";
         meals.forEach(meal =>{
             AddItemToTable(meal.MealId,meal.MealName,meal.MealDesc,meal.MealPrice,meal.MealCateg)
         })
     }


async function GetAllDocumentsOnce(){
 const querySnapShot = await getDocs(collection(db,"meals"))

 var meals = [];

 querySnapShot.forEach(doc=>{
     meals.push(doc.data())
 })

 AddAllItemsToTable(meals)
}

async function GetAllDocumentsRealTime(){
 const dbRef = collection(db,"meals");

 onSnapshot(dbRef,(querySnapShot)=>{
    var meals = [];

     querySnapShot.forEach(doc => {
         meals.push(doc.data());
     });
     AddAllItemsToTable(meals)
 })
}

window.onload = GetAllDocumentsRealTime;