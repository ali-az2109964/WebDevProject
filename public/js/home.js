import customersFunc from "./functionalities/customers-func.js";

window.addEventListener("load", async () => {
	showItems();
	window.handleBuyNow = handleBuyNow;
	window.handleShowDetails = handleShowDetails;
});

const loginBtn = document.querySelector("#loginBtn");
const searchBox = document.querySelector("#searchBox");
const main = document.querySelector("#main");

let filteredItems = [];
let items = [];

// check if the user is logged in using the login cookie stored in the local storage
if (await customersFunc.isLoggedIn(localStorage.loginCookie)) {
	loginBtn.textContent = "Logout";
	document.querySelector("#purchaseLI").classList.toggle("hidden", false);
}

// if the user is not logged in, set the login cookie to -1
localStorage.loginCookie = localStorage.loginCookie || "-1";

loginBtn.addEventListener("click", async () => {
	// if user is logging in
	if (loginBtn.textContent === "Login") {
		if (!(await customersFunc.isLoggedIn(localStorage.loginCookie))) {
			window.location.href = "/login-type.html";
		} else {
			loginBtn.textContent = "Login";
			document.querySelector("#purchaseLI").classList.toggle("hidden", true);
		}
	}
	// if user is logging out
	else {
		customersFunc.logout(localStorage.loginCookie);
		alert("You have successfully logged out");
		loginBtn.textContent = "Login";
		document.querySelector("#purchaseLI").classList.toggle("hidden", true);
	}
});

searchBox.addEventListener("input", find);

function find() {
	if (searchBox.value !== "") {
		filteredItems = items.filter((item) =>
			item.title.toLowerCase().includes(searchBox.value.toLowerCase())
		);
		showItems(true);
	} else {
		showItems(false);
	}
}

async function showItems(isFiltered) {
	try {
		const data = await fetch("/api/items");
		items = await data.json();
		if (isFiltered === true) {
			main.innerHTML = filteredItems.map((item) => itemToHTML(item)).join("");
		} else {
			main.innerHTML = items.map((item) => itemToHTML(item)).join("");
		}
	} catch (error) {
		console.error("Failed to load items:", error);
	}
}

function itemToHTML(item) {
	return `<section class="item">
					<figure>
							<img src="${item.thumbnail}" alt="Image of ${item.title} Laptop">
					</figure>
					<p>${item.title}</p>
					<p class="best-for">${item.note}</p>
					<p class="note">Notable Features: </p>
					<p class="features">${item.features[0]}</p>
					<p class="features">${item.features[1]}</p>
					<p class="features">${item.features[2]}</p>
					<p class="features">${item.features[3]}</p>
					<p class="price">$${item.price}</p>
					<button onclick="handleShowDetails(${item.id})">Show Details</button>
					<button onclick="handleBuyNow(${item.id})">Buy Now!</button>
			</section>`;
}

function handleShowDetails(id) {
	const item = items.find((item) => item.id === id);
	localStorage.itemID = item.id;
	window.location.href = "/show-details.html";
}

function handleBuyNow(id) {
	const item = items.find((item) => item.id === id);
	if (customersFunc.isLoggedIn(localStorage.loginCookie)) {
		localStorage.itemID = item.id;
		window.location.href = `/buy-now.html`;
	} else {
		alert("Please login to buy items!");
		window.location.href = "/login-type.html";
	}
}
