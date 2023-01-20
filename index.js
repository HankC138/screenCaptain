const electron = require('electron');
const path = require('path');
const fs = require('fs');

export const saveScreenCap = (captureData)=>{
    // const pathOnCapture = path("/Users/corbincampbell/Desktop/screenCaps")
    // fs.writeFile("/Users/corbincampbell/Desktop/screenCaps", )

    const readyData = captureData.replace(/^data:image\/\w+;base64,/, "");
const dataBuffer = Buffer.from(readyData, 'base64');
fs.writeFile('image.png', dataBuffer);
}
// "/Users/corbincampbell/Desktop/screenCaps"