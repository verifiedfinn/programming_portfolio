$(document).ready(function () {
    let data; // Store JSON data
    let currentIndex = 0; // Track the current slide
    let autoFadeInterval; // Store the interval for auto-fading

    // Load JSON data
    $.ajax({
        url: "data/favskins.json", // Path to your JSON file
        success: function (response) {
            data = response;
            console.log("JSON Data Loaded:", data); // Debug
            initialise(data); // Initialize carousel once data is loaded
        },
        error: function () {
            console.error("Failed to load JSON data.");
        }
    });

    // Initialize carousel
    function initialise(data) {
        if (data && data.length > 0) {
            updateContent(data); // Show the first slide
            startAutoFade(data); // Start auto-fading
        } else {
            console.error("No data found in JSON.");
        }
    }

    // Update carousel content with fade animation
    function updateContent(data) {
        const project = data[currentIndex]; // Get the current project
        const displayContainer = $("#image-display");
        const existingContent = displayContainer.find(".carousel-item");

        if (existingContent.length > 0) {
            existingContent.fadeOut(300, function () {
                displayContainer.empty();
                appendNewContent(project, displayContainer);
                displayContainer.children().hide().fadeIn(300);
            });
        } else {
            appendNewContent(project, displayContainer);
            displayContainer.children().hide().fadeIn(300);
        }
    }

    // Function to append new content to the display container
    function appendNewContent(project, displayContainer) {
        const contentHTML = `
            <div class="carousel-item">
                <h2><a href="${project.url}" target="_blank">${project.title}</a></h2>
                <ul>
                    ${project.description.map((item) => `<li>${item}</li>`).join("")}
                </ul>
                <div class="project_image_container">
                    <img src="${project.images.src}" alt="${project.images.alt}" class="skin_image">
                </div>
            </div>
        `;
        displayContainer.append(contentHTML);
    }

    // Start auto-fading
    function startAutoFade(data) {
        autoFadeInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % data.length;
            updateContent(data);
        }, 10000);
    }

    // Stop auto-fading
    function stopAutoFade() {
        clearInterval(autoFadeInterval);
        console.log("Auto-fade stopped.");
    }

    // Next button functionality
    $("#next").on("click", function () {
        stopAutoFade();
        currentIndex = (currentIndex + 1) % data.length;
        updateContent(data);
    });

    // Previous button functionality
    $("#prev").on("click", function () {
        stopAutoFade();
        currentIndex = (currentIndex - 1 + data.length) % data.length;
        updateContent(data);
    });

    // Unified hover and click effects for navigation buttons
    $("#prev, #next").on({
        mouseenter: function () {
            $(this).css("background-color", "green");
        },
        mouseleave: function () {
            $(this).css("background-color", "red");
        },
        click: function () {
            $(this).css("background-color", "orange");
        }
    });

    // Pre-render slider content to prevent lag
    $("#slidercontent").hide(); // Start hidden but already rendered in the DOM

    // Smooth dropdown functionality for the slider button
    $("#sliderbutton").click(function () {
        const content = $("#slidercontent");

        // Prevent animation interruptions
        content.stop(true, false);

        if (content.is(":visible")) {
            content.slideUp(400, "swing");
        } else {
            content.slideDown(400, "swing", function () {
                $("html, body").animate(
                    { scrollTop: content.offset().top },
                    400,
                    "swing"
                );
            });
        }
    });
});
