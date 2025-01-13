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

// Gọi hàm để cập nhật giỏ hàng khi trang tải
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
