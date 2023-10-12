function myFunction() {
    document.getElementById("ic_1").classList.toggle("fa-thumbs-down");
  }
/*  - project : ==>  image editor webApp using Javascript and opencv
    - file : ==> script.js
    - programmer : ==> AUBAI ALKHABBAZ
                                */
//_______________________________________________________
const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const previewImg = document.querySelector(".preview-img img"); 
const chooseImgBtn = document.querySelector(".choose-img");
const rotateOptions  = document.querySelectorAll(".rotate button");
const resetFilterBtn = document.querySelector(".reset-filter");
const saveImgBtn = document.querySelector(".save-img");
const cannyBtn = document.getElementById("canny");
// ______________________________________________________


//--------------------------------------------------

// Global var 
let brightness = 100,sturation =100,inversion = 0,grayscale = 0;
let rotate = 0;
let flipHorizontal =1;
let flipVertical = 1;
//______________________________________________________

// applay value in  applyFilter function (CSS => previewImg.style) rotate/flip/brightness/saturation/inversion/grayscale
const applyFilters = ()=>{
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
    
}

/*const visibaleImg = ()=>{
    //let elementImgSrc = document.getElementById("NormImg");
    let elementImgCanvas = document.getElementById("output");
    elementImgCanvas.style.visibility='visible';
    //let hiddenSrc = elementImgSrc.getAttribute("hidden");
    let hiddenCanvas = elementImgCanvas.getAttribute("hidden");
    elementImgCanvas.removeAttribute("hidden");
    

}*/
 //function to Apply Canny Edage detection  on image
const applyCanny =  ()=>{

    document.getElementById("inputBar").style.visibility = "hidden";
    document.getElementById("nameN").style.visibility = "hidden";
    let src = cv.imread(previewImg);
    let dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    cv.Canny(src, dst, 50, 100, 3, false);
    cv.imshow('output', dst);
    src.delete(); dst.delete();
 
}
const imgVisb = ()=>{
    let previewImg = document.createElement("img");
    previewImg.id = 'NormImg';
    previewImg.src="image-placeholder.svg";
    previewImg.alt ="preview-img";
    document.getElementById('imgAdd').appendChild(previewImg);
    const element = document.getElementById("output");
    element.remove(); // Removes the  Canvas
    
}
 //function to Apply Harrcascade to detect face on image
