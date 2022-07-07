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

// import firebase storage
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject  } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";


 // -----------------------------------------------REFFERENCES-------------------------------------------
 //inputs
 let mealId = document.getElementById("meal-id");
 let mealName = document.getElementById("meal-name");
 let mealDesc = document.getElementById("meal-desc");
 let mealPrice = document.getElementById("meal-price");
 let mealCateg = document.getElementById("meal-categ");
//buttons
 let insBtn = document.getElementById("Insbtn");
 let selBtn = document.getElementById("Selbtn");
 let updBtn = document.getElementById("Updbtn");
 let delBtn = document.getElementById("Delbtn");
 //image inser variables
 var files = [];
 var reader = new FileReader();
 let imgSelButton = document.getElementById("select-img");
 var imgNameInput = document.getElementById("img-name-input");
 var extLab = document.getElementById("extlab");
 var myImg = document.getElementById("myimg");
 var progLab = document.getElementById("upprogress");
 var input = document.createElement("input");
input.type = "file";
 

 // -------------------------------------------- ADD meals Documents ------------------------------------------
//  async function AddDocument_AutoID(e){
//     e.preventDefault()
//     var ref = collection(db, "meals");

//     const docRef = await addDoc(
//         ref, {
//             MealName : mealName.value,
//             MealDesc : mealDesc.value,
//             MealPrice : mealPrice.value,
//             mealCateg : mealCateg.value,
//         }
//     )
//     .then(()=>{
//         alert("data has been added Succesfuly");
//     })
//     .catch((error)=>{

//      alert("Unsuccesfuly data has not been added:"+ error);
//     });
//     emptyInputs()

//     GetAllDocumentsOnce();
// }

//----------------- Add documents by custom ID
async function AddDocument_CustomID(url){
    var name = imgNameInput.value;
    var ext = extLab.innerHTML;

    var ref = doc(db,"meals/"+mealId.value);
    await setDoc(ref,{
        MealId : mealId.value,
        MealName : mealName.value,
        MealDesc : mealDesc.value,
        MealPrice : mealPrice.value,
        MealCateg : mealCateg.value,
        MealImageName: (name+ext),
        MealImageURL: url
    }).then(()=>{
        alert("data has been added Succesfuly");
    })
    .catch((error)=>{
     alert("Unsuccesfuly data has not been added:"+error);
    });
    emptyInputs();
}
//
input.onchange = e =>{
    files = e.target.files;
     var extension = GetFileExt(files[0]);
     var name = getFileName(files[0]);
 
     imgNameInput.value = name;
     extLab.innerHTML = extension;
 
     reader.readAsDataURL(files[0]);
 }
 reader.onload = function(){
    myImg.src = reader.result;
}

imgSelButton.onclick = function(e){
    e.preventDefault();
    input.click();
}
// get image extension
function GetFileExt(file){
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length-1),(temp.length));
    return "."+ ext[0];
}
// Get Image Name
function getFileName(file){
    var temp = file.name.split('.');
    var fname = temp.slice(0,-1).join(".");
    return fname;
}
// upload Image to storage proccess
async function UploadProcess(){
    var imgToUpload = files[0];

    var ImageName = imgNameInput.value + extLab.innerHTML;

    const metaData ={
        contentType:imgToUpload.type,
    }
    const storage = getStorage();

    const storageRef = sRef(storage, "menuTopImages/"+ImageName);

    const uploadTask = uploadBytesResumable(storageRef,imgToUpload,metaData);
    uploadTask.on('state-change',(snapShot)=>{
        var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        progLab.innerHTML = "upload" + progress + "%";
    },
    (error) =>{
        alert("error image not uploaded:"+error);
    },
    ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            AddDocument_CustomID(downloadURL);
        })
    }
    )
}

