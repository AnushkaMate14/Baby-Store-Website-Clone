/* =====================================================
   NEWSLETTER FORM
===================================================== */

const newsletterForm =
    document.querySelector("#newsletterForm");

if (newsletterForm) {

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        newsletterForm.classList.add("d-none");

        const successMessage =
            document.querySelector("#newsletterSuccess");

        if (successMessage) {
            successMessage.classList.remove("d-none");
        }

    });

}



/* =====================================================
   ABOUT PAGE COUNTERS
===================================================== */

const counters =
    document.querySelectorAll(".about-counter");

counters.forEach((counter) => {

    const target =
        parseInt(counter.dataset.target);

    let count = 0;

    const updateCounter = () => {

        if (count < target) {

            count += Math.ceil(target / 100);

            if (count > target) {
                count = target;
            }

            if (counter.dataset.target === "100") {
                counter.innerText = count + "K+";
            } else {
                counter.innerText = count;
            }

            setTimeout(updateCounter, 20);
        }

    };

    updateCounter();

});



/* =====================================================
   CONTACT FORM
===================================================== */

const contactForm =
    document.querySelector("#contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        contactForm.classList.add("d-none");

        const successMessage =
            document.querySelector(".contact-success");

        if (successMessage) {
            successMessage.classList.remove("d-none");
        }

    });

}



/* =====================================================
   SHOP PAGE
===================================================== */

const productGrid =
    document.querySelector("#productGrid");

const filterSearch =
    document.querySelector("#filterSearch");

const minPrice =
    document.querySelector("#minPrice");

const maxPrice =
    document.querySelector("#maxPrice");

const minPriceValue =
    document.querySelector("#minPriceValue");

const maxPriceValue =
    document.querySelector("#maxPriceValue");

const resultCount =
    document.querySelector("#resultCount");

const sortProducts =
    document.querySelector("#sortProducts");


/* =====================================================
   SHOP VARIABLES
===================================================== */

let allProducts = [];

let selectedCategory = "";

let currentPage = 1;

const productsPerPage = 9;


/* =====================================================
   CART VARIABLES
===================================================== */

/* ADDED */

let cartItems =
    JSON.parse(localStorage.getItem("babyStoreCart")) || [];



/* =====================================================
   SAVE CART
===================================================== */

/* ADDED */

function saveCart() {

    localStorage.setItem(
        "babyStoreCart",
        JSON.stringify(cartItems)
    );

}



/* =====================================================
   LOAD PRODUCTS FROM JSON
===================================================== */

async function loadProducts() {

    try {

        const response =
            await fetch("Shop.json");

        if (!response.ok) {
            throw new Error("Shop.json not found");
        }

        const data =
            await response.json();

        allProducts =
            data.products;

        if (productGrid) {
            displayProducts();
        } else {
            addProductEvents();
        }

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}


/* =====================================================
   CREATE PRODUCT CARD
===================================================== */

function createProductCard(product) {

    return `
        <div
            class="col product-item"
            data-name="${product.name}"
            data-category="${product.category}"
            data-price="${product.price}"
        >

            <div
                class="product-card"
                data-product-id="${product.id}"
            >

                <div class="product-image-wrap">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="img-fluid"
                    >

                    <div class="product-actions" aria-label="Product actions">

                        <button
                            type="button"
                            class="product-action add-to-cart"
                            data-tooltip="Add to cart"
                            data-product="${product.name}"
                            aria-label="Add ${product.name} to cart"
                        >
                            <i class="bi bi-basket"></i>
                        </button>

                        <button
                            type="button"
                            class="product-action quick-view"
                            data-tooltip="Quick View"
                            data-product="${product.name}"
                            aria-label="Quick view ${product.name}"
                        >
                            <i class="bi bi-eye-fill"></i>
                        </button>

                    </div>

                </div>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-price">
                    $${product.price.toFixed(2)}
                </p>

            </div>

        </div>
    `;

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayProducts() {

    const searchText =
        filterSearch
            ? filterSearch.value.toLowerCase().trim()
            : "";

    const min =
        minPrice
            ? Number(minPrice.value)
            : 4;

    const max =
        maxPrice
            ? Number(maxPrice.value)
            : 41;


    const matchingProducts =
    allProducts.filter((product) => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(searchText);

        const matchesCategory =
            selectedCategory === "" ||
            product.category === selectedCategory;

        const matchesPrice =
            product.price >= min &&
            product.price <= max;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice
        );

    });

    const sortValue =
        sortProducts
            ? sortProducts.value
            : "latest";


    if (sortValue === "latest") {

        matchingProducts.sort((a, b) => {
            return b.id - a.id;
        });

    }


    if (sortValue === "price-low") {

        matchingProducts.sort((a, b) => {
            return a.price - b.price;
        });

    }


    if (sortValue === "price-high") {

        matchingProducts.sort((a, b) => {
            return b.price - a.price;
        });

    }


    showProducts(matchingProducts);

}


