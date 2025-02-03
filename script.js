const backendURL = "https://rant-space-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const postModeBtn = document.getElementById("postModeBtn");
    const passwordPrompt = document.getElementById("passwordPrompt");
    const checkPasswordBtn = document.getElementById("checkPassword");
    const passwordInput = document.getElementById("passwordInput");
    const postFormContainer = document.getElementById("postFormContainer");
    const logoutBtn = document.getElementById("logout");
    const submitPostBtn = document.getElementById("submitPost");
    const postTitleInput = document.getElementById("postTitle");
    const postContentInput = document.getElementById("postContent");
    const postsContainer = document.getElementById("posts");

    let isPostMode = false;

    // Load posts from backend
    async function loadPosts() {
        try {
            const response = await fetch(`${backendURL}/posts`);
            const posts = await response.json();
            postsContainer.innerHTML = "";

            posts.forEach(post => {
                const article = document.createElement("article");
                article.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                postsContainer.appendChild(article);
            });
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }

    loadPosts();

    postModeBtn.addEventListener("click", () => {
        passwordPrompt.classList.remove("hidden");
    });

    checkPasswordBtn.addEventListener("click", () => {
        postFormContainer.classList.remove("hidden");
        passwordPrompt.classList.add("hidden");
        isPostMode = true;
    });

    submitPostBtn.addEventListener("click", async () => {
        if (!isPostMode) return;

        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();
        const password = passwordInput.value.trim();

        if (title === "" || content === "") {
            alert("Title and content cannot be empty!");
            return;
        }

        try {
            const response = await fetch(`${backendURL}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, title, content }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                postTitleInput.value = "";
                postContentInput.value = "";
                loadPosts();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error posting:", error);
        }
    });

    logoutBtn.addEventListener("click", () => {
        postFormContainer.classList.add("hidden");
        isPostMode = false;
    });
});
