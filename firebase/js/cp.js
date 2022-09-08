
// Import the functions you need from the SDKs you need
import {
	initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
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
// import firestore db
import {
	getFirestore,
	doc,
	getDoc,
	getDocs,
	setDoc,
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	deleteField,
	onSnapshot
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js"
//db
const db = getFirestore();
// import firebase storage
import {
	getStorage,
	ref as sRef,
	uploadBytesResumable,
	getDownloadURL,
	deleteObject,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

//
import { getAuth,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
const auth = getAuth(app);

onAuthStateChanged(auth,(user) => {
	if(user) {
		console.log("welcome")
	 } else {
		window.location.href = "auth.html";
	 }
}) 

const signOutButton = document.getElementById("sign-out-button");
signOutButton.addEventListener("click",function(e){
	e.preventDefault()
auth.signOut().then(function() {
		console.log('Signed Out');
	  }, function(error) {
		console.error('Sign Out Error', error);
	  });
})
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

//
input.onchange = e => {
	if (input.value !== "") {
		files = e.target.files;
		var extension = GetFileExt(files[0]);
		var name = getFileName(files[0]);

		imgNameInput.value = name;
		extLab.innerHTML = extension;

		reader.readAsDataURL(files[0]);
	}
}
reader.onload = function() {
	myImg.src = reader.result;
}

imgSelButton.onclick = function(e) {
	e.preventDefault();
	input.click();
}
// get image extension
function GetFileExt(file) {
	var temp = file.name.split('.');
	var ext = temp.slice((temp.length - 1), (temp.length));
	return "." + ext[0];
}
// Get Image Name
function getFileName(file) {
	var temp = file.name.split('.');
	var fname = temp.slice(0, -1).join(".");
	return fname;
}
//----------------- Add documents by custom ID
async function AddDocument_CustomID(url) {
	var name = imgNameInput.value;
	var ext = extLab.innerHTML;

	var ref = doc(db, "meals/" + mealId.value);
	await setDoc(ref, {
			MealId: mealId.value,
			MealName: mealName.value,
			MealDesc: mealDesc.value,
			MealPrice: mealPrice.value,
			MealCateg: mealCateg.value,
			MealImageName: (name + ext),
			MealImageURL: url
		}).then(() => {
			alert("data has been added Succesfuly");
		})
		.catch((error) => {
			alert("Unsuccesfuly data has not been added:" + error);
		});
	emptyInputs();
	files = "";
}
// upload Image to storage proccess
async function UploadProcess() {
	if (files.length > 0) {
		var ref = doc(db, "meals/" + mealId.value);
		const docSnap = await getDoc(ref);
		if (!docSnap.exists()) {
			var imgToUpload = files[0];

			var ImageName = imgNameInput.value + extLab.innerHTML;

			const metaData = {
				contentType: imgToUpload.type,
			}
			const storage = getStorage();

			const storageRef = sRef(storage, "menuTopImages/" + ImageName);

			const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
			uploadTask.on('state-change', (snapShot) => {
					var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
					progLab.innerHTML = "upload" + progress + "%";
				},
				(error) => {
					alert("error image not uploaded:" + error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						AddDocument_CustomID(downloadURL);
					})
				}
			)
		}
	}

}
//----------------------------------------------------------Getting meals Documents----------------------------------------------------
var imgNameStash;
async function GetADocument() {
	var ref = doc(db, "meals", mealId.value);
	const docSnap = await getDoc(ref)
		.then((docSnap) => {
			mealName.value = docSnap.data().MealName;
			mealDesc.value = docSnap.data().MealDesc;
			mealPrice.value = docSnap.data().MealPrice;
			mealCateg.value = docSnap.data().MealCateg;
			imgNameInput.value = docSnap.data().MealImageName;
			myImg.src = docSnap.data().MealImageURL;
			imgNameStash = docSnap.data().MealImageName;
		})
		.catch((error) => alert("No Such Document:" + error));
	files = "";
	input.value = "";
}
//---------------------------------------------------------Updating meals Document Data--------------------------------------------------
async function updateFieldsInADocument(url) {
	var name = imgNameStash;
	var extension;
	var ref = doc(db, "meals", mealId.value);

	if (files.length > 0) {
		await deleteMealImageFromStorage();
		name = imgNameInput.value;
		extension = extLab.innerHTML;
		await updateDoc(
				ref, {
					MealId: mealId.value,
					...(mealName.value.length > 0 && {MealName: mealName.value}),
					...(mealDesc.value.length > 0 && {MealDesc: mealDesc.value,}),
					...(mealPrice.value.length > 0 && {MealPrice: mealPrice.value,}),
					...(mealCateg.value.length > 0 && {MealCateg: mealCateg.value,}),
					MealImageName: (name + extension),
					MealImageURL: url
				}

			)
			.then(() => {
				alert("data has been updated Succesfuly");
			})
			.catch((error) => {
				alert("Unsuccesfuly data has not been updated:" + error);
			});
	} else {
		await updateDoc(
				ref, {
					MealId: mealId.value,
					...(mealName.value.length > 0 && {MealName: mealName.value}),
					...(mealDesc.value.length > 0 && {MealDesc: mealDesc.value,}),
					...(mealPrice.value.length > 0 && {MealPrice: mealPrice.value,}),
					...(mealCateg.value.length > 0 && {MealCateg: mealCateg.value,}),
				}

			)
			.then(() => {
				alert("data has been updated Succesfuly");
			})
			.catch((error) => {
				alert("Unsuccesfuly data has not been updated:" + error);
			});
	}
	emptyInputs();
	GetAllDocumentsOnce();
	files = "";
}
// update Image to storage proccess
async function UpdateProcess() {
	var ref = doc(db, "meals", mealId.value);
	const docSnap = await getDoc(ref);
	if (docSnap.exists())
		if (files.length > 0) {

			var imgToUpload = files[0];

			var ImageName = imgNameInput.value + extLab.innerHTML;

			const metaData = {
				contentType: imgToUpload.type,
			}
			const storage = getStorage();

			const storageRef = sRef(storage, "menuTopImages/" + ImageName);

			const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
			uploadTask.on('state-change', (snapShot) => {
					var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
					progLab.innerHTML = "upload" + progress + "%";
				},
				(error) => {
					alert("error image not uploaded:" + error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						updateFieldsInADocument(downloadURL);
					})
				}
			)
		} else {
			updateFieldsInADocument()
		}
}
//-----------------------------------------Deleting Meal Document-------------------------------------------------------------------
async function DeleteDocument(e) {
	await deleteMealImageFromStorage();
	e.preventDefault()
	var ref = doc(db, "meals", mealId.value);
	const docSnap = await getDoc(ref);

	if (!docSnap.exists()) {
		alert("Document does not exist");
		return;
	}

	await deleteDoc(ref)
		.then(() => {
			alert("data has been deleted Succesfuly");
		})
		.catch((error) => {

			alert("Unsuccesfuly data has not been deleted:" + error);
		});

	emptyInputs();
	GetAllDocumentsOnce();
}
async function deleteMealImageFromStorage() {
	var name;
	const storage = getStorage();
	var ref = doc(db, "meals", mealId.value);
	const docSnap = await getDoc(ref)
		.then((docSnap) => {
			name = docSnap.data().MealImageName;
		})
	const desertRef = sRef(storage, "menuTopImages/" + name);

	await deleteObject(desertRef).then(() => {
		// alert("File Deleted Succefully")
	}).catch((error) => {
		alert(error)
	});
}

// --------------------------------------- buttons event -----------------------------------------------------------------------
insBtn.addEventListener("click", (e) => {
	e.preventDefault();
	UploadProcess();
});
selBtn.addEventListener("click", (e) => {
	e.preventDefault()
	GetADocument();
});
updBtn.addEventListener("click", (e) => {
	e.preventDefault();
	UpdateProcess();
});
delBtn.addEventListener("click", DeleteDocument);
// ---------------------------- Table Of Data ---------------------------------------------------------------------------------------
//variable
let tableBody = document.querySelector(".tbody1")
let mealNo = 0;
let categorySelect = document.querySelector(".meals-filter");
let allMeals;
//Add Item To Table
function AddItemToTable(mealId, mealName, mealDesc, mealPrice, mealCateg) {
	// create table elements
	let tableTr = document.createElement("tr");
	tableTr.classList.add("meal");
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
	tableTd4.innerHTML = mealDesc;
	tableTd5.innerHTML = "L.L" + mealPrice;
	tableTd6.innerHTML = mealCateg;
	tableTd6.dataset.filter = mealCateg;
	//append table elements
	tableTr.appendChild(tableTd1);
	tableTr.appendChild(tableTd2);
	tableTr.appendChild(tableTd3);
	tableTr.appendChild(tableTd4);
	tableTr.appendChild(tableTd5);
	tableTr.appendChild(tableTd6);
	//append table body
	tableBody.appendChild(tableTr);
	
	let filterResult = [...categorySelect.querySelectorAll("option")].every(option =>{
		return	option.value !== mealCateg && option.innerHTML !== mealCateg;			
	   })
	   if(filterResult){
		   let newOpt = document.createElement("option");
			   newOpt.value = mealCateg;
			   newOpt.innerHTML = mealCateg;
			   categorySelect.appendChild(newOpt)
	   }
	   allMeals = [...document.querySelectorAll(".meal")];
}
//Add All Items To Table
function AddAllItemsToTable(meals) {
	mealNo = 0
	tableBody.innerHTML = "";
	meals.forEach(meal => {
		AddItemToTable(meal.MealId, meal.MealName, meal.MealDesc, meal.MealPrice, meal.MealCateg)
	})
}


//filter meals
categorySelect.addEventListener("change",filterMeals);

function filterMeals(){
	if(categorySelect.value.toLowerCase() == "all"){
		allMeals.forEach(meal=>{
			meal.style.display = "table-row";
			categorySelect.style.textAlign = "start";
		})
	}else{
		allMeals.forEach(meal=>{
			categorySelect.style.textAlign = "center";
			meal.querySelector("[data-filter]").getAttribute('data-filter').toLowerCase() == categorySelect.value.toLowerCase()
			?meal.style.display = "table-row"
			:meal.style.display = "none"
		})
	}
	
}

//Get DocumentOnce
async function GetAllDocumentsOnce() {
	const querySnapShot = await getDocs(collection(db, "meals"))

	var meals = [];

	querySnapShot.forEach(doc => {
		meals.push(doc.data())
	})

	AddAllItemsToTable(meals)
}

//Get All Documents Real Time
async function GetAllDocumentsRealTime() {
	const dbRef = collection(db, "meals");

	onSnapshot(dbRef, (querySnapShot) => {
		var meals = [];

		querySnapShot.forEach(doc => {
			meals.push(doc.data());
		});
		AddAllItemsToTable(meals)
	})
}

//Empty Inputs After submit
function emptyInputs() {
	mealId.value = "";
	mealName.value = "";
	mealDesc.value = "";
	mealPrice.value = "";
	mealCateg.value = "";
	imgNameInput.value = "";
	myImg.src = "";
	extLab.innerHTML = "";
	progLab.innerHTML = "";
}

//------------------------------------------------- offers images----------------------------------------------
// variables
//buttons
let offersinsBtn = document.getElementById("offers-Insbtn");
let offersselBtn = document.getElementById("offers-Selbtn");
let offersupdBtn = document.getElementById("offers-Updbtn");
let offersdelBtn = document.getElementById("offers-Delbtn");
//inputs and elements
var offersImgsfiles = [];
var offersImgId = document.getElementById("offers-id");
var offersImgsreader = new FileReader();
let offersImgSelButton = document.getElementById("select-offers-img");
var offersImgNameInput = document.getElementById("offers-img-name-input");
var offersImgextLab = document.getElementById("offers-extlab");
var offersImg = document.getElementById("offers-img");
var offersImgprogLab = document.getElementById("offers-upprogress");
var offersImgInput = document.createElement("input");
offersImgInput.type = 'file';

offersImgInput.onchange = e => {
	if (offersImgInput.value !== "") {
		offersImgsfiles = e.target.files;
		var extension = GetoffersFileExt(offersImgsfiles[0]);
		var name = getoffersFileName(offersImgsfiles[0]);

		offersImgNameInput.value = name;
		offersImgextLab.innerHTML = extension;

		offersImgsreader.readAsDataURL(offersImgsfiles[0]);
	}

}

offersImgsreader.onload = function() {
	offersImg.src = offersImgsreader.result;
}

offersImgSelButton.onclick = function(e) {
	e.preventDefault();
	offersImgInput.click();
}
//get image extension
function GetoffersFileExt(file) {
	var temp = file.name.split('.');
	var ext = temp.slice((temp.length - 1), (temp.length));
	return "." + ext[0];
}
// get image Name
function getoffersFileName(file) {
	var temp = file.name.split('.');
	var fname = temp.slice(0, -1).join(".");
	return fname;
}
// Save Image  To Firestore
async function saveoffersImgURLToFireStore(url) {
	var name = offersImgInput.files[0].name;
	// var ext = offersImgextLab.innerHTML;

	var ref = doc(db, "offersImages/" + offersImgId.value);

	await setDoc(ref, {
			offerImgId: offersImgId.value,
			offerImgName: name,
			offerImgURL: url,

		}).then(() => {
			alert("data has been added Succesfuly");
		})
		.catch((error) => {
			alert("Unsuccesfuly data has not been added" + error);
		});
	emptyoffersInputs()
	offersImgsfiles = "";
}
//-----------------------image upload proccess
async function offersUploadProcess() {
	if (offersImgsfiles.length > 0) {
		var ref = doc(db, "offersImages/" + offersImgId.value);
		const docSnap = await getDoc(ref);
		if (!docSnap.exists()) {
			var imgToUpload = offersImgsfiles[0];
			var ImageName = offersImgNameInput.value + offersImgextLab.innerHTML;

			const metaData = {
				contentType: imgToUpload.type,
			}
			const storage = getStorage();

			const storageRef = sRef(storage, "offersImages/" + ImageName);

			const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
			uploadTask.on('state-change', (snapShot) => {
					var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
					offersImgprogLab.innerHTML = "upload" + progress + "%";
				},
				(error) => {
					alert("error image not uploaded");
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						saveoffersImgURLToFireStore(downloadURL)
					})
				}
			)
		}
	}

}
//get image from firestore
var offersImgStash;
async function getoffersImageFromFirestore() {

	var ref = doc(db, "offersImages/" + offersImgId.value);

	const docSnap = await getDoc(ref)
		.then((docSnap) => {
			offersImgNameInput.value = docSnap.data().offerImgName;
			offersImg.src = docSnap.data().offerImgURL;
			offersImgStash = docSnap.data().offerImgName;
		})
		.catch(error => alert("No Such Document:" + error));
	offersImgInput.value = "";
}
//update offers Image
async function updateoffersImage(url) {

	var name = offersImgInput.files[0].name;
	var ref = doc(db, "offersImages", offersImgId.value);
	await updateDoc(
			ref, {
				offerImgId: offersImgId.value,
				offerImgName: name,
				offerImgURL: url,
			}
		)
		.then(() => {
			alert("data has been updated Succesfuly");
		})
		.catch((error) => {

			alert("Unsuccesfuly data has not been updated:" + error);
		});
	emptyInputs();
	offersImgsfiles = "";
}
// update Image to storage procces
async function UpdateoffersImgProcess() {
	var ref = doc(db, "offersImages", offersImgId.value);
	const docSnap = await getDoc(ref);
	if (docSnap.exists()) {
		if (offersImgsfiles.length > 0) {
			await deleteofferImageFromStorage();
			var imgToUpload = offersImgsfiles[0];

			var ImageName = offersImgInput.files[0].name;

			const metaData = {
				contentType: imgToUpload.type,
			}
			const storage = getStorage();

			const storageRef = sRef(storage, "offersImages/" + ImageName);

			const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
			uploadTask.on('state-change', (snapShot) => {
					var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
					offersImgprogLab.innerHTML = "upload" + progress + "%";
				},
				(error) => {
					alert("error image not uploaded:" + error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						updateoffersImage(downloadURL);
					})
				}
			)
		}
	}

}
//delete image from fireBase and storage
async function DeleteoffersDocument() {
	var ref = doc(db, "offersImages", offersImgId.value);
	const docSnap = await getDoc(ref)
	if (!docSnap.exists()) {
		alert("Document does not exist");
		return;
	} else {
		await deleteofferImageFromStorage();
		await deleteDoc(ref)
			.then(() => {
				alert("data has been deleted Succesfuly");
			})
			.catch((error) => {

				alert("Unsuccesfuly data has not been deleted:" + error);
			});
		emptyoffersInputs()
	}


}
//delete offersImage from storage
async function deleteofferImageFromStorage() {
	var name;
	var ref = doc(db, "offersImages", offersImgId.value);
	const docSnap = await getDoc(ref)
		.then((docSnap) => {
			name = docSnap.data().offerImgName;
		})
	const storage = getStorage();
	const desertRef = sRef(storage, "offersImages/" + name);

	await deleteObject(desertRef).then(() => {
		// alert("File Deleted Succefully")
	}).catch((error) => {
		alert(error)
	});
}

