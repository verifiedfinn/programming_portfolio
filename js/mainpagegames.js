$(document).ready(function () {
    let gamesData = [];
    let currentFilter = "All";

    // Fetch JSON data
    $.getJSON("data/gameinfo.json", function (data) {
        gamesData = data.games;
        displayGames(); // Render all games initially
    }).fail(function () {
        console.error("Failed to load JSON data.");
    });

    // Function to display games
    function displayGames(filter = "All", searchQuery = "", sortDirection = "none") {
        const container = $("#game-container");
        container.empty();

        let gamesToDisplay = [...gamesData];

        // Apply filtering
        if (filter !== "All") {
            gamesToDisplay = gamesToDisplay.filter(game => game.Tags.includes(filter));
        }

        // Apply search query
        if (searchQuery) {
            gamesToDisplay = gamesToDisplay.filter(game =>
                game.Name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sorting
        gamesToDisplay = sortGames(gamesToDisplay, sortDirection);

        // Render games
        gamesToDisplay.forEach(game => container.append(renderGame(game)));

        // Attach read more functionality
        attachReadMoreHandlers();
    }

    // Sorting logic
    function sortGames(games, direction) {
        if (direction === "A-Z") {
            return games.sort((a, b) => a.Name.localeCompare(b.Name));
        }
        if (direction === "Z-A") {
            return games.sort((a, b) => b.Name.localeCompare(a.Name));
        }
        return games.sort(() => Math.random() - 0.5); // Random order for "All"
    }

    // Render a single game
    function renderGame(game) {
        const steamLink = game.Link
            ? `<a href="${game.Link}" class="button-link steam-link" target="_blank">Click to view on Steam</a>`
            : `<div class="placeholder-link"></div>`;

        return `
            <div class="game_types">
                <h2>${game.Name}</h2>
                ${steamLink}
                <p class="short-description">${game.FirstSentence}</p>
                <div class="more-content" style="display: none;">
                    <p>${game.RemainingDescription}</p>
                </div>
                <img src="${game.Image}" alt="${game.Name}" class="game-image">
                <button class="button-link read-more-btn">Read More</button>
            </div>
        `;
    }

    // Attach read more functionality
    function attachReadMoreHandlers() {
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
    }

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
