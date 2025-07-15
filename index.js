let prompt = document.querySelector("#prompt");
let submit = document.querySelector("#submit");
let chatcontainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let imageip = document.querySelector("#image input");
let image = document.querySelector("#image img");

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAutLdupG2AM72BXJUZ02OYSsj3ZjlNkhs";
let user={
    message:null,
    file:{
       mime_type: null,
            data: null
    }
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let parts = [{ text: user.message }];
    if (user.file.data) {
        parts.push({ inline_data: user.file });
    }

    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts }]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        console.log("Raw response status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        let data = await response.json();
        console.log("Full API Response: ", data);

        if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0].text
        ) {
            let apiresponse = data.candidates[0].content.parts[0].text.trim();
            text.innerHTML = apiresponse;
        } else {
            text.innerHTML = "❌ No response from AI or structure issue.";
        }
    } catch (error) {
        console.log("Error in generateResponse:", error);
        text.innerHTML = "⚠️ Error fetching response.";
    } finally {
        chatcontainer.scrollTo({ top: chatcontainer.scrollHeight, behavior: "smooth" });
        image.src = `img.svg`;
        image.classList.remove("choose");
        user.file = { mime_type: null, data: null }; // reset file
    }
}

// async function generateResponse(aiChatBox){
//     let text = aiChatBox.querySelector(".ai-chat-area")
//     let RequestOption={
//         method:"POST",
//         headers:{'Content-Type' : 'application/json'} ,
//         body:JSON.stringify({
              
//     "contents": [
//       {
//         "parts": [
//           {
//             "text": user.message,
          
//           },
//           (
//             user.file.data?[{"inline_data":user.file}]:[])
//           )
         
//         ]
//       }
//     ]
  
//         })
//     }
//     try{
//  let response = await fetch(Api_Url,RequestOption);
//  let data = await response.json()
//  let apiresponse = data.candidates[0].content.parts[0].text.replace().trim()
//       console.log(apiresponse);
//       text.innerHTML = apiresponse;
//     }
//    catch(error){
//     console.log(error);
//    }
//    finally{
//          chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behavior:smooth});
//      image.src= `img.svg`
//           image.classList.remove("choose");
//    }
// }
function createChatBox(html, classes){
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}
function handlechatResponse(usermessage){
    user.message = usermessage;
    let html = ` <img src="user.jpg" alt="user" id="userImage" width="8%">
        <div class="user-chat-area">
        ${user.message}
        ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.
          file.data}" class="chooseimg" />` : ""
        }
        </div>`
       prompt.value= "";
       // because it got erased as user enters the prompt field should get empty
   let userchatbox = createChatBox(html,"user-chat-box") ;
   chatcontainer.appendChild(userchatbox);

    chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behavior: "smooth"});
    

   setTimeout(()=>{
    let html =` <img src="aichatbot.png" alt="ai" id="aiImage" width="10%">
         <div class="ai-chat-area">
           <img src="loading-gif.gif" alt="loading" class="load" width="50px">
        </div>`
       
          let aichatbox = createChatBox(html,"ai-chat-box") ;
   chatcontainer.appendChild(aichatbox);
   generateResponse(aichatbox);
},600);
}
submit.addEventListener("click" , ()=>{
    handlechatResponse(prompt.value);
})
prompt.addEventListener("keydown",(e)=>{
//   console.log(e.target);
//     console.log(e);
      if(e.key=="Enter"){
        handlechatResponse(prompt.value);
        /// this function will write my prompt into user chat area 
      }
})
imageip.addEventListener("change",()=>{
    const file = imageip.files[0]
    if(!file)
        return;
    let reader = new FileReader()
    reader.onload=(e)=>{
        //  console.log(e);
        let base64string = e.target.result.split(",")[1];
           user.file={
       mime_type: file.type,
            data: base64string
    }
    image.src= `data:${user.file.mime_type};base64,${user.
          file.data}`
          image.classList.add("choose")
    }
    
    
    reader.readAsDataURL(file)
})
imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click();
})