// ------------------------------------------------ Add offers data to table-------------------------------------------------
// ---------------------------- Table Of Data ---------------------------------------------------------------------------------------
//variable
let offerstableBody = document.querySelector(".offers-tbody1")
let offersImgNo = 0;

//Add Item To Table
function AddoffersItemToTable(offersId, offersName, offersImg) {
	// create table elements
	let tableTr = document.createElement("tr");
	let tableTd1 = document.createElement("td");
	let tableTd2 = document.createElement("td");
	let tableTd3 = document.createElement("td");
	let tableTd4 = document.createElement("td");
	let tableTd4Img = document.createElement("img");
	//fill table elements with image data
	tableTd1.innerHTML = ++offersImgNo;
	tableTd2.innerHTML = offersId;
	tableTd3.innerHTML = offersName;
	tableTd4Img.src = offersImg;
	//append table elements
	tableTr.appendChild(tableTd1);
	tableTr.appendChild(tableTd2);
	tableTr.appendChild(tableTd3);
	tableTr.appendChild(tableTd4);

	tableTd4.appendChild(tableTd4Img)
	//append table body
	offerstableBody.appendChild(tableTr);
}
//Add All Items To Table
function AddAlloffersItemsToTable(offers) {
	offersImgNo = 0
	offerstableBody.innerHTML = "";
	offers.forEach(offer => {
		AddoffersItemToTable(offer.offerImgId, offer.offerImgName, offer.offerImgURL);
	})
}
//Get DocumentOnce
// async function GetAlloffersDocumentsOnce(){
//     const querySnapShot = await getDocs(collection(db,"offersImages"))

