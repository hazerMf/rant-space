const backendURL = "https://rant-space-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const postModeTgg = document.getElementById("postModeTgg");
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
                article.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                `;
                postsContainer.appendChild(article);
            });
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }

    // Load posts from backend with edit/delete button
    async function loadPostsED() {
        try {
            const response = await fetch(`${backendURL}/posts`);
            const posts = await response.json();
            postsContainer.innerHTML = "";

            posts.forEach(post => {
                const article = document.createElement("article");
                article.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <button onclick="editPost('${post.id}')">Edit</button>
                    <button onclick="deletePost('${post.id}')">Delete</button>
                `;
                postsContainer.appendChild(article);
            });
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }

    // Edit Post
    async function editPost(postId) {
        const newTitle = prompt("Enter new title:");
        const newContent = prompt("Enter new content:");

        if (!newTitle || !newContent) return;

        const password = passwordInput.value.trim();
        
        try {
            const response = await fetch(`${backendURL}/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, title: newTitle, content: newContent }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                loadPostsED(); // Refresh posts
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    }

    // Delete Post
    async function deletePost(postId) {
        const password = passwordInput.value.trim();
        
        if (!password) {
            alert("Password is required to delete a post.");
            return;
        }

        try {
            const response = await fetch(`${backendURL}/posts/${postId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                loadPostsED(); // Refresh posts
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }

    // Toggle Post Mode (Show Password Input)
    postModeTgg.addEventListener("click", function() {
        if (postModeTgg.checked) {
            passwordPrompt.hidden = false; // Show password prompt
        } else {
            passwordPrompt.hidden = true; // Hide password prompt
            postFormContainer.hidden = true; // Hide post form
            isPostMode = false;
        }
    });

    checkPasswordBtn.addEventListener("click", () => {
        const password = passwordInput.value.trim();

        if (password === "") {
            alert("Please enter a password.");
            return;
        }

        postFormContainer.hidden = false; // Show post form
        passwordPrompt.hidden = true; // Hide password prompt
        isPostMode = true;
        loadPostsED();
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
                loadPostsED();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error posting:", error);
        }
    });

    // Logout (Hide Post Form)
    logoutBtn.addEventListener("click", () => {
        postFormContainer.hidden = true;
        postModeTgg.checked = false;
        isPostMode = false;
    });

    loadPosts(); // Load posts on page load
});

