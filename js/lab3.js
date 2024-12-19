$(document).ready(function () {
    let data = []; // Store JSON data
    let currentIndex = 0; // Track the current slide

    // Load JSON data
    $.ajax({
        url: "data/favskins.json", // Path to your JSON file
        success: function (response) {
            data = response; // Assign response to data
            console.log("JSON Data Loaded:", data); // Debugging
            initializeCarousel(); // Set up the carousel
            populateDropdown(); // Populate dropdown content
        },
        error: function () {
            console.error("Failed to load JSON data.");
        }
    });

    // Initialize the carousel
    function initializeCarousel() {
        if (data.length > 0) {
            updateCarousel(); // Display the first item
        } else {
            console.error("No data available.");
        }
    }

    // Update the carousel with the current item
    function updateCarousel() {
        const item = data[currentIndex]; // Get the current item
        const displayContainer = $("#image-display");

        displayContainer.fadeOut(300, function () {
            displayContainer.empty(); // Clear existing content
            const carouselContent = `
                <div>
                    <h2><a href="${item.url}" target="_blank">${item.title}</a></h2>
                    <ul>
                        ${item.description.map(desc => `<li>${desc}</li>`).join("")}
                    </ul>
                    <img src="${item.images.src}" alt="${item.images.alt}" class="skin_image">
                </div>
            `;
            displayContainer.append(carouselContent); // Add new content
            displayContainer.fadeIn(300); // Fade in the new content
        });
    }

    // Populate dropdown content dynamically
    function populateDropdown() {
        const dropdownContainer = $("#skins-list");
        dropdownContainer.empty(); // Clear existing content

        data.forEach(item => {
            const dropdownContent = `
                <div class="skin-item">
                    <h2><a href="${item.url}" target="_blank">${item.title}</a></h2>
                    <ul>
                        ${item.description.map(desc => `<li>${desc}</li>`).join("")}
                    </ul>
                    <img src="${item.images.src}" alt="${item.images.alt}" class="skin_image">
                </div>
            `;
            dropdownContainer.append(dropdownContent); // Add each item
        });
    }

    // Next button functionality
    $("#next").on("click", function () {
        currentIndex = (currentIndex + 1) % data.length; // Cycle to the next item
        updateCarousel();
    });

    // Previous button functionality
    $("#prev").on("click", function () {
        currentIndex = (currentIndex - 1 + data.length) % data.length; // Cycle to the previous item
        updateCarousel();
    });

    // Dropdown toggle functionality
    $("#sliderbutton").on("click", function () {
        const content = $("#slidercontent");
        content.stop(true, false); // Prevent animation conflicts

        if (content.is(":visible")) {
            content.slideUp(400); // Collapse the dropdown
        } else {
            content.slideDown(400, function () {
                // Smoothly scroll the page down to the dropdown
                $("html, body").animate(
                    { scrollTop: content.offset().top },
                    400,
                    "swing"
                );
            });
        }
    });

    // Start the dropdown closed
    $("#slidercontent").hide(); // Ensure the dropdown starts in a closed state

    // Search Functionality
    $("#search-bar").on("input", function () {
        const query = $(this).val().toLowerCase();
        $("#skins-list > .skin-item").each(function () {
            const title = $(this).find("h2").text().toLowerCase();
            $(this).toggle(title.includes(query)); // Show or hide based on the query
        });
    });
});
