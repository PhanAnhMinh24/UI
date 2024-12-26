document.addEventListener("DOMContentLoaded", function () {
    // Lấy id từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
    const categoryId = urlParams.get('category_id'); // Lấy id từ URL, ví dụ: /products.html?id=123

    if (!categoryId) {
        console.error("Không tìm thấy ID trong URL.");
        return;
    }
    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return; // Nếu không có token, dừng lại và không thực hiện fetch
    }

    // Gửi yêu cầu AJAX đến API để lấy sản phẩm
    fetch(`http://localhost:8083/products/${categoryId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Đính kèm token vào header
                'Content-Type': 'application/json'
            }
        }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi HTTP! Status: ${response.status}`);
            }
            return response.json(); // Chuyển phản hồi thành JSON
        })
        .then(data => {
            // Hiển thị sản phẩm trong phần nội dung
            const content = document.getElementById('content-product');
            const products = data.results; // Mảng sản phẩm từ API

            if (products && products.length > 0) {
                let productHTML = '';
                products.forEach(product => {
                    // Tạo HTML cho mỗi sản phẩm
                    productHTML += `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <img src="${product.imageUrl ? product.imageUrl : 'default-image.jpg'}" class="card-img-top" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text">Giá: ${product.price.toLocaleString()}đ</p>
                                    <p class="card-text">Số lượng: ${product.quantity}</p>
                                    <p class="card-text">Trạng thái: ${product.status}</p>
                                    <a href="#" class="btn btn-primary">Thêm vào giỏ hàng</a>
                                </div>
                            </div>
                        </div>
                    `;
                });
                content.innerHTML = `<div class="row">${productHTML}</div>`;
            } else {
                content.innerHTML = "<p>Không có sản phẩm trong danh mục này.</p>";
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            document.getElementById('content').innerHTML = "<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>";
        });
});