/* =====================================================
   SORT PRODUCTS
===================================================== */

if (sortProducts) {

    sortProducts.addEventListener(
        "change",
        function () {

            currentPage = 1;

            displayProducts();

        }
    );

}


/* =====================================================
   SHOW PRODUCTS
===================================================== */

function showProducts(products) {

    if (!productGrid) {
        return;
    }


    const totalProducts =
        products.length;

    const totalPages =
        Math.ceil(
            totalProducts / productsPerPage
        );


    if (
        currentPage > totalPages &&
        totalPages > 0
    ) {

        currentPage = totalPages;

    }


    if (totalProducts === 0) {

        productGrid.innerHTML = "";

        if (resultCount) {

            resultCount.textContent =
                "Showing 0 results";

        }

        updatePagination(0);

        return;

    }


    const start =
        (currentPage - 1) *
        productsPerPage;

    const end =
        start + productsPerPage;


    const visibleProducts =
        products.slice(start, end);


    productGrid.innerHTML =
        visibleProducts
            .map(createProductCard)
            .join("");


    if (resultCount) {

        const showingStart =
            start + 1;

        const showingEnd =
            Math.min(
                end,
                totalProducts
            );

        resultCount.textContent =
            `Showing ${showingStart}–${showingEnd} of ${totalProducts} results`;

    }


    updatePagination(totalPages);

    addProductEvents();

}

function openProductDetails(productId) {

    if (!productId) {
        return;
    }

    window.location.href =
        `ProductDetails.html?id=${productId}`;

}

/* =====================================================
   PRODUCT BUTTON EVENTS
===================================================== */

