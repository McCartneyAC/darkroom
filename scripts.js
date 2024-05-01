// Original image data
let originalImageData;

// Function to adjust exposure time
function adjustExposureTime(value) {
    const ctx = previewImage.getContext('2d');
    const imageData = ctx.getImageData(0, 0, previewImage.width, previewImage.height);
    const data = imageData.data;

    // Calculate adjustment factor based on the selected exposure time
    const adjustmentFactor = value > 8 ? (value - 8) * 16 : -(8 - value) * 16;

    // Adjust pixel values based on the calculated adjustment factor
    for (let i = 0; i < data.length; i += 4) {
        data[i] += adjustmentFactor;       // Red channel
        data[i + 1] += adjustmentFactor;   // Green channel
        data[i + 2] += adjustmentFactor;   // Blue channel

        // Clamp pixel values to ensure they stay within the 0-255 range
        data[i] = Math.min(255, Math.max(0, data[i]));             // Red channel
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));     // Green channel
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));     // Blue channel
    }

    // Update the image data with the modified data
    ctx.putImageData(imageData, 0, 0);
}



// Function to convert an image to monochrome (black and white) and resize it
function convertToMonochromeAndResize(image, maxWidth, maxHeight) {
    // Create a new canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set the canvas dimensions to match the maximum size
    let width = image.width;
    let height = image.height;
    if (width > maxWidth || height > maxHeight) {
        let aspectRatio = width / height;
        if (aspectRatio > 1) {
            height = Math.round(maxWidth / aspectRatio);
            width = maxWidth;
        } else {
            width = Math.round(maxHeight * aspectRatio);
            height = maxHeight;
        }
    }
    canvas.width = width;
    canvas.height = height;

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0, width, height);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Loop through each pixel in the image and convert it to monochrome
    for (let i = 0; i < data.length; i += 4) {
        const luminance = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = luminance; // Red
        data[i + 1] = luminance; // Green
        data[i + 2] = luminance; // Blue
    }

    // Update the image data with the modified grayscale data
    ctx.putImageData(imageData, 0, 0);

    // Replace the original image with the monochrome image
    image.src = canvas.toDataURL();

    // Return the canvas containing the edited image
    return canvas;
}

// Function to trigger the download of the edited image
// Function to trigger the download of the edited image
// Function to trigger the download of the edited image
function downloadImage(canvas) {
    // Create a link element
    const link = document.createElement('a');
    
    // Convert the canvas to a data URL
    const imageDataURL = canvas.toDataURL('image/png');

    // Set the href attribute to the data URL
    link.href = imageDataURL;

    // Set the download attribute to specify the filename
    link.download = 'edited_image.png'; // Default filename

    // Trigger a click event on the link
    link.click();
}
// Wait for the DOM to be fully loaded before executing any code
document.addEventListener("DOMContentLoaded", function() {
    // Get reference to the image upload input and preview image elements
    // Get reference to the image upload input and preview image elements
    const imageUpload = document.getElementById("image-upload");
    const previewImage = document.getElementById("preview-image");
    const exposureTimeInput = document.getElementById("exposure-time");
    const monochromeButton = document.getElementById("monochrome-btn");
    const downloadButton = document.getElementById("save-btn");
    const safelightButton = document.getElementById("toggle-safelight-btn");
    const resetButton = document.getElementById("reset-btn");
    const body = document.body;
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");

// Set up event listener for image upload input
    imageUpload.addEventListener("change", function(event) {
        // Check if any file is selected
        if (event.target.files.length > 0) {
            // Get the selected file
            const file = event.target.files[0];
            // Create a FileReader object
            const reader = new FileReader();

            // Set up event listener for when file reading is complete
            reader.onload = function(event) {
                // Display the uploaded image on the webpage
                previewImage.src = event.target.result;

                // Store the original image data
                const img = new Image();
                img.onload = function() {
                    // Create a canvas to hold the original image
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                };
                img.src = event.target.result;
            };

            // Read the selected file as a data URL (for displaying images)
            reader.readAsDataURL(file);
        }
    });

    // Set up event listener for the monochrome button
    monochromeButton.addEventListener("click", function() {
        // Convert the preview image to monochrome and resize it
        convertToMonochromeAndResize(previewImage, 1000, 800); // Adjust maximum width and height as needed
    });

    // Set up event listener for the download button
    downloadButton.addEventListener("click", function() {
        // Get the edited canvas
        const editedCanvas = document.createElement('canvas');
        const ctx = editedCanvas.getContext('2d');
        editedCanvas.width = previewImage.width;
        editedCanvas.height = previewImage.height;
        ctx.drawImage(previewImage, 0, 0);
        // Trigger the download of the edited image
        downloadImage(editedCanvas);
    });

    // Set up event listener for exposure time input
    exposureTimeInput.addEventListener("input", function(event) {
        const exposureValue = parseInt(event.target.value);
        adjustExposureTime(exposureValue);
    });

    // Set up event listener for the safelight button
    safelightButton.addEventListener("click", function() {
        // Toggle the safelight effect by adding/removing a CSS class
        body.classList.toggle("safelight-on");
        header.classList.toggle("safelight-on");
        main.classList.toggle("safelight-on");
        footer.classList.toggle("safelight-on");
    });
    // Set up event listener for the reset button
    resetButton.addEventListener("click", function() {
    // Reset all adjustments made to the image
        resetAdjustments();
    });
});


// Function to reset all adjustments made to the image
function resetAdjustments() {
    const ctx = previewImage.getContext('2d');
    ctx.putImageData(originalImageData, 0, 0);
}