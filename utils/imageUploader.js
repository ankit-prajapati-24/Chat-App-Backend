const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder };
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }

        const base64ImageData = fs.readFileSync(file, { encoding: 'base64' });
        options.resource_type = "auto";

        return await cloudinary.uploader.upload(`data:image/png;base64,${base64ImageData}`, options);
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
}