function addProductEvents() {

    document
        .querySelectorAll(".product-card")
        .forEach((card) => {

            card.addEventListener("click", function (event) {

                if (event.target.closest(".product-action")) {
                    return;
                }

                const productId =
                    this.getAttribute("data-product-id");

                if (!productId) {
                    console.log("Product ID missing");
                    return;
                }

                console.log("Opening product:", productId);

                window.location.href =
                    "ProductDetails.html?id=" + productId;

            });

        });


    document
        .querySelectorAll(".add-to-cart")
        .forEach((button) => {

            button.addEventListener("click", function () {

                const productName =
                    this.dataset.product;

                const product =
                    allProducts.find(
                        (item) =>
                            item.name === productName
                    );

                if (!product) {
                    return;
                }

                const existingItem =
                    cartItems.find(
                        (item) =>
                            item.id === product.id
                    );

                if (existingItem) {

                    existingItem.quantity++;

                } else {

                    cartItems.push({
                        ...product,
                        quantity: 1
                    });

                }

                saveCart();

                updateCart();

                updateCartPage();

                openCart();

            });

        });


    document
    .querySelectorAll(".quick-view")
    .forEach((button) => {

        button.addEventListener("click", function () {

            const product =
                allProducts.find(
                    (item) =>
                        item.name === this.dataset.product
                );

            if (!product) {
                return;
            }

            let modal =
                document.querySelector("#quickViewModal");

            if (!modal) {

                modal = document.createElement("div");

                modal.id = "quickViewModal";
                modal.className = "quick-view-modal";

                document.body.appendChild(modal);

            }

            modal.innerHTML = `

                <div class="quick-view-overlay">

                    <div class="quick-view-box">

                        <button
                            type="button"
                            class="quick-view-close"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <div class="row g-0 h-100">

                            <div class="col-lg-6 quick-view-image-column">

                                <img
                                    src="${product.image}"
                                    alt="${product.name}"
                                    class="quick-view-image"
                                >

                            </div>

                            <div class="col-lg-6 quick-view-content">

                                <p class="quick-view-category">
                                    ${product.category}
                                </p>

                                <h2 class="quick-view-title">
                                    ${product.name}
                                </h2>

                                <div class="quick-view-price-row">

                                    <span class="quick-view-price">
                                        $${product.price.toFixed(2)}
                                    </span>

                                    <span class="quick-view-shipping">
                                        Free Shipping
                                    </span>

                                </div>

                                <p class="quick-view-description">
                                    Discover our carefully selected
                                    ${product.category.toLowerCase()}
                                    product, designed with comfort,
                                    quality and style in mind.
                                </p>

                                <div class="quick-view-line"></div>

                                <div class="quick-view-actions">

                                    <div class="quick-view-quantity">

                                        <button
                                            type="button"
                                            class="quick-quantity-minus"
                                        >
                                            −
                                        </button>

                                        <span
                                            class="quick-quantity-value"
                                        >
                                            1
                                        </span>

                                        <button
                                            type="button"
                                            class="quick-quantity-plus"
                                        >
                                            +
                                        </button>

                                    </div>

                                    <button
                                        type="button"
                                        class="quick-add-cart"
                                    >
                                        ADD TO CART
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            `;

            document.body.classList.add(
                "quick-view-open"
            );

            modal.classList.add("show");

            let quantity = 1;

            const quantityValue =
                modal.querySelector(
                    ".quick-quantity-value"
                );

            modal
                .querySelector(".quick-quantity-minus")
                .addEventListener("click", function () {

                    if (quantity > 1) {

                        quantity--;

                        quantityValue.textContent =
                            quantity;

                    }

                });

            modal
                .querySelector(".quick-quantity-plus")
                .addEventListener("click", function () {

                    quantity++;

                    quantityValue.textContent =
                        quantity;

                });

            modal
                .querySelector(".quick-add-cart")
                .addEventListener("click", function () {

                    const existingItem =
                        cartItems.find(
                            (item) =>
                                item.id === product.id
                        );

                    if (existingItem) {

                        existingItem.quantity +=
                            quantity;

                    } else {

                        cartItems.push({
                            ...product,
                            quantity: quantity
                        });

                    }

                    saveCart();

                    updateCart();

                    updateCartPage();

                    modal.classList.remove("show");

                    document.body.classList.remove(
                        "quick-view-open"
                    );

                    openCart();

                });

            modal
                .querySelector(".quick-view-close")
                .addEventListener("click", function () {

                    modal.classList.remove("show");

                    document.body.classList.remove(
                        "quick-view-open"
                    );

                });

            modal
                .querySelector(".quick-view-overlay")
                .addEventListener("click", function (event) {

                    if (
                        event.target ===
                        this
                    ) {

                        modal.classList.remove(
                            "show"
                        );

                        document.body.classList.remove(
                            "quick-view-open"
                        );

                    }

                });

        });

    });
}
  
/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    const cartContainer =
        document.querySelector("#cartItems");

    const cartSubtotal =
        document.querySelector("#cartSubtotal");


    if (!cartContainer) {
        return;
    }


    /* =========================
       CART BADGE
    ========================= */

    const totalQuantity =
        cartItems.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document
        .querySelectorAll(".badge")
        .forEach((badge) => {

            badge.textContent =
                totalQuantity;

        });


    /* =========================
       EMPTY CART
    ========================= */

    if (cartItems.length === 0) {

        cartContainer.innerHTML = `
            <div class="cart-empty">
                Your cart is empty.
            </div>
        `;

        if (cartSubtotal) {
            cartSubtotal.textContent =
                "$0.00";
        }

        return;

    }


    /* =========================
       CART ITEMS
    ========================= */

    cartContainer.innerHTML =
        cartItems
            .map((item) => {

                return `

                    <div class="cart-item">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                            class="cart-item-image"
                        >


                        <div class="cart-item-details">

                            <p class="cart-item-name">
                                ${item.name}
                            </p>


                            <div class="cart-quantity">

                                <button
                                    type="button"
                                    class="decrease-cart"
                                    data-id="${item.id}"
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    type="button"
                                    class="increase-cart"
                                    data-id="${item.id}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <span class="cart-item-price">
                            $${(
                                item.price *
                                item.quantity
                            ).toFixed(2)}
                        </span>


                        <button
                            type="button"
                            class="cart-remove"
                            data-id="${item.id}"
                        >
                            ×
                        </button>

                    </div>

                `;

            })
            .join("");


    /* =========================
       SUBTOTAL
    ========================= */

    const subtotal =
        cartItems.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    if (cartSubtotal) {

        cartSubtotal.textContent =
            "$" + subtotal.toFixed(2);

    }


    addCartEvents();

}


