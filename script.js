document.addEventListener("DOMContentLoaded",()=>{
    const dropZone = document.querySelector("#dropZone");
    const fileInput = document.querySelector("#fileInput");
    const selectButton = document.querySelector("#selectButton");
    const originalImage = document.querySelector("#originalImage");
    const processedImage = document.querySelector("#processedImage");
    const removeBackgroundBtm = document.querySelector("#removeBackground");
    const download = document.querySelector("#download");
    const loading = document.querySelector(".loading");
    loading.style.display="none";


    //adding drag and drop feature 
    //dragover
    dropZone.addEventListener("dragover",(e)=>{
        e.preventDefault();
        dropZone.classList.add("dragover");
    })
    //dragleave
    dropZone.addEventListener("dragleave",()=>{
        dropZone.classList.remove("dragover");
    }) 
    //drop
    dropZone.addEventListener("drop",(e)=>{
        e.preventDefault();
        dropZone.classList.remove("dragover");
        const file =e.dataTransfer.files[0];
        if(file.type.startsWith('image/')){
            imagereder(file);
        }

        
    });
    //to read the file and display in browser window 
    function imagereder(file){
        const reader = new FileReader();

        reader.onload = (e)=>{
            console.log(e.target);
            originalImage.src=e.target.result;
            originalImage.hidden=false;
            removeBackgroundBtm.disabled=false;
        }
        reader.readAsDataURL(file);
        console.log(file);
    }

    //adding image through select button 
    selectButton.addEventListener("click",()=>{
        fileInput.click();
    })

    fileInput.addEventListener("change", (e)=>{
        const file=e.target.files[0];
        if(file.type.startsWith('image/')){
            imagereder(file);
        }
    })

    // Fetching API when button was clicked by user 
    removeBackgroundBtm.addEventListener('click', async()=>{
        loading.style.display ='flex';
        try {
            //formdata is an object to send the achual image to api 
            const formdata = new FormData();
            //blob stands for binary large object is an data object in js, used to store large binary datas of image, video etc they are imutable
            const blob = await fetch(originalImage.src).then((r)=>r.blob( ));

            //remove.bg API 
            // api key for remove.bg = uCYcicXfmk9AwAtXDNzCz5aw 
            formdata.append("size", "auto");
            formdata.append("image_file", blob);
            const response = await fetch(
                "https://api.remove.bg/v1.0/removebg",
                {
                    method:"POST",
                    headers: {  "X-Api-Key": "uCYcicXfmk9AwAtXDNzCz5aw" },
                    body: formdata,

                });

 
            //apyhub API     
            // const file1 = new File([blob], "test-image.png", { type: blob.type });
            // formdata.append("image",file1);    
            // const response = await fetch('https://api.apyhub.com/processor/image/remove-background/file?output=test-sample.png', {
            //     method: 'POST',
            //     headers: {
            //       'apy-token': 'APY0SgCKMCUVHbbXjnnjgXqHpsZANNtlJLlomfzTUq8Yied3ME2tGn6GT6qNJDB3',
            //     },
            //     body: formdata,
            //   });
                    const blob_response = await response.blob();
                    const url=URL.createObjectURL(blob_response);
                    processedImage.src=url;
                    processedImage.hidden = false;
                    download.disabled = false;
        } catch (error) { 
            console.log("Error in Processing image, Looks like sever is bussy. Please try later",error);

        }finally{
            loading.style.display='none';
        }

    })

    download.addEventListener("click",()=>{
        const link=document.createElement("a");
        link.href=processedImage.src;
        link.download = "processed_image.png";
        link.click();
    })




});