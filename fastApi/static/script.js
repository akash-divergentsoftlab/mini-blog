var createCheckoutSession = function (priceId) {
    return fetch("/create-checkout-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            priceId: priceId
        })
    }).then(function (result) {
        return result.json();
    });
};

const PREMIUM_PRICE_ID = "price_1QXdD5P1aeDbPFiRUgKMhPfQ";
const BASIC_PRICE_ID = "price_1QXdBKP1aeDbPFiRXXHMTj15";
const stripe = Stripe("pk_test_51QXcuqP1aeDbPFiRyINuZ54t6O1VJWwmyG0XhmKYvrfjs4VcSMl6XjyIVV84S6wMqFECtIOSJt6e7TBSlhh4PRQt00sM9w5rBQ");

document.addEventListener("DOMContentLoaded", function (event) {
    document
        .getElementById("checkout-premium")
        .addEventListener("click", function (evt) {
            createCheckoutSession(PREMIUM_PRICE_ID).then(function (data) {
                stripe.redirectToCheckout({
                    sessionId: data.sessionId
                });
            });
        });

    document
        .getElementById("checkout-basic")
        .addEventListener("click", function (evt) {
            createCheckoutSession(BASIC_PRICE_ID).then(function (data) {
                stripe.redirectToCheckout({
                    sessionId: data.sessionId
                });
            });
        });
});

