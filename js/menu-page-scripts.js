
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
export {
	collection
}
const db = getFirestore();
//---------------------------------------- get data fromFireBase --------------------------------------
async function GetAllDocumentsRealTime() {
	const dbRef = collection(db, "meals");

	onSnapshot(dbRef, (querySnapShot) => {
		var meals = [];

		querySnapShot.forEach(doc => {
			meals.push(doc.data());

		});
		createMealCard(meals);
	})

}
// --------------------------------------------------- Add Menu meals ------------------------------------------------------------
let menu = document.querySelector("#menu");
let mealContainer = document.getElementById("menu-container");
var allMeals;
let categorySelect = document.querySelector(".meals-filter");
function createMealCard(meals) {
	
	mealContainer.innerHTML = "";
	categorySelect.innerHTML = "";
	meals.forEach(mealCard => {
		//-create meal
		let meal = document.createElement("div");
		meal.className = "meal";


		//-create mealImage
		let mealImageTop = document.createElement("img");
		mealImageTop.className = "meal-img-top";
		mealImageTop.src = mealCard.MealImageURL;
		mealImageTop.alt = "meal-img";
		//-create mealBody
		let mealBody = document.createElement("div");
		mealBody.className = "meal-body";

		//-create meal Title
		let mealName = document.createElement("h5");
		mealName.className = "meal-name";
		mealName.innerHTML = mealCard.MealName;
		//-create meal description
		let mealDesc = document.createElement("p");
		mealDesc.className = "meal-desc";
		mealDesc.innerHTML = mealCard.MealDesc;
		//-create Meal Price
		let mealPriceDiv = document.createElement("div");
		mealPriceDiv.className = "meal-price-div";

		//-create meal price
		let mealPrice = document.createElement("p");
		mealPrice.className = "meal-price";
		let priceSpan = document.createElement("span");
		priceSpan.classList.add("price");
		priceSpan.innerHTML = mealCard.MealPrice;

		mealPrice.appendChild(priceSpan)

		//-create meal price $
		let mealPriceCur = document.createElement("span");
		mealPriceCur.className = "meal-price-currency";
		mealPriceCur.innerHTML = "<span>L.L</span>";

		//-create meal type
		let mealType = document.createElement("p");
		mealType.className = "meal-type";
		mealType.innerHTML = mealCard.MealCateg;

		meal.dataset.filter = mealCard.MealCateg;
		
		let filterResult = [...categorySelect.querySelectorAll("option")].every(option =>{
		 return	option.value !== mealCard.MealCateg && option.innerHTML !== mealCard.MealCateg;			
		})
		if(filterResult){
			let newOpt = document.createElement("option");
				newOpt.value = mealCard.MealCateg;
				newOpt.innerHTML = mealCard.MealCateg;
				categorySelect.appendChild(newOpt)
		}
		mealBody.appendChild(mealName)
		mealBody.appendChild(mealDesc)
		mealBody.appendChild(mealPriceDiv)
		mealBody.appendChild(mealType)

		mealPriceDiv.appendChild(mealPrice)
		mealPrice.prepend(mealPriceCur)

		meal.appendChild(mealImageTop);
		meal.appendChild(mealBody);

		mealContainer.appendChild(meal);
		menu.appendChild(mealContainer);

	})
	allMeals = [...document.querySelectorAll(".meal")];
	let allCateg = document.createElement("option");
	allCateg.innerHTML = `All: ${allMeals.length}`;
	allCateg.value = "All";
	categorySelect.prepend(allCateg);
	allCateg.selected = "selected";
}

//filter meals
categorySelect.addEventListener("change",filterMeals);
categorySelect.addEventListener("select",filterMeals);
function filterMeals(){
	if(categorySelect.value.toLowerCase() == "all"){
		allMeals.forEach(meal=>{
			meal.style.display = "block";
			categorySelect.style.textAlign = "left";
		})
	}else{
		allMeals.forEach(meal=>{
			meal.getAttribute('data-filter').toLowerCase() == categorySelect.value.toLowerCase()
			?meal.style.display = "block"
			:meal.style.display = "none"
			categorySelect.style.textAlign = "center";
		})
	}
	
}