//     var offers = [];

//     querySnapShot.forEach(doc=>{
//         offers.push(doc.data())
//     })

//     AddAlloffersItemsToTable(meals)
//    }

//Get All Documents Real Time
async function GetAlloffersDocumentsRealTime() {
	const dbRef = collection(db, "offersImages");

	onSnapshot(dbRef, (querySnapShot) => {
		var offers = [];

		querySnapShot.forEach(doc => {
			offers.push(doc.data());
		});
		AddAlloffersItemsToTable(offers)
	})
}


//Empty Inputs After Submit
function emptyoffersInputs() {
	offersImgNameInput.value = "";
	offersImg.src = "";
	offersImgextLab.innerHTML = "";
	offersImgprogLab.innerHTML = "";
}
//Buttons Events
offersinsBtn.onclick = function(e) {
	e.preventDefault();
	offersUploadProcess();
}
offersselBtn.onclick = function(e) {
	e.preventDefault();
	getoffersImageFromFirestore();
}
offersdelBtn.onclick = (e) => {
	e.preventDefault()
	DeleteoffersDocument();
};
offersupdBtn.onclick = (e) => {
	e.preventDefault()
	UpdateoffersImgProcess();
}


//----------------------------------------------------------end offers------------------------------------------=]
//------------------------------------------------- tournaments images----------------------------------------------
// variables
//buttons
let TourinsBtn = document.getElementById("tour-Insbtn");
let TourselBtn = document.getElementById("tour-Selbtn");
let TourupdBtn = document.getElementById("tour-Updbtn");
let TourdelBtn = document.getElementById("tour-Delbtn");
//inputs and elements
var TourImgsfiles = [];
var tourImgId = document.getElementById("tour-id");
var TourImgsreader = new FileReader();
let TourImgSelButton = document.getElementById("select-tour-img");
var TourImgNameInput = document.getElementById("tour-img-name-input");
var TourImgextLab = document.getElementById("tour-extlab");
var TourImg = document.getElementById("tour-img");
var TourImgprogLab = document.getElementById("tour-upprogress");
var TourImgInput = document.createElement("input");
TourImgInput.type = 'file';

