const accessKey = "OyyU0YPYOtNPONetxlZZq1_I-giRvRdkrzhR-tprA3c";

const searchForm = document.querySelector(".search-form");
const searchResult = document.querySelector(".search-result");
const searchBar = document.querySelector(".search-bar");
const showMore = document.querySelector(".show-more");

let keyword = "";
let page = 1;

async function searchImages() {
    keyword = searchBar.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if(page===1){
            searchResult.innerHTML = "";
        }
        const results = data.results;
        results.map((result)=>{
            const image = document.createElement("img");
            image.src = result.urls.small;
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";

            imageLink.appendChild(image);
            searchResult.appendChild(imageLink);
        })

    } catch (error) {
        console.error("Error fetching images:", error);
    }
}


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showMore.classList.add("active");
    page = 1;
    searchImages();
});

showMore.addEventListener("click",()=>{
    page++;
    searchImages();
})
