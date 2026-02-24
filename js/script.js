const EMAILJS_PUBLIC_KEY = "3ChXJ8Gg0rPrvLU_j";      
const EMAILJS_SERVICE_ID = "service_aj1s41m";      
const TEMPLATE_ID = "template_ibhhp36";

(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

const cartBody = document.getElementById("cart-body");
const totalElement = document.getElementById("total");
const emptyState = document.getElementById("empty-state");
const buttons = document.querySelectorAll(".add-btn");
const bookingForm = document.getElementById("bookingForm");
const bookBtn = document.getElementById("bookBtn");
const successMessage = document.getElementById("success-message");

let cart = [];

buttons.forEach(button => {
    button.addEventListener("click", function () {

        const serviceDiv = this.closest(".service");
        const name = serviceDiv.dataset.name;
        const price = parseFloat(serviceDiv.dataset.price);

        const existingIndex = cart.findIndex(item => item.name === name);

        const textSpan = this.querySelector(".btn-text");
        const iconSpan = this.querySelector(".icon-circle");

        if (existingIndex === -1) {
            cart.push({ name, price });

            textSpan.textContent = "Remove Item";
            iconSpan.textContent = "−";
            this.classList.add("active");
        } else {
            cart.splice(existingIndex, 1);
            textSpan.textContent = "Add Item";
            iconSpan.textContent = "+";
            this.classList.remove("active");
        }
        renderCart();
    });
});

function renderCart() {
    cartBody.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    cart.forEach((item, index) => {
        total += item.price;
        cartBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
            </tr>
        `;
    });

    totalElement.textContent = total.toFixed(2);
}

bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = bookingForm.querySelectorAll("input");

    if (cart.length === 0) {
        successMessage.style.display = "flex";
        successMessage.style.background = "#fdecea";
        successMessage.style.color = "#d32f2f";
        successMessage.innerHTML = `
            <span class="success-icon" style="border-color:#d32f2f;color:#d32f2f;">!</span>
            Please select at least one service
        `;
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
        return;
    }

    if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
    }

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const totalAmount = totalElement.textContent;

    const orderDetails = cart.map((item, index) => 
        `${index + 1}. ${item.name} - ₹${item.price.toFixed(2)}`
    ).join("\n");

    inputs.forEach(input => input.disabled = true);
    bookBtn.disabled = true;
    bookBtn.style.opacity = "0.6";
    bookBtn.textContent = "Sending...";

    const templateParams = {
        name: fullName,
        email: email,
        phone: phone,
        order_details: orderDetails,
        total_amount: `₹${totalAmount}`
    };

    Promise.all([
        emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_ID, templateParams),
    ])
    .then(function() {

        successMessage.style.display = "flex";
        successMessage.style.background = "#e6f4ea";
        successMessage.style.color = "#2e7d32";
        successMessage.innerHTML = `
            <span class="success-icon">✓</span>
            Booking successful! Confirmation email sent.
        `;

        setTimeout(() => {
            successMessage.style.display = "none";
            inputs.forEach(input => input.disabled = false);
            bookBtn.disabled = false;
            bookBtn.style.opacity = "1";
            bookBtn.textContent = "Book now";
            bookingForm.reset();
            cart = [];
            renderCart();

            buttons.forEach(button => {
                button.querySelector(".btn-text").textContent = "Add Item";
                button.querySelector(".icon-circle").textContent = "+";
                button.classList.remove("active");
            });
        }, 5000);
    })
    .catch(function(error) {
        console.error("Email sending failed:", error);

        successMessage.style.display = "flex";
        successMessage.style.background = "#fdecea";
        successMessage.style.color = "#d32f2f";
        successMessage.innerHTML = `
            <span class="success-icon" style="border-color:#d32f2f;color:#d32f2f;">!</span>
            Failed to send email. Please try again.
        `;

        inputs.forEach(input => input.disabled = false);
        bookBtn.disabled = false;
        bookBtn.style.opacity = "1";
        bookBtn.textContent = "Book now";

        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    });
});

renderCart();