/* =====================================================
   CART ITEM EVENTS
===================================================== */

function addCartEvents() {

    document
        .querySelectorAll(".increase-cart")
        .forEach((button) => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);

                    const item =
                        cartItems.find(
                            (product) =>
                                product.id === id
                        );

                    if (item) {

                        item.quantity++;

                        saveCart();

                        updateCart();

                        updateCartPage();

                    }

                }
            );

        });


    document
        .querySelectorAll(".decrease-cart")
        .forEach((button) => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);

                    const item =
                        cartItems.find(
                            (product) =>
                                product.id === id
                        );

                    if (!item) {
                        return;
                    }


                    item.quantity--;


                    if (item.quantity <= 0) {

                        cartItems =
                            cartItems.filter(
                                (product) =>
                                    product.id !== id
                            );

                    }


                    saveCart();

                    updateCart();

                    updateCartPage();

                }
            );

        });


    document
        .querySelectorAll(".cart-remove")
        .forEach((button) => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);

                    cartItems =
                        cartItems.filter(
                            (product) =>
                                product.id !== id
                        );


                    saveCart();

                    updateCart();

                    updateCartPage();

                }
            );

        });

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    const cartPanel =
        document.querySelector("#cartPanel");

    if (!cartPanel) {
        return;
    }


    const cart =
        bootstrap.Offcanvas.getOrCreateInstance(
            cartPanel
        );

    cart.show();

}


/* =====================================================
   CART BUTTONS
===================================================== */

/* ADDED */

function setupCartButtons() {

    const cartButtons =
        document.querySelectorAll(".cart-button");


    if (cartButtons.length > 0) {

        /* VIEW CART */

        cartButtons[0].addEventListener(
            "click",
            function () {

                window.location.href =
                    "Cart.html";

            }
        );


        /* CHECKOUT */

        if (cartButtons[1]) {

            cartButtons[1].addEventListener(
                "click",
                function () {

                    window.location.href =
                        "Checkout.html";

                }
            );

        }

    }

}



/* =====================================================
   PAGINATION
===================================================== */

function updatePagination(totalPages) {

    const pagination =
        document.querySelector("#shopPagination");

    if (!pagination) {
        return;
    }

    pagination.innerHTML = "";


    if (totalPages <= 1) {
        return;
    }


    /* =========================
       PREVIOUS BUTTON
    ========================= */

    const previousLink =
        document.createElement("a");

    previousLink.href = "#";

    previousLink.innerHTML = "←";

    previousLink.classList.add(
        "pagination-arrow"
    );


    /* Disable previous on first page */

    if (currentPage === 1) {

        previousLink.classList.add(
            "disabled"
        );

    } else {

        previousLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                currentPage--;

                displayProducts();

                scrollToProducts();

            }
        );

    }


    pagination.appendChild(
        previousLink
    );


    /* =========================
       PAGE NUMBERS
    ========================= */

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageLink =
            document.createElement("a");

        pageLink.href = "#";

        pageLink.textContent =
            page;


        /* Active page */

        if (page === currentPage) {

            pageLink.classList.add(
                "active"
            );

        }


        pageLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                currentPage =
                    page;

                displayProducts();

                scrollToProducts();

            }
        );


        pagination.appendChild(
            pageLink
        );

    }


    /* =========================
       NEXT BUTTON
    ========================= */

    const nextLink =
        document.createElement("a");

    nextLink.href = "#";

    nextLink.innerHTML = "→";

    nextLink.classList.add(
        "pagination-arrow"
    );


    /* Disable next on last page */

    if (currentPage === totalPages) {

        nextLink.classList.add(
            "disabled"
        );

    } else {

        nextLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                currentPage++;

                displayProducts();

                scrollToProducts();

            }
        );

    }


    pagination.appendChild(
        nextLink
    );

}


/* =====================================================
   SCROLL TO PRODUCTS
===================================================== */

function scrollToProducts() {

    const productSection =
        document.querySelector(
            ".shop-products-section"
        );

    if (productSection) {

        window.scrollTo({

            top:
                productSection.offsetTop - 100,

            behavior:
                "smooth"

        });

    }

}


