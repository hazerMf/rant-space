const backendURL = "https://rant-space-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const backendURL = "http://localhost:3000"; // Use Render URL when deployed
    const postsContainer = document.getElementById("posts");
    const passwordInput = document.getElementById("passwordInput");

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
                loadPosts(); // Refresh posts
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
                loadPosts(); // Refresh posts
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }

    loadPosts();
});
