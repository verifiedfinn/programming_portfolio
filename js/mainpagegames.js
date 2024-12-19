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
        $("#game-container").empty(); // Clear container

        let gamesToDisplay = [...gamesData]; // Create a copy of the games array

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
        if (sortDirection === "A-Z") {
            gamesToDisplay.sort((a, b) => a.Name.localeCompare(b.Name));
        } else if (sortDirection === "Z-A") {
            gamesToDisplay.sort((a, b) => b.Name.localeCompare(a.Name));
        } else if (filter === "All") {
            // Shuffle for random order if no sortDirection is applied
            gamesToDisplay.sort(() => Math.random() - 0.5);
        }

        // Render each game box
        gamesToDisplay.forEach(game => {
            $("#game-container").append(`
                <div class="game_types">
                    <h2>${game.Name}</h2>
                    <a href="${game.Link}" class="button-link steam-link" target="_blank">Click to view on Steam</a>
                    <p class="short-description">${game.FirstSentence}</p>
                    <div class="more-content" style="display: none;">
                        <p>${game.RemainingDescription}</p>
                    </div>
                    <img src="${game.Image}" alt="${game.Name}" class="game-image">
                    <button class="button-link read-more-btn">Read More</button>
                </div>
            `);
        });

        // Toggle functionality for "Read More"
        $(".read-more-btn").on("click", function (event) {
            event.stopPropagation(); // Prevent interference with other elements
            const moreContent = $(this).siblings(".more-content");
            const parentBox = $(this).closest(".game_types"); // Get the parent box

            if (moreContent.is(":visible")) {
                // Collapse text
                moreContent.slideUp(300, function () {
                    parentBox.css("height", "auto"); // Reset box height
                });
                $(this).text("Read More");
            } else {
                // Expand text
                parentBox.css("height", "auto"); // Let CSS handle the height transition
                moreContent.slideDown(300);
                $(this).text("Read Less");
            }
        });
    }

    // Handle filter button clicks
    $("#filters").on("click", ".filter-btn", function () {
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");
        currentFilter = $(this).data("tag");
        displayGames(currentFilter);
    });

    // Handle search input
    $("#search-bar").on("input", function () {
        const searchQuery = $(this).val();
        displayGames(currentFilter, searchQuery);
    });

    // Handle sort buttons
    $("#sort-a-z").on("click", function () {
        displayGames(currentFilter, $("#search-bar").val(), "A-Z");
    });

    $("#sort-z-a").on("click", function () {
        displayGames(currentFilter, $("#search-bar").val(), "Z-A");
    });
});
