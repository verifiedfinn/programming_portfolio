$(document).ready(function () {
    let gamesData = [];

    // Fetch data from JSON file
    $.getJSON("data/gameinfo.json", function (data) {
        gamesData = data.games;
        displayGames(); // Display all games initially
    });

    // Display games based on filter
    function displayGames(filter = "All") {
        $("#game-container").empty(); // Clear container
        const filteredGames = filter === "All" ? gamesData : gamesData.filter(game => game.Tags.includes(filter));

        filteredGames.forEach(game => {
            $("#game-container").append(`
                <div class="game_types">
                    <h2>${game.Name}</h2>
                    <a href="${game.Link}" class="button-link" target="_blank">Click to view on Steam</a>
                    <p>${game.Description}</p>
                    <img src="${game.Image}" alt="${game.Name}">
                </div>
                <br>
            `);
        });
    }

    // Handle filter button clicks
    $("#filters").on("click", ".filter-btn", function () {
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");
        const tag = $(this).data("tag");
        displayGames(tag);
    });
});

