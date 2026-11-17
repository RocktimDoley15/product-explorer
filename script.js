
// ==========================================
// PRODUCT EXPLORER - JAVASCRIPT
// ==========================================


// 1. API URL

const API_URL = "https://dummyjson.com/products?limit=100";


// 2. GET HTML ELEMENTS

const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

const resetButton = document.getElementById("resetButton");

const message = document.getElementById("message");

const noResults = document.getElementById("noResults");

const productModal = document.getElementById("productModal");

const closeModal = document.getElementById("closeModal");

const modalDetails = document.getElementById("modalDetails");


// 3. STORE PRODUCTS

let allProducts = [];


// 4. FETCH PRODUCTS FROM API

async function fetchProducts() {

    try {

        // Show loading message
        message.textContent = "Loading products...";

        message.className = "";

        message.classList.remove("hidden");

        productContainer.innerHTML = "";

        noResults.classList.add("hidden");


        // Send GET request to API
        const response = await fetch(API_URL);


        // Check whether request was successful
        if (!response.ok) {

            throw new Error("Failed to fetch products. Please try again.");

        }


        // Convert response into JSON
        const data = await response.json();


        // Store products in array
        allProducts = data.products;


        // Check if products are available
        if (!allProducts || allProducts.length === 0) {

            throw new Error("No products available.");

        }


        // Create category options
        loadCategories();


        // Display all products
        displayProducts(allProducts);


        // Show success message
        message.textContent = `Successfully loaded ${allProducts.length} products.`;

        message.className = "success-message";

    }

    catch (error) {

        // Handle API or network errors
        message.textContent = error.message;

        message.className = "error-message";

        productContainer.innerHTML = "";

        noResults.classList.add("hidden");

        console.error("Error:", error);

    }

}


// 5. LOAD CATEGORIES INTO SELECT MENU

function loadCategories() {

    // Get unique categories from products
    const categories = [
        ...new Set(allProducts.map(product => product.category))
    ];


    // Clear previous options
    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
    `;


    // Add each category to dropdown
    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


// 6. DISPLAY PRODUCTS

function displayProducts(products) {

    // Clear previous product cards
    productContainer.innerHTML = "";


    // Check whether any products match
    if (products.length === 0) {

        noResults.classList.remove("hidden");

        message.textContent = "No products match your search.";

        message.className = "";

        return;

    }


    // Hide no-results message
    noResults.classList.add("hidden");


    // Create a card for each product
    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <img
                src="${product.thumbnail}"
                alt="${escapeHTML(product.title)}"
                class="product-image"
            >

            <div class="product-info">

                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>

                <h3 class="product-title">
                    ${escapeHTML(product.title)}
                </h3>

                <p class="product-price">
                    $${product.price}
                </p>

                <p class="product-rating">
                    ★ ${product.rating} / 5
                </p>

                <button
                    class="details-btn"
                    type="button"
                    data-id="${product.id}"
                >
                    View Details
                </button>

            </div>

        `;


        // Add card to product container
        productContainer.appendChild(card);

    });


    // Show number of displayed products
    message.textContent = `Showing ${products.length} products.`;

    message.className = "";

}


// 7. SEARCH PRODUCTS BY TITLE

function searchProducts() {

    const searchText = searchInput.value.toLowerCase().trim();

    const selectedCategory = categoryFilter.value;


    // Filter products by title and category
    const filteredProducts = allProducts.filter(product => {

        const matchesSearch = product.title
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });


    // Display filtered products
    displayProducts(filteredProducts);

}


// 8. RESET SEARCH AND FILTER

function resetFilters() {

    // Clear search input
    searchInput.value = "";


    // Select all categories
    categoryFilter.value = "all";


    // Display all products again
    displayProducts(allProducts);

}


// 9. SHOW PRODUCT DETAILS IN MODAL

function showProductDetails(productId) {

    // Find selected product
    const product = allProducts.find(
        item => item.id === Number(productId)
    );


    // Stop if product is not found
    if (!product) {

        return;

    }


    // Add product information to modal
    modalDetails.innerHTML = `

        <img
            src="${product.thumbnail}"
            alt="${escapeHTML(product.title)}"
        >

        <h2>${escapeHTML(product.title)}</h2>

        <p>
            <strong>Category:</strong>
            ${escapeHTML(product.category)}
        </p>

        <p>
            <strong>Price:</strong>
            $${product.price}
        </p>

        <p>
            <strong>Rating:</strong>
            ★ ${product.rating} / 5
        </p>

        <p>
            <strong>Brand:</strong>
            ${escapeHTML(product.brand || "Not available")}
        </p>

        <p>
            <strong>Stock:</strong>
            ${product.stock}
        </p>

        <p>
            <strong>Description:</strong>
            ${escapeHTML(product.description)}
        </p>

    `;


    // Display modal
    productModal.classList.remove("hidden");

}


// 10. CLOSE PRODUCT DETAILS MODAL

function hideModal() {

    productModal.classList.add("hidden");

}


// 11. ESCAPE HTML SPECIAL CHARACTERS

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[character];

    });

}


// 12. EVENT LISTENERS


// Search while typing
searchInput.addEventListener("input", searchProducts);


// Filter when category changes
categoryFilter.addEventListener("change", searchProducts);


// Reset button
resetButton.addEventListener("click", resetFilters);


// View Details button using event delegation
productContainer.addEventListener("click", function(event) {

    const button = event.target.closest(".details-btn");

    if (button) {

        const productId = button.dataset.id;

        showProductDetails(productId);

    }

});


// Close modal using close button
closeModal.addEventListener("click", hideModal);


// Close modal by clicking outside
productModal.addEventListener("click", function(event) {

    if (event.target === productModal) {

        hideModal();

    }

});


// Close modal using Escape key
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        hideModal();

    }

});


// 13. START APPLICATION

fetchProducts();
