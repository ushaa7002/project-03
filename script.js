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
// Advanced filters
let displayedNews = [];
let currentNewsMode = "all";

const advancedSearchInput =
    document.getElementById("newsSearchInput");

const advancedSearchBtn =
    document.getElementById("newsSearchBtn");

const advancedCategory =
    document.getElementById("newsCategoryFilter");

const advancedDate =
    document.getElementById("newsDateFilter");

const advancedSource =
    document.getElementById("newsSourceFilter");

const resetFiltersBtn =
    document.getElementById("resetNewsFilters");

const resultsMessage =
    document.getElementById("newsResultsMessage");


/* =========================
   DISPLAY NEWS
========================= */

function displayNews(news) {

    displayedNews = news || [];
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
   ADVANCED NEWS FILTERS
========================= */

function getArticleSource(article) {
    return article.source?.name || "Unknown Source";
}

function getArticleDate(article) {
    if (!article.publishedAt) return "";

    const date = new Date(article.publishedAt);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function applyNewsFilters() {
    const keyword =
        advancedSearchInput?.value.trim().toLowerCase() || "";

    const category =
        advancedCategory?.value.toLowerCase() || "all";

    const date =
        advancedDate?.value || "";

    const source =
        advancedSource?.value || "all";

    let filteredNews = newsData.filter(article => {
        const title = (article.title || "").toLowerCase();
        const description =
            (article.description || "").toLowerCase();

        const text = `${title} ${description}`;
        const articleSource = getArticleSource(article);

        const matchesKeyword =
            !keyword || text.includes(keyword);

        // NewsAPI articles do not always contain a category field.
        // Therefore, this filter checks article text.
        const categoryKeywords = {
            technology: ["technology", "tech", "software", "artificial intelligence", "ai", "gadgets"],
            business: ["business", "market", "economy", "finance", "company"],
            education: ["education", "school", "university", "student", "college"],
            sports: ["sport", "cricket", "football", "tennis", "match"],
            health: ["health", "medical", "hospital", "disease"],
            science: ["science", "research", "scientist", "discovery"],
            entertainment: ["entertainment", "movie", "film", "actor", "music"],
            politics: ["politics", "government", "election", "minister"],
            world: ["world", "international", "global"]
        };

        const terms = categoryKeywords[category];

        const matchesCategory =
            category === "all" ||
            (terms && terms.some(term => text.includes(term)));

        const matchesDate =
            !date || getArticleDate(article) === date;

        const matchesSource =
            source === "all" || articleSource === source;

        return matchesKeyword &&
            matchesCategory &&
            matchesDate &&
            matchesSource;
    });

    if (currentNewsMode === "latest") {
        filteredNews.sort((a, b) =>
            new Date(b.publishedAt || 0) -
            new Date(a.publishedAt || 0)
        );
    }

    if (currentNewsMode === "trending") {
        // NewsAPI's basic response does not provide a reliable
        // trending score, so use latest news as a fallback.
        filteredNews.sort((a, b) =>
            new Date(b.publishedAt || 0) -
            new Date(a.publishedAt || 0)
        );
    }

    displayNews(filteredNews);

    if (resultsMessage) {
        resultsMessage.textContent =
            `${filteredNews.length} news article(s) found.`;
    }
}

function populateNewsSources() {
    if (!advancedSource) return;

    const sources = [
        ...new Set(newsData.map(getArticleSource))
    ].sort();

    advancedSource.replaceChildren(
        new Option("All Sources", "all")
    );

    sources.forEach(source => {
        advancedSource.add(new Option(source, source));
    });
}

// Advanced search uses your existing NewsAPI search function.
advancedSearchBtn?.addEventListener("click", () => {
    searchInput.value = advancedSearchInput.value.trim();
    searchNews();
});

advancedSearchInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchInput.value = advancedSearchInput.value.trim();
        searchNews();
    }
});

advancedCategory?.addEventListener("change", applyNewsFilters);
advancedDate?.addEventListener("change", applyNewsFilters);
advancedSource?.addEventListener("change", applyNewsFilters);

// Latest / Trending tabs
document.querySelectorAll(".news-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        currentNewsMode = tab.dataset.mode;

        document.querySelectorAll(".news-tab").forEach(button => {
            button.classList.toggle("active", button === tab);
        });

        applyNewsFilters();
    });
});

