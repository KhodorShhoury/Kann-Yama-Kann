



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

function createMealCard(meals) {
	mealContainer.innerHTML = "";
	meals.forEach(mealCard => {
		//-create meal
		let meal = document.createElement("div");
		meal.className = "meal";


		//-create mealImage
		let mealImageTop = document.createElement("img");
		mealImageTop.className = "meal-img-top";
		mealImageTop.src = mealCard.MealImageURL;
		//-create mealBody
		let mealBody = document.createElement("div");
		mealBody.className = "meal-body";

		//-create meal Title
		let mealName = document.createElement("h5");
		mealName.className = "meal-name";
		mealName.innerHTML = mealCard.MealName
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
		mealPrice.innerHTML = mealCard.MealPrice;

		//-create meal price $
		let mealPriceCur = document.createElement("span");
		mealPriceCur.className = "meal-price-currency";
		mealPriceCur.innerHTML = "L.L"

		//-create meal type
		let mealType = document.createElement("p");
		mealType.className = "meal-type";
		mealType.innerHTML = mealCard.MealCateg;

		meal.appendChild(mealImageTop);
		meal.appendChild(mealBody);

		mealBody.appendChild(mealName)
		mealBody.appendChild(mealDesc)
		mealBody.appendChild(mealPriceDiv)
		mealBody.appendChild(mealType)

		mealPriceDiv.appendChild(mealPrice)
		mealPrice.prepend(mealPriceCur)

		mealContainer.appendChild(meal);
		menu.appendChild(mealContainer);
	})

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

		let offerImg = document.createElement("img");
		offerImg.classList.add("offer-img");
		offerImg.src = img.offerImgURL;


		offersSwiperSlide.appendChild(offerImg);

		offersSwiperWrapper.appendChild(offersSwiperSlide);
	})
	offersImagesElements = [... document.querySelectorAll(".offer-img")]
}

setTimeout(() => {
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
}, 2000);
let showOfferImgDiv = document.querySelector(".show-offer-img-div");
let offerImgDiv = document.querySelector(".show-offer-img-container .image");
let cloneElement;
function showofferImg(e){
	cloneElement= e.currentTarget.cloneNode()
	offerImgDiv.appendChild(cloneElement);
	showOfferImgDiv.classList.add("active");
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
	showOfferImgDiv.style.opacity= 0;
	offerImgDiv.removeChild(cloneElement)
}
window.onload = () => {
	GetAllDocumentsRealTime();
	getOffersImageFromFirestoreRealtime();
};