//----------------------------------------------------------Getting meals Documents----------------------------------------------------
var imgNameStash;
async function GetADocument(){
    var ref = doc(db, "meals",mealId.value);
    const docSnap = await getDoc(ref)
    .then((docSnap)=>{
        mealName.value = docSnap.data().MealName;
        mealDesc.value = docSnap.data().MealDesc;
        mealPrice.value = docSnap.data().MealPrice;
        mealCateg.value = docSnap.data().MealCateg;
        imgNameInput.value = docSnap.data().MealImageName;
        myImg.src = docSnap.data().MealImageURL;
        imgNameStash = docSnap.data().MealImageName;
    })
    .catch((error)=> alert("No Such Document:"+error));
}
 //---------------------------------------------------------Updating meals Document Data--------------------------------------------------
 async  function updateFieldsInADocument(url){
    var name = imgNameInput.value;
    var ext = extLab.innerHTML;

    var ref = doc(db, "meals",mealId.value);

    if(files.length > 0){
        await updateDoc(
            ref, {
                MealId : mealId.value,
                MealName : mealName.value,
                MealDesc : mealDesc.value,
                MealPrice : mealPrice.value,
                MealCateg : mealCateg.value,
                MealImageName: (name+ext),
                MealImageURL: url
            }
            
        )
     
        .then(()=>{
            alert("data has been updated Succesfuly");
        })
        .catch((error)=>{
    
        alert("Unsuccesfuly data has not been updated:" + error);
        });
        deleteMalImageFromStorage();
    }else{
        await updateDoc(
            ref, {
                MealId : mealId.value,
                MealName : mealName.value,
                MealDesc : mealDesc.value,
                MealPrice : mealPrice.value,
                MealCateg : mealCateg.value,
                MealImageName: (name+ext),
            }
            
        )
     
        .then(()=>{
            alert("data has been updated Succesfuly");
        })
        .catch((error)=>{
    
        alert("Unsuccesfuly data has not been updated:" + error);
        });
    }
    emptyInputs()
    GetAllDocumentsOnce();
}
// update Image to storage proccess
async function UpdateProcess(){
    if(files.length > 0){
    var imgToUpload = files[0];

    var ImageName = imgNameInput.value + extLab.innerHTML;

    const metaData ={
        contentType:imgToUpload.type,
    }
    const storage = getStorage();

    const storageRef = sRef(storage, "menuTopImages/"+ImageName);

    const uploadTask = uploadBytesResumable(storageRef,imgToUpload,metaData);
    uploadTask.on('state-change',(snapShot)=>{
        var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        progLab.innerHTML = "upload" + progress + "%";
    },
    (error) =>{
        alert("error image not uploaded:"+error);
    },
    ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            updateFieldsInADocument(downloadURL);
        })
    }
    )
}else{
    updateFieldsInADocument()
}
}
 //-----------------------------------------Deleting Meal Document-------------------------------------------------------------------
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
    emptyInputs()
    deleteMalImageFromStorage()
    GetAllDocumentsOnce();
}

async function deleteMalImageFromStorage(){
    const storage = getStorage();
    var name = imgNameStash;

    const desertRef = sRef(storage, "menuTopImages/"+name);


    await deleteObject(desertRef).then(() => {
        alert("File Deleted Succefully")
      }).catch((error) => {
        alert(error)
      });
}
 // --------------------------------------- buttons event -----------------------------------------------------------------------
 insBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    UploadProcess();

 });
 selBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    GetADocument();
 });
 updBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    UpdateProcess();
 });
 delBtn.addEventListener("click",DeleteDocument);

 // ---------------------------- Table Of Data ---------------------------------------------------------------------------------------
//variable
let tableBody = document.querySelector(".tbody1")
let mealNo = 0;

