$(document).ready(function () {
    let gamesData = [];
    let currentFilter = "All";
    let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Load saved favorites

    // Fetch JSON data
    $.getJSON("data/gameinfo.json", function (data) {
        gamesData = data.games;
        console.log("Loaded games data:", gamesData); // Debugging
        displayGames(); // Render all games initially
    }).fail(function () {
        console.error("Failed to load JSON data.");
    });

    // Function to display games
    function displayGames(filter = "All", searchQuery = "", sortDirection = "none") {
        const container = $("#game-container");
        container.empty();

        let gamesToDisplay = [...gamesData];

        if (filter === "Favorites") {
            gamesToDisplay = gamesData.filter((game) => favorites.includes(game.Name));
        } else {
            if (filter !== "All") {
                gamesToDisplay = gamesToDisplay.filter((game) => game.Tags.includes(filter));
            }

            if (searchQuery) {
                gamesToDisplay = gamesToDisplay.filter((game) =>
                    game.Name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            gamesToDisplay = sortGames(gamesToDisplay, sortDirection);
        }

        gamesToDisplay.forEach((game) => container.append(renderGame(game)));
        attachHandlers(); // Attach handlers to dynamically added elements
    }

    // Sorting logic
    function sortGames(games, direction) {
        if (direction === "A-Z") {
            return games.sort((a, b) => a.Name.localeCompare(b.Name));
        }
        if (direction === "Z-A") {
            return games.sort((a, b) => b.Name.localeCompare(a.Name));
        }
        return games.sort(() => Math.random() - 0.5);
    }

    // Render a single game
    function renderGame(game) {
        const isFavorite = favorites.includes(game.Name);
        const favoriteClass = isFavorite ? "favorited" : "";

        return `
            <div class="game_types" data-name="${game.Name}">
                <h2>${game.Name}</h2>
                <p class="short-description">${game.FirstSentence}</p>
                <div class="more-content" style="display: none;">
                    <p>${game.RemainingDescription}</p>
                </div>
                <img src="${game.Image}" alt="${game.Name}" class="game-image">
                <button class="button-link read-more-btn">Read More</button>
                <button class="favorite-btn ${favoriteClass}">❤️ Favorite</button>
            </div>
        `;
    }

    // Attach handlers for read more and favorite buttons
    function attachHandlers() {
        $(".read-more-btn").on("click", function (event) {
            event.stopPropagation();
            const moreContent = $(this).siblings(".more-content");
            const parentBox = $(this).closest(".game_types");

            if (moreContent.is(":visible")) {
                moreContent.slideUp(300, () => parentBox.css("height", "auto"));
                $(this).text("Read More");
            } else {
                parentBox.css("height", "auto");
                moreContent.slideDown(300);
                $(this).text("Read Less");
            }
        });

        $(".favorite-btn").on("click", function () {
            const parentBox = $(this).closest(".game_types");
            const gameName = parentBox.data("name");

            if ($(this).hasClass("favorited")) {
                // Remove from favorites
                favorites = favorites.filter((favName) => favName !== gameName);
                $(this).removeClass("favorited");
                console.log(`Removed ${gameName} from favorites.`);
            } else {
                // Add to favorites
                favorites.push(gameName);
                $(this).addClass("favorited");
                console.log(`Added ${gameName} to favorites.`);
            }

            // Save updated favorites to localStorage
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });
    }

    // "View Favorites" button functionality
    $("#view-favorites").on("click", function () {
        if (currentFilter === "Favorites") {
            currentFilter = "All";
            $(this).text("View Favorites");
        } else {
            currentFilter = "Favorites";
            $(this).text("Back to All Games");
        }
        displayGames(currentFilter, $("#search-bar").val());
    });

    // Filter button clicks
    $("#filters").on("click", ".filter-btn", function () {
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");
        currentFilter = $(this).data("tag");
        displayGames(currentFilter, $("#search-bar").val());
    });

    // Search input
    $("#search-bar").on("input", function () {
        displayGames(currentFilter, $(this).val());
    });

    // Sort buttons
    $("#sort-a-z").on("click", function () {
        displayGames(currentFilter, $("#search-bar").val(), "A-Z");
    });

    $("#sort-z-a").on("click", function () {
        displayGames(currentFilter, $("#search-bar").val(), "Z-A");
    });
});
