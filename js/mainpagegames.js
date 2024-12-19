$(document).ready(function () {
    let gamesData = [];

    // Fetch JSON data
    $.getJSON("data/gameinfo.json", function (data) {
        gamesData = data.games;
        displayGames(); // Render all games initially
    }).fail(function () {
        console.error("Failed to load JSON data.");
    });

    // Function to display games
    function displayGames(filter = "All") {
        $("#game-container").empty(); // Clear container

        const filteredGames = filter === "All" 
            ? gamesData 
            : gamesData.filter(game => game.Tags.includes(filter));

        // Render each game box
        filteredGames.forEach(game => {
            $("#game-container").append(`
                <div class="game_types">
                    <h2>${game.Name}</h2>
                    <a href="${game.Link}" class="button-link steam-link" target="_blank">Click to view on Steam</a>
                    <p class="short-description">${game.Description.split('.')[0]}.</p> <!-- Show first sentence -->
                    <div class="more-content" style="display: none;">
                        <p>${game.Description}</p> <!-- Full description -->
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
                    parentBox.css("height", "400px"); // Reset box height
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
        const tag = $(this).data("tag");
        displayGames(tag); // Display filtered games
    });
});