let showMealImgDiv = document.querySelector(".show-meal-img-div");
let mealImgDiv = document.querySelector(".show-meal-img-container .image");
let mealCloneElement;
function showMealImg(e){
	mealCloneElement= e.currentTarget.cloneNode()
	mealImgDiv.appendChild(mealCloneElement);
	showMealImgDiv.classList.add("active");
	document.body.classList.add("overflow-hidden")
	setTimeout(() => {
		showMealImgDiv.style.opacity= 1;
	}, 10);
}
window.addEventListener("load",function(){
	setTimeout(() => {
		allMeals.forEach(img=>img.querySelector("img").addEventListener("click",showMealImg)
		)
	}, 3000);
})


let hideMealImgIcon = document.querySelector("#hide-meal-img");
hideMealImgIcon.addEventListener("click",hideMealImg);
function hideMealImg(){
	showMealImgDiv.classList.remove("active");
	document.body.classList.remove("overflow-hidden");
	showMealImgDiv.style.opacity= 0;
	mealImgDiv.removeChild(mealCloneElement)
}
//--------------------------------------------------------offers----------------------------------------
async function getOffersImageFromFirestoreRealtime() {
	const dbRef = collection(db, "offersImages");

	onSnapshot(dbRef, (querySnapShot) => {
		var offersImages = [];

		querySnapShot.forEach(doc => {
			offersImages.push(doc.data());
		});
		createOffersSwiperSlide(offersImages)

	})
}

let offers = document.getElementById("offers");
let offersSwiperWrapper = document.querySelector(".offers-swiper-wrapper");

var offersImagesElements;
function createOffersSwiperSlide(offersImages) {

	offersImages.forEach(img => {
		let offersSwiperSlide = document.createElement("div");
		offersSwiperSlide.classList.add("swiper-slide");
		offersSwiperSlide.classList.add("offer-swiper-slide");

		let offerImg = document.createElement("img");
		offerImg.classList.add("offer-img");
		offerImg.src = img.offerImgURL;
		offerImg.alt = "img"

		offersSwiperSlide.appendChild(offerImg);

		offersSwiperWrapper.appendChild(offersSwiperSlide);
	})
	offersImagesElements = [... document.querySelectorAll(".offer-swiper-slide")];
		var swiper = new Swiper(".offers-swiper", {
			slidesPerView: 3,
			spaceBetween: 30,
			freeMode: false,
			loop: true,
			keyboard: {
				enabled: true,
			},
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			// Navigation arrows
	
			breakpoints: {
				0: {
					slidesPerView: 1
				},
				480: {
					slidesPerView: 2
				},
				991: {
					slidesPerView: 3
				},
				1199: {
					slidesPerView: 4
				},
			}
		});
}


let showOfferImgDiv = document.querySelector(".show-offer-img-div");
let offerImgDiv = document.querySelector(".show-offer-img-container .image");
let cloneElement;
function showofferImg(e){
	cloneElement= e.currentTarget.querySelector("img").cloneNode()
	offerImgDiv.appendChild(cloneElement);
	showOfferImgDiv.classList.add("active");
	document.body.classList.add("overflow-hidden")
	setTimeout(() => {
		showOfferImgDiv.style.opacity= 1;
	}, 10);
}
window.addEventListener("load",function(){
	setTimeout(() => {
		offersImagesElements.forEach(img=>img.addEventListener("click",showofferImg)
		)
	}, 3000);
})


let hideOfferImgIcon = document.querySelector("#hide-offer-img");
hideOfferImgIcon.addEventListener("click",hideofferImg);
function hideofferImg(){
	showOfferImgDiv.classList.remove("active");
	document.body.classList.remove("overflow-hidden")
	showOfferImgDiv.style.opacity= 0;
	offerImgDiv.removeChild(cloneElement)
}
window.onload = () => {
	GetAllDocumentsRealTime();
	getOffersImageFromFirestoreRealtime();
};