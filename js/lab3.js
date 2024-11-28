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
        console.log(currentIndex, data)
        const project = data[currentIndex]; // Get the current project
        const displayContainer = $("#image-display");
        const existingContent = displayContainer.find(".carousel-item");

        if (existingContent.length > 0) {
            // Fade out existing content
            existingContent.fadeOut("slow", function () {
                displayContainer.empty(); // Remove old content
                appendNewContent(project, displayContainer); // Add new content
                displayContainer.children().fadeIn("slow"); // Fade in new content
            });
        } else {
            // No content yet, just add and fade in
            appendNewContent(project, displayContainer);
            displayContainer.children().fadeIn("slow");
        }
    }

    // Function to append new content to the display container
    function appendNewContent(project, displayContainer) {
        const contentHTML = `
            <div class="carousel-item" style="display: none;">
                <h2><a href="${project.url}" target="_blank">${project.title}</a></h2>
                <ul>
                    ${project.description.map((item) => `<li>${item}</li>`).join("")}
                </ul>
                <img src="${project.images.src}" alt="${project.images.alt}" class="skin_image">
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
        if (currentIndex < data.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to the first slide
        }
        console.log("Next Index:", currentIndex); // Debug
        updateContent(data);
    });

    // Previous button functionality
    $("#prev").on("click", function () {
        stopAutoFade(); // Stop auto-fading when manual interaction occurs
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = data.length - 1; // Loop back to the last slide
        }
        console.log("Previous Index:", currentIndex); // Debug
        updateContent(data);
    });
});


