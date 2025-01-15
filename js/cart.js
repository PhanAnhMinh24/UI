// Hàm để gọi API và lấy số lượng sản phẩm trong giỏ hàng
function getTotalItemCart() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    // Gửi yêu cầu GET tới API
    fetch(API_TOTAL_ITEM_OF_CART, {
        method: 'GET',  // Nếu API là GET, sử dụng method GET
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Nếu có token xác thực
        }
    })
        .then(response => response.json())
        .then(data => {
            // Giả sử API trả về số lượng sản phẩm trong giỏ hàng
            const cartCount = data.results || 0;

            // Cập nhật số lượng giỏ hàng vào thẻ span
            document.querySelector('.cart span').textContent = `Giỏ hàng (${cartCount})`;
        })
        .catch(error => {
            console.error('Error fetching cart quantity:', error);
            // Nếu có lỗi, có thể hiển thị số lượng là 0
            document.querySelector('.cart span').textContent = 'Giỏ hàng (0)';
        });
}

function loadCart() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    fetch(API_CART_DETAIL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Cart data loaded:", data);
            renderCartItems(data);
        })
        .catch(error => {
            console.error("Error loading cart data:", error);
        });
}

// Function to render cart items to the UI
function renderCartItems(items) {
    const cartContainer = document.querySelector('.cart-detail');
    const totalContainer = document.querySelector('.cart-total');
    cartContainer.innerHTML = ''; // Clear existing items

    const datas = items.results;

    let total = 0;

    datas.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('data-id', item.productId);
        cartItem.setAttribute('data-unique-id', item.cartItemId);

        const productItem = item.productResponse;

        let price = (productItem.price - (productItem.price * productItem.sale / 100)) * item.quantity;

        total += price;

        cartItem.innerHTML = `
            <img src="${productItem.imageUrl}" alt="${productItem.name}" class="item-image">
            <div class="item-details">
                <div class="item-title">${productItem.name}</div>
                <div class="text-muted">Số lượng: <input type="number" class="item-quantity" value="${item.quantity}" min="1" max="${productItem.quantity}"></div>
                <div class="item-price">${price.toLocaleString()}đ</div>
            </div>
            <button class="btn btn-remove" data-unique-id="${item.cartItemId}">Xóa</button>
        `;

        cartContainer.appendChild(cartItem);
    });

    if (totalContainer) {
        totalContainer.textContent = `${total.toLocaleString()}đ`;
    }
    
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (event) => {
            const cartItem = event.target.closest('.cart-item');
            const cartItemId = cartItem.getAttribute('data-unique-id');
            console.log("Cart item removed:", cartItemId);
            if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
                // Call API to remove item
                removeCartItem(cartItemId);
            }
        });
    });

    addEventListeners();
}

function removeCartItem(cartItemId) {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    fetch(API_DELETE_CART_ITEM(cartItemId), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Item removed:", data);
            loadCart(); // Reload cart to update the UI
        })
        .catch(error => {
            console.error("Error removing item:", error);
        });
}

// Gọi hàm để cập nhật giỏ hàng khi trang tải
document.addEventListener('DOMContentLoaded', function () {
    getTotalItemCart();
});