TourImgInput.onchange = e => {
	if (TourImgInput.value !== "") {
		TourImgsfiles = e.target.files;
		var extension = GetTourFileExt(TourImgsfiles[0]);
		var name = getTourFileName(TourImgsfiles[0]);

		TourImgNameInput.value = name;
		TourImgextLab.innerHTML = extension;

		TourImgsreader.readAsDataURL(TourImgsfiles[0]);
	}

}

TourImgsreader.onload = function() {
	TourImg.src = TourImgsreader.result;
}

TourImgSelButton.onclick = function(e) {
	e.preventDefault();
	TourImgInput.click();
}
//get image extension
function GetTourFileExt(file) {
	var temp = file.name.split('.');
	var ext = temp.slice((temp.length - 1), (temp.length));
	return "." + ext[0];
}
// get image Name
function getTourFileName(file) {
	var temp = file.name.split('.');
	var fname = temp.slice(0, -1).join(".");
	return fname;
}
// Save Image  To Firestore
async function saveTourImgURLToFireStore(url) {
	var name = TourImgInput.files[0].name;
	// var ext = TourImgextLab.innerHTML;

	var ref = doc(db, "TournamentsImages/" + tourImgId.value);

	await setDoc(ref, {
			TournamentImgId: tourImgId.value,
			TournamentImgName: name,
			TournamentImgURL: url,

		}).then(() => {
			alert("data has been added Succesfuly");
		})
		.catch((error) => {
			alert("Unsuccesfuly data has not been added" + error);
		});
	emptyTourInputs()
	TourImgsfiles = "";

}
//-----------------------image upload proccess
async function TourUploadProcess() {
	if (TourImgsfiles.length > 0) {
		var ref = doc(db, "TournamentsImages/" + tourImgId.value);
		const docSnap = await getDoc(ref);
		if (!docSnap.exists()) {
			var imgToUpload = TourImgsfiles[0];
			var ImageName = TourImgNameInput.value + TourImgextLab.innerHTML;

			const metaData = {
				contentType: imgToUpload.type,
			}
			const storage = getStorage();

			const storageRef = sRef(storage, "TournamentsImages/" + ImageName);

			const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
			uploadTask.on('state-change', (snapShot) => {
					var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
					TourImgprogLab.innerHTML = "upload" + progress + "%";
				},
				(error) => {
					alert("error image not uploaded");
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						saveTourImgURLToFireStore(downloadURL)
					})
				}
			)
		}
	}

}
//get image from firestore
var tourImgStash;
async function getTourImageFromFirestore() {

	var ref = doc(db, "TournamentsImages/" + tourImgId.value);

	const docSnap = await getDoc(ref)
		.then((docSnap) => {
			TourImgNameInput.value = docSnap.data().TournamentImgName;
			TourImg.src = docSnap.data().TournamentImgURL;
			tourImgStash = docSnap.data().TournamentImgName;
		})
		.catch(error => alert("No Such Document:" + error));
	TourImgInput.value = "";
}
//update tournaments Image
async function updateTourImage(url) {

	var name = TourImgInput.files[0].name;
	var ref = doc(db, "TournamentsImages", tourImgId.value);
	await updateDoc(
			ref, {
				TournamentImgId: tourImgId.value,
				TournamentImgName: name,
				TournamentImgURL: url,
			}
		)
		.then(() => {
			alert("data has been updated Succesfuly");
		})
		.catch((error) => {

			alert("Unsuccesfuly data has not been updated:" + error);
		});
	emptyInputs();
	TourImgsfiles = "";
}
// update Image to storage procces
async function UpdateTourImgProcess() {
	var ref = doc(db, "TournamentsImages", tourImgId.value);
	const docSnap = await getDoc(ref);
	if (docSnap.exists()) {
		if (TourImgsfiles.length > 0) {
			await deleteTournamentImageFromStorage();
			var imgToUpload = TourImgsfiles[0];

			var ImageName = TourImgInput.files[0].name;

			const metaData = {
				contentType: imgToUpload.type,
			}
			const storage = getStorage();

			const storageRef = sRef(storage, "TournamentsImages/" + ImageName);

			const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
			uploadTask.on('state-change', (snapShot) => {
					var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
					TourImgprogLab.innerHTML = "upload" + progress + "%";
				},
				(error) => {
					alert("error image not uploaded:" + error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						updateTourImage(downloadURL);
					})
				}
			)
		}
	}

}
//delete image from fireBase and storage
async function DeleteTourDocument() {
	var ref = doc(db, "TournamentsImages", tourImgId.value);
	const docSnap = await getDoc(ref)
	if (!docSnap.exists()) {
		alert("Document does not exist");
		return;
	} else {
		await deleteTournamentImageFromStorage();
		await deleteDoc(ref)
			.then(() => {
				alert("data has been deleted Succesfuly");
			})
			.catch((error) => {

				alert("Unsuccesfuly data has not been deleted:" + error);
			});
		emptyTourInputs()
	}


}
//delete tourImage from storage
async function deleteTournamentImageFromStorage() {
	var name;
	var ref = doc(db, "TournamentsImages", tourImgId.value);
	const docSnap = await getDoc(ref)
		.then((docSnap) => {
			name = docSnap.data().TournamentImgName;
		})
	const storage = getStorage();
	const desertRef = sRef(storage, "TournamentsImages/" + name);


	await deleteObject(desertRef).then(() => {
		// alert("File Deleted Succefully")
	}).catch((error) => {
		alert(error)
	});
}

