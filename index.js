let prompt = document.querySelector("#prompt");
let submit = document.querySelector("#submit");
let chatcontainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let imageip = document.querySelector("#image input");
let image = document.querySelector("#image img");

// ✅ Replace with your Gemini API key
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAutLdupG2AM72BXJUZ02OYSsj3ZjlNkhs";

// ✅ Holds user message and file
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

// ✅ Handles generating the AI response using fetch
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let parts = [{ text: user.message }];
    if (user.file.data) {
        parts.push({
            inline_data: {
                mime_type: user.file.mime_type,
                data: user.file.data
            }
        });
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
            text.innerHTML = "❌ No response from AI or response structure issue.";
        }
    } catch (error) {
        console.error("Error in generateResponse:", error);
        text.innerHTML = "⚠️ Error fetching response.";
    } finally {
        chatcontainer.scrollTo({ top: chatcontainer.scrollHeight, behavior: "smooth" });
        image.src = `img.svg`;
        image.classList.remove("choose");
        user.file = { mime_type: null, data: null }; // ✅ Reset file input
    }
}

// ✅ Helper function to create a chat message element
function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

// ✅ Handles user input and creates both user and AI chat boxes
function handlechatResponse(usermessage) {
    if (!usermessage.trim()) return; // ✅ Prevent empty input

    user.message = usermessage;

    // ✅ User chat box
    let html = `
        <img src="user.jpg" alt="user" id="userImage" width="8%">
        <div class="user-chat-area">
            ${user.message}
            ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
        </div>`;
    
    prompt.value = ""; // ✅ Clear input box
    let userchatbox = createChatBox(html, "user-chat-box");
    chatcontainer.appendChild(userchatbox);
    chatcontainer.scrollTo({ top: chatcontainer.scrollHeight, behavior: "smooth" });

    // ✅ AI chat box placeholder
    setTimeout(() => {
        let html = `
            <img src="aichatbot.png" alt="ai" id="aiImage" width="10%">
            <div class="ai-chat-area">
                <img src="loading-gif.gif" alt="loading" class="load" width="50px">
            </div>`;
        
        let aichatbox = createChatBox(html, "ai-chat-box");
        chatcontainer.appendChild(aichatbox);

        generateResponse(aichatbox); // ✅ Get Gemini AI response
    }, 600);
}

// ✅ Button click listener
submit.addEventListener("click", () => {
    handlechatResponse(prompt.value);
});

// ✅ Enter key listener
prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent form reload
        handlechatResponse(prompt.value);
    }
});

// ✅ Image selection
imageip.addEventListener("change", () => {
    const file = imageip.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("choose");
    };

    reader.readAsDataURL(file);
});

// ✅ Click on image icon opens file selector
imagebtn.addEventListener("click", () => {
    imageip.click();
});


