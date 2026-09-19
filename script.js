/* =========================
   NEWS DATA
========================= */

const newsData = [

    {
        title: "Artificial Intelligence is Changing Technology",
        description: "AI is becoming an important part of modern software and technology.",
        category: "Technology",
        source: "Tech News",
        date: "Today",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
    },

    {
        title: "India Wins an Exciting Cricket Match",
        description: "India delivered a strong performance in an exciting cricket match.",
        category: "Sports",
        source: "Sports News",
        date: "Today",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da"
    },

    {
        title: "Global Economy Shows New Changes",
        description: "Markets and businesses are adapting to changes in the global economy.",
        category: "Business",
        source: "Business Daily",
        date: "Yesterday",
        image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
    },

    {
        title: "Scientists Make New Discovery",
        description: "Researchers have announced an interesting development in science.",
        category: "Science",
        source: "Science Daily",
        date: "Yesterday",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d"
    },

    {
        title: "New Technology Could Change the Future",
        description: "Researchers are developing new technologies for the future.",
        category: "Technology",
        source: "Future Tech",
        date: "2 days ago",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },

    {
        title: "Countries Discuss Global Issues",
        description: "World leaders are discussing important global developments.",
        category: "World",
        source: "World News",
        date: "2 days ago",
        image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620"
    }

];


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
   DISPLAY NEWS
========================= */

function displayNews(news) {

    newsContainer.innerHTML = "";

    if (news.length === 0) {

        newsContainer.innerHTML = `
            <div class="no-news">
                <h3>😔 No News Found</h3>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }


    news.forEach((article, index) => {

        const card = document.createElement("div");

        card.classList.add("news-card");

        card.innerHTML = `

            <img
                src="${article.image}"
                class="news-image"
                alt="News Image"
            >

            <div class="news-content">

                <span class="news-category">
                    ${article.category}
                </span>

                <h3>
                    ${article.title}
                </h3>

                <p>
                    ${article.description}
                </p>

                <small>
                    📰 ${article.source}
                    | ${article.date}
                </small>

                <br>

                <a
                    href="#"
                    class="read-btn"
                    onclick="readNews(${index})"
                >
                    Read More
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
   SEARCH NEWS
========================= */

function searchNews() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredNews =
        newsData.filter(article =>

            article.title
                .toLowerCase()
                .includes(searchText)

            ||

            article.description
                .toLowerCase()
                .includes(searchText)

            ||

            article.category
                .toLowerCase()
                .includes(searchText)

        );


    displayNews(filteredNews);

}


searchBtn.addEventListener(
    "click",
    searchNews
);


searchInput.addEventListener(
    "keyup",
    function(event) {

        if (event.key === "Enter") {
            searchNews();
        }

    }
);


/* =========================
   CATEGORY FILTER
========================= */

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            const category =
                this.dataset.category;


            if (category === "All") {

                displayNews(newsData);

            } else {

                const filteredNews =
                    newsData.filter(article =>
                        article.category === category
                    );

                displayNews(filteredNews);

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
        newsData.filter(
            article => article.category === "Technology"
        ).length;


    const sports =
        newsData.filter(
            article => article.category === "Sports"
        ).length;


    const business =
        newsData.filter(
            article => article.category === "Business"
        ).length;


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

    const savedNews =
        JSON.parse(
            localStorage.getItem("savedNews")
        ) || [];


    savedNews.push(newsData[index]);


    localStorage.setItem(
        "savedNews",
        JSON.stringify(savedNews)
    );


    alert("⭐ News saved successfully!");

}


/* =========================
   READ NEWS
========================= */

function readNews(index) {

    const article =
        newsData[index];


    alert(
        article.title +
        "\n\n" +
        article.description +
        "\n\nSource: " +
        article.source
    );

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

        } else {

            themeBtn.innerText = "🌙";

        }

    }
);


/* =========================
   START WEBSITE
========================= */

displayNews(newsData);

updateInsights();