// Reset advanced filters
resetFiltersBtn?.addEventListener("click", () => {
    if (advancedSearchInput) advancedSearchInput.value = "";
    if (advancedCategory) advancedCategory.value = "all";
    if (advancedDate) advancedDate.value = "";
    if (advancedSource) advancedSource.value = "all";

    currentNewsMode = "all";

    document.querySelectorAll(".news-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.mode === "all");
    });

    applyNewsFilters();
});


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


       newsData = data.articles || [];

populateNewsSources();
applyNewsFilters();

updateInsights();
updateAnalytics(newsData);


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

    const article = displayedNews[index];


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


/* =========================
   NEWS ANALYTICS DASHBOARD
========================= */

let categoryChartInstance = null;
let coverageChartInstance = null;
let topicsChartInstance = null;

function updateAnalytics(articles) {
    if (typeof Chart === "undefined") {
        console.error("Chart.js did not load.");
        return;
    }

    if (!Array.isArray(articles)) {
        console.error("Analytics needs an array of articles.");
        return;
    }

    // 1. NEWS BY CATEGORY
    // Articles need a category property for accurate category counts.
    const categoryCounts = {};

    articles.forEach(article => {
        const category = article.category || article._category || "Uncategorized";

        categoryCounts[category] =
            (categoryCounts[category] || 0) + 1;
    });

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(
        document.getElementById("categoryChart"),
        {
            type: "doughnut",
            data: {
                labels: Object.keys(categoryCounts),
                datasets: [{
                    label: "Number of Articles",
                    data: Object.values(categoryCounts),
                    backgroundColor: [
                        "#2563eb",
                        "#06b6d4",
                        "#8b5cf6",
                        "#f59e0b",
                        "#10b981",
                        "#ef4444",
                        "#ec4899",
                        "#64748b"
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        }
    );

    // 2. NEWS COVERAGE OVER TIME
    const dateCounts = {};

    articles.forEach(article => {
        if (!article.publishedAt) return;

        const date = new Date(article.publishedAt);

        if (Number.isNaN(date.getTime())) return;

        const dateLabel = date.toISOString().slice(0, 10);

        dateCounts[dateLabel] = (dateCounts[dateLabel] || 0) + 1;
    });

    // Display the latest seven dates present in the articles.
    const sortedDates = Object.keys(dateCounts).sort();
    const recentDates = sortedDates.slice(-7);

    if (coverageChartInstance) {
        coverageChartInstance.destroy();
    }

    coverageChartInstance = new Chart(
        document.getElementById("coverageChart"),
        {
            type: "line",
            data: {
                labels: recentDates,
                datasets: [{
                    label: "Articles Published",
                    data: recentDates.map(date => dateCounts[date]),
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37, 99, 235, 0.15)",
                    fill: true,
                    tension: 0.35
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        }
    );

    // 3. MOST COVERED TOPICS
    const stopWords = new Set([
        "the", "and", "for", "with", "that", "this",
        "from", "are", "was", "were", "has", "have",
        "had", "will", "into", "about", "after", "before",
        "over", "under", "their", "they", "them", "its",
        "his", "her", "you", "your", "our", "who", "what",
        "when", "where", "why", "how", "not", "but",
        "all", "more", "than", "also", "says", "said",
        "new", "latest", "news"
    ]);

    const topicCounts = {};

    articles.forEach(article => {
        const text = `${article.title || ""} ${article.description || ""}`;

        const words = text.toLowerCase().match(/[a-z]{4,}/g) || [];

        // Count each word only once per article.
        const uniqueWords = new Set(words);

        uniqueWords.forEach(word => {
            if (stopWords.has(word)) return;

            topicCounts[word] = (topicCounts[word] || 0) + 1;
        });
    });

    const topTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    if (topicsChartInstance) {
        topicsChartInstance.destroy();
    }

    topicsChartInstance = new Chart(
        document.getElementById("topicsChart"),
        {
            type: "bar",
            data: {
                labels: topTopics.map(item => item[0]),
                datasets: [{
                    label: "Articles Mentioning Topic",
                    data: topTopics.map(item => item[1]),
                    backgroundColor: "#8b5cf6",
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }
    );
}
