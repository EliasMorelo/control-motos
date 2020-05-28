const fs = require("fs");
const helper = {};

helper.guardarFoto = async (img) => {
  try {
    //funcion para convertir la imagen en base64 a un bufferImage
    function decodeBase64Image(dataString) {
      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      var response = {};

      if (matches.length !== 3) {
        return new Error("String invalido");
      }
      response.type = matches[1];
      response.data = new Buffer(matches[2], "base64");
      return response;
    }

    var imageTypeRegularExpression = /\/(.*?)$/;

    // Generamos un string sha1 que era el nombre de la imagens
    var crypto = require("crypto");
    var seed = crypto.randomBytes(20);
    var uniqueSHA1String = crypto.createHash("sha1").update(seed).digest("hex");

    var imageBuffer = decodeBase64Image(img);
    var userUploadedFeedMessagesLocation = "./src/public/img/uploads/";

    var uniqueRandomImageName = uniqueSHA1String;
    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);

    var userUploadedImagePath =
      userUploadedFeedMessagesLocation +
      uniqueRandomImageName +
      "." +
      imageTypeDetected[1];
    try {
      fs.writeFile(userUploadedImagePath, imageBuffer.data, function () {
        console.log("Imagen guardada en la ruta:", userUploadedImagePath);
      });

      return await userUploadedImagePath;
    } catch (error) {
      console.log("ERROR:", error);
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
};

module.exports = helper;
