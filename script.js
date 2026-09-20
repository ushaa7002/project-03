/* =========================
   NEWS API
========================= */

// Put your NewsAPI key here for local testing
const API_KEY = "4ed2ccf64eca48a1a748186bdea044ce";

/* =========================
   SELECT HTML ELEMENTS
========================= */

const newsContainer =
    document.getElementById("newsContainer");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const themeBtn =
    document.getElementById("themeBtn");

const totalNews =
    document.getElementById("totalNews");

const technologyCount =
    document.getElementById("technologyCount");

const sportsCount =
    document.getElementById("sportsCount");

const businessCount =
    document.getElementById("businessCount");

const categoryButtons =
    document.querySelectorAll(".category-btn");


/* =========================
   STORE CURRENT NEWS
========================= */

let newsData = [];


/* =========================
   DISPLAY NEWS
========================= */

function displayNews(news) {

    newsContainer.innerHTML = "";

    if (!news || news.length === 0) {

        newsContainer.innerHTML = `
            <div class="no-news">
                <h3>😔 No News Found</h3>
                <p>Try another topic.</p>
            </div>
        `;

        return;
    }


    news.forEach((article, index) => {

        const card =
            document.createElement("div");

        card.classList.add("news-card");


        const image =
            article.urlToImage ||
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c";


        const source =
            article.source?.name ||
            "Unknown Source";


        const date =
            article.publishedAt
                ? new Date(article.publishedAt)
                    .toLocaleString()
                : "Unknown date";


        card.innerHTML = `

            <img
                src="${image}"
                class="news-image"
                alt="News Image"
                onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c'"
            >

            <div class="news-content">

                <span class="news-category">
                    News
                </span>

                <h3>
                    ${article.title || "No title available"}
                </h3>

                <p>
                    ${article.description || "No description available."}
                </p>

                <small>
                    📰 ${source}
                    | ${date}
                </small>

                <br><br>

                <a
                    href="${article.url}"
                    target="_blank"
                    class="read-btn"
                >
                    Read Full Article →
                </a>

                <button
                    class="save-btn"
                    onclick="saveNews(${index})"
                >
                    ⭐ Save
                </button>

            </div>
        `;


        newsContainer.appendChild(card);

    });

}


/* =========================
   SEARCH LIVE NEWS
========================= */

async function searchNews() {

    const searchText =
        searchInput.value.trim();


    if (searchText === "") {

        alert("Please enter a topic to search.");

        return;
    }


    newsContainer.innerHTML = `
        <div class="loading">
            <h3>🔍 Searching latest news...</h3>
            <p>Please wait.</p>
        </div>
    `;


    try {

        const url =
            `https://newsapi.org/v2/everything?` +
            `q=${encodeURIComponent(searchText)}` +
            `&language=en` +
            `&sortBy=publishedAt` +
            `&pageSize=20` +
            `&apiKey=${API_KEY}`;


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Unable to fetch news."
            );

        }


        newsData =
            data.articles || [];


        displayNews(newsData);

        updateInsights();


    } catch (error) {

        console.error(error);


        newsContainer.innerHTML = `
            <div class="no-news">

                <h3>⚠️ Something went wrong</h3>

                <p>
                    ${error.message}
                </p>

                <p>
                    Please check your API key
                    and internet connection.
                </p>

            </div>
        `;

    }

}


/* =========================
   SEARCH BUTTON
========================= */

searchBtn.addEventListener(
    "click",
    searchNews
);


/* =========================
   ENTER KEY SEARCH
========================= */

searchInput.addEventListener(
    "keyup",
    function(event) {

        if (event.key === "Enter") {

            searchNews();

        }

    }
);


/* =========================
   CATEGORY SEARCH
========================= */

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            const category =
                this.dataset.category;


            if (category === "All") {

                searchInput.value = "latest";

                searchNews();

            }

            else {

                searchInput.value =
                    category;

                searchNews();

            }

        }
    );

});


/* =========================
   NEWS INSIGHTS
========================= */

function updateInsights() {

    totalNews.innerText =
        newsData.length;


    const technology =
        newsData.filter(article => {

            const text =
                (
                    article.title || ""
                ).toLowerCase();

            return (
                text.includes("technology") ||
                text.includes("ai") ||
                text.includes("artificial intelligence") ||
                text.includes("software")
            );

        }).length;


    const sports =
        newsData.filter(article => {

            const text =
                (
                    article.title || ""
                ).toLowerCase();

            return (
                text.includes("sport") ||
                text.includes("cricket") ||
                text.includes("football")
            );

        }).length;


    const business =
        newsData.filter(article => {

            const text =
                (
                    article.title || ""
                ).toLowerCase();

            return (
                text.includes("business") ||
                text.includes("market") ||
                text.includes("economy")
            );

        }).length;


    technologyCount.innerText =
        technology;

    sportsCount.innerText =
        sports;

    businessCount.innerText =
        business;

}


/* =========================
   SAVE NEWS
========================= */

function saveNews(index) {

    const article =
        newsData[index];


    const savedNews =
        JSON.parse(
            localStorage.getItem("savedNews")
        ) || [];


    savedNews.push(article);


    localStorage.setItem(
        "savedNews",
        JSON.stringify(savedNews)
    );


    alert("⭐ News saved successfully!");

}


/* =========================
   DARK MODE
========================= */

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            themeBtn.innerText = "☀️";

        }

        else {

            themeBtn.innerText = "🌙";

        }

    }
);


/* =========================
   START WEBSITE
========================= */

newsContainer.innerHTML = `
    <div class="no-news">
        <h3>📰 Search for News</h3>
        <p>
            Enter a topic above to see the latest news.
        </p>
    </div>
`;