// ------------------------------------------------ Add tournaments data to table-------------------------------------------------
// ---------------------------- Table Of Data ---------------------------------------------------------------------------------------
//variable
let TourtableBody = document.querySelector(".tour-tbody1")
let TourImgNo = 0;

//Add Item To Table
function AddTourItemToTable(TourId, TourName, TourImg) {
	// create table elements
	let tableTr = document.createElement("tr");
	let tableTd1 = document.createElement("td");
	let tableTd2 = document.createElement("td");
	let tableTd3 = document.createElement("td");
	let tableTd4 = document.createElement("td");
	let tableTd4Img = document.createElement("img");
	//fill table elements with image data
	tableTd1.innerHTML = ++TourImgNo;
	tableTd2.innerHTML = TourId;
	tableTd3.innerHTML = TourName;
	tableTd4Img.src = TourImg;
	//append table elements
	tableTr.appendChild(tableTd1);
	tableTr.appendChild(tableTd2);
	tableTr.appendChild(tableTd3);
	tableTr.appendChild(tableTd4);

	tableTd4.appendChild(tableTd4Img)
	//append table body
	TourtableBody.appendChild(tableTr);
}
//Add All Items To Table
function AddAllTourItemsToTable(tournaments) {
	TourImgNo = 0
	TourtableBody.innerHTML = "";
	tournaments.forEach(tour => {
		AddTourItemToTable(tour.TournamentImgId, tour.TournamentImgName, tour.TournamentImgURL)
	})
}

