// Function to define and call images for carousel

$(document).ready(function() {


    let images;
    let currentIndex = 0;


    // Load JSON data
    $.ajax({
        url: "data/photos.json",
        success: function(data) {
            images = data;
            initialise();
        }
    });


    // Initialize the carousel with the first image
    function initialise() {
     updateImage();
}


    // Update image in the carousel
    function updateImage() {

        const oldImage = $('#image-display').find('img');
        oldImage.fadeOut();
        const imageSrc = images.images[currentIndex].image;
        $('#image-display').html(`<img src="${imageSrc}" alt="Product Image">`).find('img').fadeIn();
        console.log(fadeOut)
    }


    // Next button functionality
    $('#next').on('click', function() {
        if (currentIndex < images.images.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateImage()
    });



    // Previous button functionality
    $('#prev').on('click', function() {
        if (currentIndex <= 0) {
            currentIndex = images.images.length - 1;
        } else {
            currentIndex --;
        }
        updateImage()
    });



});
