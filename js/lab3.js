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
        console.log(currentIndex, data);
        const project = data[currentIndex]; // Get the current project
        const displayContainer = $("#image-display");
        const existingContent = displayContainer.find(".carousel-item");

        // Fade out old content and fade in new
        displayContainer.stop(true, true).fadeOut(300, function () {
            displayContainer.empty(); // Remove old content
            appendNewContent(project, displayContainer); // Add new content
            displayContainer.fadeIn(300); // Fade in new content
        });
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
        displayContainer.append(contentHTML); // Add the new content
    }

    // Start auto-fading
    function startAutoFade(data) {
        autoFadeInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % data.length; // Move to the next slide
            updateContent(data);
        }, 10000); // Every 10 seconds
    }

    // Stop auto-fading
    function stopAutoFade() {
        clearInterval(autoFadeInterval);
        console.log("Auto-fade stopped."); // Debug
    }

    // Next button functionality
    $("#next").on("click", function () {
        stopAutoFade(); // Stop auto-fading when manual interaction occurs
        currentIndex = (currentIndex + 1) % data.length; // Loop back to the first slide
        updateContent(data);
    });

    // Previous button functionality
    $("#prev").on("click", function () {
        stopAutoFade(); // Stop auto-fading when manual interaction occurs
        currentIndex = (currentIndex - 1 + data.length) % data.length; // Loop back to the last slide
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

    // Smooth dropdown functionality for the slider button
    $("#sliderbutton").click(function () {
        const content = $("#slidercontent");

        if (content.is(":visible")) {
            content.stop(true, true).slideUp(400); // Smoothly hide content
        } else {
            content.stop(true, true).slideDown(400).promise().done(function () {
                // Smooth scroll to dropdown content
                $("html, body").stop(true, true).animate(
                    { scrollTop: content.offset().top },
                    600, // Increased timing for smoothness
                    "swing" // Natural easing
                );
            });
        }
    });
});