//Add Item To Table
function AddItemToTable(mealId,mealName,mealDesc,mealPrice,mealCateg){
    // create table elements
    let tableTr = document.createElement("tr");
    let tableTd1 = document.createElement("td");
    let tableTd2 = document.createElement("td");
    let tableTd3 = document.createElement("td");
    let tableTd4 = document.createElement("td");
    let tableTd5 = document.createElement("td");
    let tableTd6 = document.createElement("td");
    //fill table elements with image data
    tableTd1.innerHTML = ++mealNo;
    tableTd2.innerHTML = mealId;
    tableTd3.innerHTML = mealName;
    tableTd4.innerHTML = mealDesc ;
    tableTd5.innerHTML = "L.L" +mealPrice;
    tableTd6.innerHTML = mealCateg;
    //append table elements
    tableTr.appendChild(tableTd1);
    tableTr.appendChild(tableTd2);
    tableTr.appendChild(tableTd3);
    tableTr.appendChild(tableTd4);
    tableTr.appendChild(tableTd5);
    tableTr.appendChild(tableTd6);
    //append table body
    tableBody.appendChild(tableTr);
}
//Add All Items To Table
function AddAllItemsToTable(meals){
    mealNo = 0
        tableBody.innerHTML ="";
        meals.forEach(meal =>{
            AddItemToTable(meal.MealId,meal.MealName,meal.MealDesc,meal.MealPrice,meal.MealCateg)
        })
    }

    //Get DocumentOnce
    async function GetAllDocumentsOnce(){
        const querySnapShot = await getDocs(collection(db,"meals"))
       
        var meals = [];
       
        querySnapShot.forEach(doc=>{
            meals.push(doc.data())
        })
       
        AddAllItemsToTable(meals)
       }

    //Get All Documents Real Time
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

       //Empty Inputs After submit
       function emptyInputs(){
        mealId.value = "";
            mealName.value = "";
            mealDesc.value = "";
            mealPrice.value = "";
            mealCateg.value = "";
            imgNameInput.value = "";
            myImg.src = "";
    }
    //run function after page load
    window.onload = GetAllDocumentsRealTime;

    //------------------------------------------------- tournaments images firestore----------------------------------------------
    // variables
    //buttons
    let TourinsBtn = document.getElementById("tour-Insbtn");
 let TourselBtn = document.getElementById("tour-Selbtn");
 let TourupdBtn = document.getElementById("tour-Updbtn");
 let TourdelBtn = document.getElementById("tour-Delbtn");
 //inputs and elements
 var TourImgsfiles = [];
 var TourImgsreader = new FileReader();
 let TourImgSelButton = document.getElementById("select-tour-img");
 var TourImgNameInput = document.getElementById("tour-img-name-input");
 var TourImgextLab = document.getElementById("tour-extlab");
 var TourImg = document.getElementById("tour-img");
 var TourImgprogLab = document.getElementById("tour-upprogress");
 var TourImginput = document.createElement("input");
 TourImginput.type = 'file';

 TourImginput.onchange = e =>{
    TourImgsfiles = e.target.files;
     var extension = GetTourFileExt(TourImgsfiles[0]);
     var name = getTourFileName(TourImgsfiles[0]);
 
     TourImgNameInput.value = name;
     TourImgextLab.innerHTML = extension;
 
     TourImgsreader.readAsDataURL(TourImgsfiles[0]);
 }

 TourImgsreader.onload = function(){
    TourImg.src = TourImgsreader.result;
}

TourImgSelButton.onclick = function(e){
    e.preventDefault();
    TourImginput.click();
}
//get image extension
function GetTourFileExt(file){
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length-1),(temp.length));
    return "."+ ext[0];
}
// get image Name
function getTourFileName(file){
    var temp = file.name.split('.');
    var fname = temp.slice(0,-1).join(".");
    return fname;
}

//-----------------------image upload proccess
async function TourUploadProcess(){
    var imgToUpload = TourImgsfiles[0];

    var ImageName = TourImgNameInput.value + TourImgextLab.innerHTML;

    const metaData ={
        contentType:imgToUpload.type,

    }
    const storage = getStorage();

    const storageRef = sRef(storage, "TournamentsImages/"+ImageName);

    const uploadTask = uploadBytesResumable(storageRef,imgToUpload,metaData);
    uploadTask.on('state-change',(snapShot)=>{
        var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        TourImgprogLab.innerHTML = "upload" + progress + "%";
    },
    (error) =>{
        alert("error image not uploaded");
    },
    ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            saveTourURLtoFirestore(downloadURL)
        })
    }
    )
}
// Save Image URL To Firestore
async function saveTourURLtoFirestore(url){
    var name = TourImginput.value;
    var ext = TourImgextLab.innerHTML;

    var ref = collection(db, "TournamentsImages");


    await addDoc(ref,{
        TourImageName : (name+ext),
        TourImageURL: url,

    }).then(()=>{
        alert("data has been added Succesfuly");
    })
    .catch((error)=>{

     alert("Unsuccesfuly data has not been added");
    });
    emptyTourInputs()

}
//get image from firestore
async function getTourImageFromFirestore(){
    var name = TourImginput.value;

    var ref = doc(db,"TournamentsImages/"+name);

    const docSnapshot = await getDoc(ref);
    console.log(docSnapshot)
    if(docSnapshot.exists()){
        TourImg.src = docSnapshot.data().ImageURL;
    }
}
//delete image from storage
async function deleteTournamentImageFromStorage(){
    const storage = getStorage();
    var name = TourImgNameInput.value;

    const desertRef = sRef(storage, "TournamentsImages/"+name);


    await deleteObject(desertRef).then(() => {
        alert("File Deleted Succefully")
      }).catch((error) => {
        alert(error)
      });
}
//Empty Inputs After Submit
function emptyTourInputs(){
    TourImgNameInput.value = "";
    TourImg.src = "";
}
//Buttons Events
TourinsBtn.onclick = function(e){
    e.preventDefault();
    TourUploadProcess();
}
TourselBtn.onclick = function(e){
    e.preventDefault();
    getTourImageFromFirestore();
}
TourdelBtn.onclick = deleteTournamentImageFromStorage;