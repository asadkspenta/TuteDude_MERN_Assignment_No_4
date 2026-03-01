var publicKey = "3ChXJ8Gg0rPrvLU_j";
var serviceId = "service_aj1s41m";
var tempId = "template_ibhhp36";

(function () {
  emailjs.init(publicKey);
})();

var cartBody = document.getElementById("cart-body");
var totalElement = document.getElementById("total");
var emptyState = document.getElementById("empty-state");
var buttons = document.getElementsByClassName("add-btn");
var bookingForm = document.getElementById("bookingForm");
var bookBtn = document.getElementById("bookBtn");
var successMessage = document.getElementById("success-message");

var cart = [];

for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function () {
    var serviceDiv = this.parentNode;
    var firstSpan = serviceDiv.getElementsByTagName("span")[0];
    var spanText = firstSpan.innerHTML;
    var priceSpan = firstSpan.getElementsByClassName("price")[0];
    var priceText = priceSpan.innerHTML;
    var priceString = priceText.replace("₹", "");
    var price = parseFloat(priceString);
    var nameSpan = serviceDiv.getElementsByTagName("span")[0];
    var serviceName = "";
    var fullText = nameSpan.innerHTML;
    var priceIndex = fullText.indexOf("₹");

    if (priceIndex > 0) {
      serviceName = fullText.substring(0, priceIndex);
      serviceName = serviceName.trim();
    }

    var found = -1;
    for (var j = 0; j < cart.length; j++) {
      if (cart[j].name === serviceName) {
        found = j;
        break;
      }
    }

    var textSpan = this.getElementsByClassName("btn-text")[0];
    var iconSpan = this.getElementsByClassName("icon-circle")[0];

    if (found === -1) {
      var newItem = {
        name: serviceName,
        price: price,
      };
      cart.push(newItem);
      textSpan.innerHTML = "Remove Item";
      iconSpan.innerHTML = "-";
      this.className = this.className + " active";
    } else {
      cart.splice(found, 1);
      textSpan.innerHTML = "Add Item";
      iconSpan.innerHTML = "+";
      this.className = this.className.replace(" active", "");
    }

    renderCart();
  };
}

function renderCart() {
  cartBody.innerHTML = "";
  var total = 0;

  if (cart.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  for (var i = 0; i < cart.length; i++) {
    total = total + cart[i].price;
    var row = "<tr>";
    row = row + "<td>" + (i + 1) + "</td>";
    row = row + "<td>" + cart[i].name + "</td>";
    row = row + "<td>₹" + cart[i].price.toFixed(2) + "</td>";
    row = row + "</tr>";
    cartBody.innerHTML = cartBody.innerHTML + row;
  }
  totalElement.innerHTML = total.toFixed(2);
}

bookingForm.onsubmit = function (event) {
  event.preventDefault();

  if (cart.length === 0) {
    successMessage.style.display = "flex";
    successMessage.style.backgroundColor = "#fdecea";
    successMessage.style.color = "#d32f2f";
    successMessage.innerHTML = "Please select at least one service";

    setTimeout(function () {
      successMessage.style.display = "none";
    }, 3000);

    return;
  }

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }

  var fullName = document.getElementById("fullName").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var totalAmount = totalElement.innerHTML;

  var orderDetails = "";

  for (var i = 0; i < cart.length; i++) {
    orderDetails = orderDetails + (i + 1) + ". " + cart[i].name;
    orderDetails = orderDetails + " - ₹" + cart[i].price.toFixed(2);
    orderDetails = orderDetails + "\n";
  }

  bookBtn.disabled = true;
  bookBtn.innerHTML = "Sending...";

  var templateParams = {
    name: fullName,
    email: email,
    phone: phone,
    order_details: orderDetails,
    total_amount: "₹" + totalAmount,
  };

  emailjs
    .send(serviceId, tempId, templateParams)
    .then(function () {
      successMessage.style.display = "flex";
      successMessage.style.backgroundColor = "#e6f4ea";
      successMessage.style.color = "#2e7d32";
      successMessage.innerHTML = "Booking successful! Confirmation email sent.";

      setTimeout(function () {
        successMessage.style.display = "none";
        bookingForm.reset();
        cart = [];
        renderCart();

        for (var i = 0; i < buttons.length; i++) {
          var btnText = buttons[i].getElementsByClassName("btn-text")[0];
          var btnIcon = buttons[i].getElementsByClassName("icon-circle")[0];
          btnText.innerHTML = "Add Item";
          btnIcon.innerHTML = "+";
          buttons[i].className = buttons[i].className.replace(" active", "");
        }

        bookBtn.disabled = false;
        bookBtn.innerHTML = "Book now";
      }, 4000);
    })
    .catch(function () {
      successMessage.style.display = "flex";
      successMessage.style.backgroundColor = "#fdecea";
      successMessage.style.color = "#d32f2f";
      successMessage.innerHTML = "Failed to send email. Please try again.";
      bookBtn.disabled = false;
      bookBtn.innerHTML = "Book now";
    });
};

renderCart();
