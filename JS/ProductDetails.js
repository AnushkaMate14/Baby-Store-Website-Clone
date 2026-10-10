/* =====================================================
   PRODUCT DETAILS PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const productDetailImage =
        document.querySelector("#productDetailImage");

    const productDetailName =
        document.querySelector("#productDetailName");

    const productDetailPrice =
        document.querySelector("#productDetailPrice");

    const productDetailCategory =
        document.querySelector("#productDetailCategory");

    const productQuantity =
        document.querySelector("#productQuantity");

    const increaseQuantity =
        document.querySelector("#increaseQuantity");

    const decreaseQuantity =
        document.querySelector("#decreaseQuantity");

    const productAddToCart =
        document.querySelector("#productAddToCart");


    /* =====================================================
       GET PRODUCT ID FROM URL
    ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    const productId =
        Number(urlParams.get("id"));


    console.log("Product ID:", productId);


    /* =====================================================
       LOAD PRODUCT FROM JSON
    ===================================================== */

    fetch("Shop.json")
        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Shop.json could not be loaded"
                );

            }

            return response.json();

        })
        .then(function (data) {

            /* Find selected product */

            const product =
                data.products.find(function (item) {

                    return item.id === productId;

                });


            console.log("Selected product:", product);


            /* =================================================
               PRODUCT NOT FOUND
            ================================================= */

            if (!product) {

                productDetailName.textContent =
                    "Product not found";

                return;

            }


            /* =================================================
               DISPLAY PRODUCT
            ================================================= */

            productDetailImage.src =
                product.image;

            productDetailImage.alt =
                product.name;


            productDetailName.textContent =
                product.name;


            productDetailPrice.textContent =
                "$" + product.price.toFixed(2);


            productDetailCategory.textContent =
                product.category;


            /* =================================================
               QUANTITY
            ================================================= */

            let quantity = 1;


            productQuantity.value =
                quantity;


            /* =========================
               INCREASE QUANTITY
            ========================= */

            increaseQuantity.addEventListener(
                "click",
                function () {

                    quantity++;

                    productQuantity.value =
                        quantity;

                }
            );


            /* =========================
               DECREASE QUANTITY
            ========================= */

            decreaseQuantity.addEventListener(
                "click",
                function () {

                    if (quantity > 1) {

                        quantity--;

                        productQuantity.value =
                            quantity;

                    }

                }
            );


            /* =================================================
               ADD TO CART
            ================================================= */

            productAddToCart.addEventListener(
                "click",
                function () {

                    /* Get latest cart */

                    let cart =
                        JSON.parse(
                            localStorage.getItem(
                                "babyStoreCart"
                            )
                        ) || [];


                    /* =========================
                       CHECK EXISTING PRODUCT
                    ========================= */

                    const existingProduct =
                        cart.find(function (item) {

                            return item.id === product.id;

                        });


                    /* =========================
                       ADD / INCREASE PRODUCT
                    ========================= */

                    if (existingProduct) {

                        existingProduct.quantity +=
                            quantity;

                    } else {

                        cart.push({

                            id: product.id,

                            name: product.name,

                            price: product.price,

                            category: product.category,

                            image: product.image,

                            quantity: quantity

                        });

                    }


                    /* =========================
                       SAVE CART
                    ========================= */

                    localStorage.setItem(
                        "babyStoreCart",
                        JSON.stringify(cart)
                    );


                    /* =========================
                       SYNC SCRIPT.JS CART
                    ========================= */

                    /*
                       Script.js already has cartItems.
                       Get the latest data into it.
                    */

                    if (typeof cartItems !== "undefined") {

                        cartItems =
                            JSON.parse(
                                localStorage.getItem(
                                    "babyStoreCart"
                                )
                            ) || [];

                    }


                    /* =========================
                       UPDATE SIDE CART
                    ========================= */

                    if (typeof updateCart === "function") {

                        updateCart();

                    }


                    /* =========================
                       UPDATE CART PAGE
                    ========================= */

                    if (typeof updateCartPage === "function") {

                        updateCartPage();

                    }


                    /* =========================
                       UPDATE BADGE
                    ========================= */

                    updateProductDetailCartBadge();


                    /* =========================
                       OPEN SIDE CART
                    ========================= */

                    if (typeof openCart === "function") {

                        openCart();

                    } else {

                        const cartPanel =
                            document.querySelector(
                                "#cartPanel"
                            );


                        if (cartPanel) {

                            const cart =
                                bootstrap.Offcanvas
                                    .getOrCreateInstance(
                                        cartPanel
                                    );

                            cart.show();

                        }

                    }

                }
            );

        })
        .catch(function (error) {

            console.error(
                "Product Details Error:",
                error
            );

        });


    /* =====================================================
       UPDATE CART BADGE
    ===================================================== */

    function updateProductDetailCartBadge() {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    "babyStoreCart"
                )
            ) || [];


        const totalQuantity =
            cart.reduce(
                function (total, item) {

                    return total + item.quantity;

                },
                0
            );


        document
            .querySelectorAll(".badge")
            .forEach(function (badge) {

                badge.textContent =
                    totalQuantity;

            });

    }


    /* =====================================================
       INITIAL CART BADGE
    ===================================================== */

    updateProductDetailCartBadge();

});