/* =====================================================
   SEARCH
===================================================== */

if (filterSearch) {

    filterSearch.addEventListener(
        "input",
        function () {

            currentPage = 1;

            displayProducts();

        }
    );

}


/* =====================================================
   MIN PRICE
===================================================== */

if (minPrice) {

    minPrice.addEventListener(
        "input",
        function () {

            let min =
                Number(this.value);

            let max =
                Number(maxPrice.value);


            if (min > max) {

                min = max;

                this.value =
                    max;

            }


            if (minPriceValue) {

                minPriceValue.value =
                    "$" + min;

            }


            currentPage = 1;

            displayProducts();

        }
    );

}


/* =====================================================
   MAX PRICE
===================================================== */

if (maxPrice) {

    maxPrice.addEventListener(
        "input",
        function () {

            let min =
                Number(minPrice.value);

            let max =
                Number(this.value);


            if (max < min) {

                max = min;

                this.value =
                    min;

            }


            if (maxPriceValue) {

                maxPriceValue.value =
                    "$" + max;

            }


            currentPage = 1;

            displayProducts();

        }
    );

}


/* =====================================================
   CATEGORY FILTER
===================================================== */

document
    .querySelectorAll(".filter-categories a")
    .forEach((category) => {

        category.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                document
                    .querySelectorAll(
                        ".filter-categories a"
                    )
                    .forEach((item) => {

                        item.classList.remove(
                            "active"
                        );

                    });


                this.classList.add(
                    "active"
                );


                selectedCategory =
                    this.dataset.category;


                currentPage = 1;

                displayProducts();

            }
        );

    });


/* =====================================================
   CART PAGE
===================================================== */

/* ADDED */

