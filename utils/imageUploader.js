const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async(file,folder,height,quality) =>{
    
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    const base64ImageData = await RNFetchBlob.fs.readFile(imageUri, 'base64');
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(base64ImageData,options);
}