const HaarCascade = ()=>{
   
    document.getElementById("inputBar").style.visibility = "hidden";
    document.getElementById("nameN").style.visibility = "hidden";
    let src = cv.imread(previewImg);
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    let faces = new cv.RectVector();
    let eyes = new cv.RectVector();
    let faceCascade = new cv.CascadeClassifier();
    let eyeCascade = new cv.CascadeClassifier();
    // load pre-trained classifiers
    faceCascade.load('haarcascade_frontalface_default.xml');
    eyeCascade.load('haarcascade_eye.xml');
    // detect faces
    let msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
    for (let i = 0; i < faces.size(); ++i) {
        let roiGray = gray.roi(faces.get(i));
        let roiSrc = src.roi(faces.get(i));
        let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
        let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                                faces.get(i).y + faces.get(i).height);
    cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        // detect eyes in face ROI
    eyeCascade.detectMultiScale(roiGray, eyes);
    for (let j = 0; j < eyes.size(); ++j) {
        let point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
        let point2 = new cv.Point(eyes.get(j).x + eyes.get(j).width,
                                  eyes.get(j).y + eyes.get(j).height);
        cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
    }
    roiGray.delete(); roiSrc.delete();
}
    cv.imshow('output', src);
    src.delete(); gray.delete(); faceCascade.delete();
    eyeCascade.delete(); faces.delete(); eyes.delete();
}
const lablas =()=>{
    document.getElementById("inputBar").style.visibility = "hidden";
    document.getElementById("nameN").style.visibility = "hidden";
    let src = cv.imread(previewImg);
    let dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    // You can try more different parameters
    cv.Laplacian(src, dst, cv.CV_8U, 1, 1, 0, cv.BORDER_DEFAULT);
    cv.imshow('output', dst);
    src.delete(); dst.delete();
}
//function to Apply sobel filter on image
const sobelFilter = ()=>{
    document.getElementById("nameN").style.visibility = "hidden";
    document.getElementById("inputBar").style.visibility = "hidden";
    let src = cv.imread(previewImg);
    let dstx = new cv.Mat();
    let dsty = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    // You can try more different parameters
    cv.Sobel(src, dstx, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
    cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
    // cv.Scharr(src, dstx, cv.CV_8U, 1, 0, 1, 0, cv.BORDER_DEFAULT);
    // cv.Scharr(src, dsty, cv.CV_8U, 0, 1, 1, 0, cv.BORDER_DEFAULT);
    /*setInterval(function(){ 
        // toggle the imshow every 2 second
        cv.imshow('output', dstx);  
        setTimeout(function(){
          // toggle back after 2 second
          cv.imshow('output', dsty);  
        },2000)
     
     },2000);*/
    cv.imshow('output', dstx);
    cv.imshow('output', dsty);
    setTimeout(() => {
        console.log("sobel dx and dy")
      }, 1000);
    src.delete(); dstx.delete(); dsty.delete();
}
// function for image classification by mobileNet 
const CNNClassify = ()=>{
    const imgClass = document.getElementById("NormImg");
    mobilenet.load().then(model =>{
        //Classify the image
        model.classify(imgClass).then(predictions=>{
            
            
            //console.log('predictions :');
            //console.log(predictions);
            //document.getElementById("nameN").innerHTML=`${predictions[0]}`//return object object Array[object{},object{},object{}]
            
            /*for(let key in predictions) {
                console.log(key + ":", predictions[key]);
            }*/ 
            //console.log(key,':', value)
            //predictions.forEach((obj) => Object.entries(obj).forEach(([key, value]) => console.log(key,':', value)) );
            document.getElementById("nameN").innerHTML = `C:${predictions[0].className},\nC:${predictions[1].className},\nC:${predictions[2].className}\n`;
            document.getElementById("valueV").innerHTML = `P:${parseInt(100*(predictions[0].probability))+'%'},\nP:${parseInt(100*(predictions[1].probability))+'%'},\nP:${parseInt(100*(predictions[2].probability))+'%'}\n`;
            for (const key in predictions[0]) {

                console.log(`${key}: ${predictions[0][key]}`);
            }
            for (const key in predictions[1]) {

                console.log(`${key}: ${predictions[1][key]}`);
            }
            for (const key in predictions[2]) {
                console.log(`${key}: ${predictions[2][key]}`);
            }
            

        });
    });

}
// Image InRange Example opencv
const imageInrange = ()=>{

    document.getElementById("inputBar").style.visibility = "hidden";
    const result = document.getElementById('nameN');
    result.innerText = "in range";
    //document.getElementById("nameN").style.visibility = "hidden";
    let src = cv.imread(previewImg);
    let dst = new cv.Mat();
    let low = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
    let high = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
    // You can try more different parameters
    cv.inRange(src, low, high, dst);
    cv.imshow('output', dst);
    src.delete(); dst.delete(); low.delete(); high.delete();

}
// function to load image using canvas 
const loadImage = ()=>{
    let file = fileInput.files[0]; // getting user selected file
    if(!file) return; // return nothing if user hasn't selected file
    //console.log(file);
    previewImg.src =URL.createObjectURL(file);// passing file url as preview img src



    previewImg.addEventListener("load",()=>{
        resetFilterBtn.click();// clicking reset btn , so the filter value reset if the user select new img
        document.querySelector(".container").classList.remove("disable");
    });
};
const enableBarName =()=>{
    document.getElementById("inputBar").style.visibility = "visible";
    document.getElementById("nameN").style.visibility = "visible";
}
// function to get btn 
filterOptions.forEach(Option =>{
    Option.addEventListener("click",()=>{ // adding click event listener to all filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        Option.classList.add("active");
        filterName.innerHTML= Option.innerHTML;
        const selectedFilter = document.querySelector(".filter .active")
        console.log(selectedFilter);
        if(Option.id === 'brightness'){
            enableBarName();
            filterSlider.max ="200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }
        else if(Option.id === 'saturation') {
            enableBarName();
            filterSlider.max ="200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;

        }
        else if(Option.id === 'inversion'){
            enableBarName();
            filterSlider.max ="100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }
        else if (Option.id === 'grayscale') {
            enableBarName();
            filterSlider.max ="100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
        else{
            console.log("none");
        }
    });
});

const updateFilter = ()=>{
    //console.log(filterSlider.value);
    filterValue.innerHTML = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); // getting selected filter btn
    if(selectedFilter.id ==="brightness"){
        // if selected filter is brightness , pass the slider value as brightness value
        brightness = filterSlider.value;
    }
    
    else if (selectedFilter.id ==="saturation"){
        saturation = filterSlider.value;
    }
    else if(selectedFilter.id ==="inversion"){
        inversion = filterSlider.value;
    }
    else if (selectedFilter.id ==="grayscale"){
        grayscale = filterSlider.value;
    }
    else if (selectedFilter.id ==="Canny"){
        console.log("none");
    }
    applyFilters();

};

rotateOptions.forEach(Option =>{
    Option.addEventListener("click",()=>{ // adding click event listener to all rotate/flip buttons
        console.log(Option);
        if(Option.id === 'left'){
            rotate -= 90; // if clicked btn is left rotate ,decrement rotate value by -90

        }
        else if (Option.id === 'right'){
            rotate += 90;  // if clicked btn is right rotate ,increment rotate value by +90
        }
        else if (Option.id === 'horizontal'){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1 ; // if flipHorizontal value is 1 , set this value to -1 else set 1
        }
        else {
            flipVertical = flipVertical === 1 ? -1 : 1 ; // if flipVertical value is 1 , set this value to -1 else set 1
        }
        applyFilters();
    });
});

const resetFilter = ()=>{
    //resetting all variable value to its default value
    brightness = 100,saturation =100,inversion = 0,grayscale = 0;
    rotate = 0;
    flipHorizontal =1;
    flipVertical = 1;
    applyFilters();
}
const saveImage = ()=>{
    //console.log("save image btn clicked !");
    const canvas = document.createElement("canvas") // creating canvas element
    const ctx = canvas.getContext("2d"); // canvas.getContext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth;// setting canvas width to actual image widght
    canvas.height = previewImg.naturalHeight;// setting canvas height to actual image height
    
    // applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
    ctx.translate(canvas.width / 2,canvas.height / 2)// translate canvas from center
    if(rotate !== 0){
        //if rotate value isn't 0 , rotate the canvas
        ctx.rotate(rotate * Math.PI / 180 );
    }
    ctx.scale(flipHorizontal,flipVertical); //flip canvas(flipHorizontal,flipVertical)
    ctx.drawImage(previewImg,-canvas.width / 2 ,-canvas.height / 2 ,canvas.width,canvas.height);
    //document.body.appendChild(canvas);
    const link = document.createElement("a");// creating <a> element
    link.download = "image.jpg";// passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL();// passing <a> tag href value to canvas data URL
    link.click();// clicking <a> tag so the image download

}
//_______________________________________________________
fileInput.addEventListener("change",loadImage);
filterSlider.addEventListener("input",updateFilter);
resetFilterBtn.addEventListener("click",resetFilter);
saveImgBtn.addEventListener("click",saveImage);
chooseImgBtn.addEventListener("click",()=> fileInput.click());
//_______________________________________________________

//$$$$$$------------------END----------------------$$$$$$
