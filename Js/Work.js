const accessKey = "OyyU0YPYOtNPONetxlZZq1_I-giRvRdkrzhR-tprA3c";

const searchForm = document.querySelector(".search-form");
const searchResult = document.querySelector(".search-result");
const searchBar = document.querySelector(".search-bar");
const showMore = document.querySelector(".show-more");
const modal = document.querySelector(".modal");
const modalImg = document.querySelector(".modal img");
const modalDetails = document.querySelector(".modal .details");
const closeModal = document.querySelector(".close-modal");
const favoritesGrid = document.querySelector(".favorites-grid");
const favButton = document.querySelector(".fav");

let keyword = "";
let page = 1;
let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Fixed: Declared favorites array

// Fetch and display images
async function searchImages() {
    keyword = searchBar.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();

        data.results.forEach(photo => {
            const imgContainer = document.createElement("div");
            imgContainer.classList.add("image-container");

            const imgElement = document.createElement("img");
            imgElement.classList.add("results");
            imgElement.src = photo.urls.small;
            imgElement.alt = photo.alt_description || "Image";
            imgElement.classList.add("gallery-image");

            // Click event to open modal
            imgElement.addEventListener("click", () => {
                modal.style.display = "flex";
                modalImg.src = photo.urls.regular;
                modalDetails.innerText = photo.alt_description || "No title";
            });

            // Create Favorite Button
            const favoriteButton = document.createElement("img");
            favoriteButton.classList.add("favorite-btn");
            favoriteButton.src = "../images/plus2.svg"; 
            favoriteButton.alt = "+";

            // Handle adding to favorites
            favoriteButton.addEventListener("click", () => {
                addToFavorites(photo.urls.small, photo.alt_description);
            });

            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(favoriteButton);
            searchResult.appendChild(imgContainer);
        });

        showMore.style.display = "block";
    } catch (error) {
        console.error(error);
    }
}

// Add an image to favorites
function addToFavorites(imageUrl, imageName) {
    if (!favorites.some(fav => fav.src === imageUrl)) {
        favorites.push({ src: imageUrl, alt: imageName });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
    }
}

// Display favorite images
function displayFavorites() {
    favoritesGrid.innerHTML = "";
    favorites.forEach(item => {
        const favImgContainer = document.createElement("div");
        favImgContainer.classList.add("fav-image-container");

        const favImg = document.createElement("img");
        favImg.src = item.src;
        favImg.alt = item.alt;
        favImg.classList.add("favorite-image");

        // Click to view in fullscreen
        favImg.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = item.src;
            modalDetails.innerText = item.alt;
        });

        // Remove button
        const removeButton = document.createElement("button");
        removeButton.innerText = "Remove image";
        removeButton.classList.add("remove-favorite-btn");

        removeButton.addEventListener("click", () => {
            removeFromFavorites(item.src);
        });

        favImgContainer.appendChild(favImg);
        favImgContainer.appendChild(removeButton);
        favoritesGrid.appendChild(favImgContainer);
    });
}

// Remove an image from favorites
function removeFromFavorites(imageUrl) {
    favorites = favorites.filter(fav => fav.src !== imageUrl);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

// Toggle Favorite Section Visibility
favButton.addEventListener("click", () => {
    favoritesGrid.classList.toggle("hidden");
});

// Close modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Search functionality
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchResult.innerHTML = "";
    searchImages();
});

// Load more images
showMore.addEventListener("click", () => {
    page++;
    searchImages();
});

// Load favorites on page load
document.addEventListener("DOMContentLoaded", displayFavorites);