function updateCartPage() {

    const cartPageContent =
        document.querySelector("#cartPageContent");


    if (!cartPageContent) {
        return;
    }


    /* =========================
       EMPTY CART
    ========================= */

    if (cartItems.length === 0) {

        cartPageContent.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-message">

                    <i class="bi bi-square"></i>

                    Your cart is currently empty.

                </div>


                <a
                    href="Shop.html"
                    class="return-shop-button">

                    RETURN TO SHOP

                </a>

            </div>

        `;

        return;

    }


    /* =========================
       TOTAL
    ========================= */

    const subtotal =
        cartItems.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    /* =========================
       CART HTML
    ========================= */

    cartPageContent.innerHTML = `

        <div class="row g-4">


            <!-- CART PRODUCTS -->

            <div class="col-lg-8">

                <div class="cart-table-wrapper">

                    <table class="cart-table">

                        <thead>

                            <tr>

                                <th></th>

                                <th>Product</th>

                                <th>Price</th>

                                <th>Quantity</th>

                                <th>Subtotal</th>

                            </tr>

                        </thead>


                        <tbody>

                            ${cartItems.map((item) => {

                                const itemSubtotal =
                                    item.price *
                                    item.quantity;


                                return `

                                    <tr>

                                        <td>

                                            <button
                                                type="button"
                                                class="cart-page-remove"
                                                data-id="${item.id}"
                                            >
                                                ×
                                            </button>

                                        </td>


                                        <td>

                                            <div class="cart-product">

                                                <img
                                                    src="${item.image}"
                                                    alt="${item.name}"
                                                >

                                                <a
                                                    href="Shop.html"
                                                    class="cart-product-name"
                                                >
                                                    ${item.name}
                                                </a>

                                            </div>

                                        </td>


                                        <td>
                                            $${item.price.toFixed(2)}
                                        </td>


                                        <td>

                                            <div class="cart-page-quantity">

                                                <button
                                                    type="button"
                                                    class="page-cart-minus"
                                                    data-id="${item.id}"
                                                >
                                                    -
                                                </button>

                                                <span>
                                                    ${item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    class="page-cart-plus"
                                                    data-id="${item.id}"
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </td>


                                        <td>
                                            $${itemSubtotal.toFixed(2)}
                                        </td>

                                    </tr>

                                `;

                            }).join("")}

                        </tbody>

                    </table>

                </div>

            </div>


            <!-- CART TOTALS -->

            <div class="col-lg-4">

                <div class="cart-totals">

                    <div class="cart-totals-title">
                        Cart totals
                    </div>


                    <div class="cart-total-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            $${subtotal.toFixed(2)}
                        </span>

                    </div>


                    <div class="cart-total-row">

                        <span>
                            Total
                        </span>

                        <span>
                            $${subtotal.toFixed(2)}
                        </span>

                    </div>


                    <div class="cart-coupon">

                        Have a coupon?

                    </div>


                    <button
                        type="button"
                        class="cart-checkout-button"
                        id="proceedCheckout"
                    >
                        PROCEED TO CHECKOUT
                    </button>

                </div>

            </div>


        </div>

    `;


    addCartPageEvents();

}



/* =====================================================
   CART PAGE EVENTS
===================================================== */

/* ADDED */

function addCartPageEvents() {


    /* =========================
       REMOVE
    ========================= */

    document
        .querySelectorAll(".cart-page-remove")
        .forEach((button) => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);


                    cartItems =
                        cartItems.filter(
                            (item) =>
                                item.id !== id
                        );


                    saveCart();

                    updateCart();

                    updateCartPage();

                }
            );

        });


    /* =========================
       MINUS
    ========================= */

    document
        .querySelectorAll(".page-cart-minus")
        .forEach((button) => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);


                    const item =
                        cartItems.find(
                            (product) =>
                                product.id === id
                        );


                    if (!item) {
                        return;
                    }


                    item.quantity--;


                    if (item.quantity <= 0) {

                        cartItems =
                            cartItems.filter(
                                (product) =>
                                    product.id !== id
                            );

                    }


                    saveCart();

                    updateCart();

                    updateCartPage();

                }
            );

        });


    /* =========================
       PLUS
    ========================= */

    document
        .querySelectorAll(".page-cart-plus")
        .forEach((button) => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);


                    const item =
                        cartItems.find(
                            (product) =>
                                product.id === id
                        );


                    if (item) {

                        item.quantity++;

                    }


                    saveCart();

                    updateCart();

                    updateCartPage();

                }
            );

        });


    /* =========================
       CHECKOUT
    ========================= */

    const checkoutButton =
        document.querySelector(
            "#proceedCheckout"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "Checkout.html";

            }
        );

    }

}



/* =====================================================
   INITIAL SHOP LOAD
===================================================== */


    loadProducts();



/* =====================================================
   INITIAL CART LOAD
===================================================== */

/* ADDED */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCart();

        updateCartPage();

        setupCartButtons();

    }
);
/* =====================================================
   CHECKOUT PAGE
===================================================== */

function updateCheckoutPage() {

    const checkoutProducts =
        document.querySelector("#checkoutProducts");

    if (!checkoutProducts) {
        return;
    }


    /* =========================
       EMPTY CART
    ========================= */

    if (cartItems.length === 0) {

        checkoutProducts.innerHTML = `
            <div class="checkout-empty">
                Your cart is currently empty.
            </div>
        `;

        const subtotal =
            document.querySelector("#checkoutSubtotal");

        const total =
            document.querySelector("#checkoutTotal");

        const orderTotal =
            document.querySelector("#placeOrderTotal");

        if (subtotal) {
            subtotal.textContent = "$0.00";
        }

        if (total) {
            total.textContent = "$0.00";
        }

        if (orderTotal) {
            orderTotal.textContent = "$0.00";
        }

        return;

    }


    /* =========================
       PRODUCTS
    ========================= */

    checkoutProducts.innerHTML =
        cartItems.map((item) => {

            const itemTotal =
                item.price * item.quantity;

            return `

                <div class="checkout-product">

                    <div class="checkout-product-image-wrap">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                            class="checkout-product-image"
                        >

                        <span class="checkout-product-quantity">
                            ${item.quantity}
                        </span>

                    </div>


                    <span class="checkout-product-name">
                        ${item.name}
                    </span>


                    <span class="checkout-product-price">
                        $${itemTotal.toFixed(2)}
                    </span>

                </div>

            `;

        }).join("");


    /* =========================
       TOTAL
    ========================= */

    const subtotal =
        cartItems.reduce(
            (total, item) =>
                total +
                item.price * item.quantity,
            0
        );


    const checkoutSubtotal =
        document.querySelector(
            "#checkoutSubtotal"
        );

    const checkoutTotal =
        document.querySelector(
            "#checkoutTotal"
        );

    const placeOrderTotal =
        document.querySelector(
            "#placeOrderTotal"
        );


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            "$" + subtotal.toFixed(2);

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            "$" + subtotal.toFixed(2);

    }


    if (placeOrderTotal) {

        placeOrderTotal.textContent =
            "$" + subtotal.toFixed(2);

    }

}



/* =====================================================
   COUPON
===================================================== */

const applyCoupon =
    document.querySelector("#applyCoupon");

if (applyCoupon) {

    applyCoupon.addEventListener(
        "click",
        function () {

            const couponCode =
                document.querySelector(
                    "#couponCode"
                ).value.trim();


            if (couponCode === "") {

                alert("Please enter a coupon code.");

                return;

            }


            alert("Coupon code is invalid or expired. This is a demo checkout page.");

        }
    );

}



/* =====================================================
   PLACE ORDER
===================================================== */

const placeOrderButton =
    document.querySelector("#placeOrderButton");

if (placeOrderButton) {

    placeOrderButton.addEventListener(
        "click",
        function () {

            /* =========================
               VALIDATION
            ========================= */

            const requiredFields =
                document.querySelectorAll(
                    ".checkout-page [required]"
                );

            for (const field of requiredFields) {

                if (field.value.trim() === "") {

                    field.focus();

                    field.reportValidity();

                    return;

                }

            }


            /* =========================
               PLACE ORDER
            ========================= */

            alert(
                "There is no payment gateway integrated. This is a demo checkout page."
            );


            cartItems = [];

            saveCart();

        }
    );

}


/* =====================================================
   INITIAL CHECKOUT LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            document.querySelector(
                "#checkoutProducts"
            )
        ) {

            /* Get latest cart data */

            cartItems =
                JSON.parse(
                    localStorage.getItem(
                        "babyStoreCart"
                    )
                ) || [];


            updateCheckoutPage();

        }

    }
);
// LOGIN SYSTEM

const profileIcon = document.getElementById("profileIcon");
const mobileProfile = document.getElementById("mobileProfile");
const loginModal = document.getElementById("loginModal");
const loginClose = document.getElementById("loginClose");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const loginMessage = document.getElementById("loginMessage");

const loginFormContainer = document.getElementById("loginFormContainer");
const logoutContainer = document.getElementById("logoutContainer");


// LOGIN USER DETAILS

const loginUser = {
    email: "mateanushka44@gmail.com",
    password: "Iteg@2024"
};


// OPEN LOGIN POPUP

if (profileIcon) {

    profileIcon.addEventListener("click", function () {

        loginModal.classList.add("show");
        document.body.classList.add("login-open");

        checkLoginStatus();

    });

}
if (mobileProfile) {

    mobileProfile.addEventListener("click", function (event) {

        event.preventDefault();

        loginModal.classList.add("show");
        document.body.classList.add("login-open");

        checkLoginStatus();

    });

}


// CLOSE LOGIN POPUP

if (loginClose) {

    loginClose.addEventListener("click", function () {

        loginModal.classList.remove("show");
        document.body.classList.remove("login-open");

    });

}


// CLOSE WHEN CLICKING OUTSIDE

if (loginModal) {

    loginModal.addEventListener("click", function (event) {

        if (event.target === loginModal) {

            loginModal.classList.remove("show");
            document.body.classList.remove("login-open");

        }

    });

}


// LOGIN

if (loginButton) {

    loginButton.addEventListener("click", function () {

        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        if (
            email === loginUser.email &&
            password === loginUser.password
        ) {

            localStorage.setItem("babyStoreLoggedIn", "true");

            loginMessage.textContent = "Login Successful!";
            loginMessage.style.color = "green";

            setTimeout(function () {

                loginMessage.textContent = "";

                checkLoginStatus();

            }, 700);

        } else {

            loginMessage.textContent =
                "Invalid email or password.";

            loginMessage.style.color = "red";

        }

    });

}


// LOGOUT

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("babyStoreLoggedIn");

        checkLoginStatus();

    });

}


// CHECK LOGIN STATUS

function checkLoginStatus() {

    const isLoggedIn =
        localStorage.getItem("babyStoreLoggedIn") === "true";


    if (isLoggedIn) {

        loginFormContainer.classList.add("d-none");

        logoutContainer.classList.remove("d-none");

    } else {

        loginFormContainer.classList.remove("d-none");

        logoutContainer.classList.add("d-none");

        loginEmail.value = "";
        loginPassword.value = "";
        loginMessage.textContent = "";

    }

}