//Get DocumentOnce
// async function GetAllTourDocumentsOnce(){
//     const querySnapShot = await getDocs(collection(db,"TournamentsImages"))

//     var tournaments = [];

//     querySnapShot.forEach(doc=>{
//         tournaments.push(doc.data())
//     })

//     AddAllTourItemsToTable(meals)
//    }

//Get All Documents Real Time
async function GetAllTourDocumentsRealTime() {
	const dbRef = collection(db, "TournamentsImages");

	onSnapshot(dbRef, (querySnapShot) => {
		var tournaments = [];

		querySnapShot.forEach(doc => {
			tournaments.push(doc.data());
		});
		AddAllTourItemsToTable(tournaments)
	})
}
window.onload = () => {
	GetAllDocumentsRealTime();
	GetAlloffersDocumentsRealTime();
	GetAllTourDocumentsRealTime();
};

//Empty Inputs After Submit
function emptyTourInputs() {
	TourImgNameInput.value = "";
	TourImg.src = "";
	TourImgextLab.innerHTML = "";
	TourImgprogLab.innerHTML = "";
}
//Buttons Events
TourinsBtn.onclick = function(e) {
	e.preventDefault();
	TourUploadProcess();
}
TourselBtn.onclick = function(e) {
	e.preventDefault();
	getTourImageFromFirestore();
}
TourdelBtn.onclick = (e) => {
	e.preventDefault()
	DeleteTourDocument();
};
TourupdBtn.onclick = (e) => {
	e.preventDefault()
	UpdateTourImgProcess();
}
//