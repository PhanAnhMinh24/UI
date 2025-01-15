// Hàm để load sản phẩm theo category_id
/**
 * Hàm gọi API lấy sản phẩm
 * @param {String} apiUrl - API URL
 * @param {Object} requestBody - Dữ liệu gửi kèm yêu cầu
 * @param {Function} renderCallback - Hàm callback để hiển thị dữ liệu
 */
function fetchProducts(apiUrl, requestBody, renderCallback) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (response.status === 403) {
                alert('Bạn không có quyền truy cập. Vui lòng kiểm tra lại trong hồ sơ của mình.');
                window.location.href = '../page/homepage.html';
                throw new Error('HTTP 403 Forbidden');
            }
            if (!response.ok) {
                throw new Error(`Lỗi HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => renderCallback(data))
        .catch((error) => {
            console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            document.getElementById('content-product').innerHTML =
                "<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>";
        });
}

/**
 * Hàm hiển thị sản phẩm và phân trang
 * @param {Object} data - Dữ liệu sản phẩm từ API
 * @param {String} apiUrl - URL phân trang
 */
function renderProducts(data, apiUrl) {
    // Kiểm tra sự tồn tại của category-container và gán giá trị mặc định cho isMyStore
    let isMyStore = false; // Giá trị mặc định
    const categoryContainer = document.getElementById('category-container');
    if (categoryContainer && categoryContainer.dataset.isMyStore === 'true') {
        isMyStore = true; // Gán true nếu tồn tại và có giá trị 'true'
    }

    const content = document.getElementById('content-product');
    const products = data.results.content;
    const totalPage = data.results.totalPages;

    if (products && products.length > 0) {
        let productHTML = '';
        products.forEach((product) => {
            updateHTML = "";
            if (isMyStore) {
                updateHTML += `<div class="row">
                    <div class="col-md-8">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
                    </div>
                    <div class="col-md-4">
                        <a href="/page/my-store/detail-product.html?product_id=${product.id}" class="btn btn-primary">Chi tiết</a>
                    </div>
                </div>`
            } else {
                updateHTML += `<button class="btn btn-primary add-to-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>`
            }

            saleHTML = "";
            if (product.sale > 0) {
                let price = product.price - (product.price * product.sale / 100);
                saleHTML += `<p class="card-text">Giá đã giảm: ${price.toLocaleString()}đ</p>`
            }

            productHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <a href="/page/product-detail.html?product_id=${product.id}">
                            <img src="${product.imageUrl || 'default-image.jpg'}" 
                                 class="card-img-top" 
                                 alt="${product.name}">
                        </a>
                        <div class="card-body">
                            <h5 class="card-title">
                                <a href="/page/product-detail.html?product_id=${product.id}" class="text-decoration-none">${product.name} (Sale of ${product.sale.toLocaleString()}%)</a>
                            </h5>
                            <p class="card-text" style="color: red">Giá: ${product.price.toLocaleString()}đ</p>
                            `+ saleHTML + `
                            <p class="card-text">Số lượng: ${product.quantity}</p>
                            <p class="card-text">Trạng thái: ${product.status === "available" ? "Còn hàng" : "Hết hàng"}</p>
                            `+ updateHTML + `
                        </div>
                    </div>
                </div>`;
        });
        content.innerHTML = `<div class="row">${productHTML}</div>`;
    } else {
        content.innerHTML = "<p>Không có sản phẩm trong danh mục này.</p>";
    }

    renderPagination(totalPage, apiUrl);
}

/**
 * Hàm hiển thị phân trang
 * @param {Number} totalPage - Tổng số trang
 * @param {String} apiUrl - URL phân trang
 */
function renderPagination(totalPage, apiUrl) {
    const paginationProduct = document.getElementById('pagination-product');
    if (totalPage > 0) {
        let pageHTML = '';
        for (let i = 1; i <= totalPage; i++) {
            const activeClass = apiUrl.includes(`page=${i}`) ? 'active' : '';
            pageHTML += `<li class="page-item ${activeClass}">
                <a class="page-link" href="${apiUrl}&page=${i}">${i}</a>
            </li>`;
        }
        paginationProduct.innerHTML = `<ul class="pagination justify-content-center">${pageHTML}</ul>`;
    }
}

/**
 * Hàm tải sản phẩm theo danh mục
 */
function loadProductsForCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id') || 0;
    const page = urlParams.get('page') ? parseInt(urlParams.get('page')) : 1;

    const requestBody = {
        sortKey: 'updatedAt',
        filters: categoryId,
        page: page,
        size: 12,
        sortBy: 'DESC',
    };

    fetchProducts(API_PRODUCTS_SEACH_AND_FILTER, requestBody, (data) => {
        renderProducts(data, `/page/products.html?category_id=${categoryId}`);
    });
}

/**
 * Hàm tải sản phẩm từ cửa hàng của tôi theo danh mục
 */
function loadProductsMyStoreForCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id') || 0;
    const page = urlParams.get('page') ? parseInt(urlParams.get('page')) : 1;

    const requestBody = {
        sortKey: 'updatedAt',
        filters: categoryId,
        page: page,
        size: 12,
        sortBy: 'DESC',
    };

    fetchProducts(API_PRODUCTS_MY_STORE_SEACH_AND_FILTER, requestBody, (data) => {
        renderProducts(data, `/page/products.html?category_id=${categoryId}`);
    });
}

// Hàm để load tất cả sản phẩm (không phân biệt category_id)
function loadAllProducts() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    fetch(API_PRODUCTS, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const content = document.getElementById('content-product');
            const products = data.results;

            if (products && products.length > 0) {
                let productHTML = '';
                products.forEach(product => {
                    saleHTML = "";
                    if (product.sale > 0) {
                        let price = product.price - (product.price * product.sale / 100);
                        saleHTML += `<p class="card-text">Giá đã giảm: ${price.toLocaleString()}đ</p>`
                    }
                    productHTML += `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <a href="/page/product-detail.html?product_id=${product.id}">
                                    <img src="${product.imageUrl || 'default-image.jpg'}" 
                                         class="card-img-top" 
                                         alt="${product.name}">
                                </a>
                                <div class="card-body">
                                    <h5 class="card-title">
                                        <a href="/page/product-detail.html?product_id=${product.id}" class="text-decoration-none">${product.name} (Sale of ${product.sale.toLocaleString()}%)</a>
                                    </h5>
                                    <p class="card-text" style="color: red">Giá: ${product.price.toLocaleString()}đ</p>
                                    `+ saleHTML + `
                                    <p class="card-text">Số lượng: ${product.quantity}</p>
                                    <p class="card-text">Trạng thái: ${product.status === "available" ? "Còn hàng" : "Hết hàng"}</p>
                                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
                                </div>
                            </div>
                        </div>`;
                });
                content.innerHTML = `<div class="row">${productHTML}</div>`;
            } else {
                content.innerHTML = "<p>Không có sản phẩm nào.</p>";
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            document.getElementById('content-product').innerHTML = "<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>";
        });
}

function addToCart(productId) {
    const token = localStorage.getItem('authToken');

    if (!productId) {
        console.error("Không tìm thấy product_id trong URL.");
        return;
    }
    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    console.log("aaaaa ", API_CART(productId))

    // Gửi yêu cầu POST tới API
    fetch(API_CART(productId), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Nếu có token xác thực
        }
    })
        .then(response => response.json())
        .then(data => {
            alert('Sản phẩm đã được thêm vào giỏ hàng');
            location.reload();
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        });
}

// Hàm để load chi tiết sản phẩm theo product_id
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = localStorage.getItem('authToken');
    const productId = urlParams.get('product_id');

    if (!productId) {
        console.error("Không tìm thấy product_id trong URL.");
        return;
    }
    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    fetch(API_PRODUCTS_DETAIL(productId), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const content = document.getElementById('content-product-detail');
            const product = data.results;
            if (data) {
                saleHTML = "";
                if (product.sale > 0) {
                    let price = product.price - (product.price * product.sale / 100);
                    saleHTML += `<p class="card-text">Giá đã giảm: ${price.toLocaleString()}đ</p>`
                }

                const productHTML = `
                    <div class="col-md-6">
                        <img id="product-image" src="${product.imageUrl || 'default-image.jpg'}" class="img-fluid" alt="Sản phẩm">
                    </div>
                    <div class="col-md-6">
                        <h3 class="card-title">${product.name} (Sale of ${product.sale.toLocaleString()}%)</h3>
                        <br>
                        <p class="card-text" style="color: red">Giá: ${product.price.toLocaleString()}đ</p>
                        `+ saleHTML + `
                        <p class="card-text">Số lượng: ${product.quantity}</p>
                        <p class="card-text">Mô tả: ${product.description || 'Không có mô tả'}</p>
                        <p class="card-text">Trạng thái: ${product.status === "available" ? "Còn hàng" : "Hết hàng"}</p>    
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
                    </div>`;

                content.innerHTML = productHTML;
            } else {
                content.innerHTML = "<p>Không tìm thấy thông tin sản phẩm.</p>";
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            document.getElementById('content-product-detail').innerHTML = "<p>Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.</p>";
        });
}

function loadMyStoreProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = localStorage.getItem('authToken');
    const productId = urlParams.get('product_id');

    if (!productId) {
        console.error("Không tìm thấy product_id trong URL.");
        return;
    }
    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    fetch(API_PRODUCTS_DETAIL(productId), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const product = data.results;
            if (product) {
                document.getElementById('name').value = product.name || '';
                document.getElementById('description').value = product.description || '';
                document.getElementById('price').value = product.price || '';
                document.getElementById('quantity').value = product.quantity || '';
                document.getElementById('imageUrl').value = product.imageUrl || '';
                document.getElementById('sale').value = product.sale || '';

                const categoryDropdown = document.getElementById('categoryId');
                if (product.categoryId) {
                    Array.from(categoryDropdown.options).forEach(option => {
                        if (option.value == product.categoryId) {
                            option.selected = true;
                        }
                    });
                }

                if (product.status) {
                    document.getElementById(product.status).checked = true;
                }

                if (product.isActive !== undefined) {
                    document.querySelector(`input[name="isActive"][value="${product.isActive}"]`).checked = true;
                }
            } else {
                console.error('Dữ liệu sản phẩm không hợp lệ.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            document.getElementById('content-product-detail').innerHTML = "<p>Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.</p>";
        });
}

function handleAddProductForm() {
    const form = document.getElementById('add-product-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn chặn hành động submit mặc định

        // Lấy giá trị từ các trường input
        const requestBody = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),
            quantity: parseInt(document.getElementById('quantity').value, 10),
            imageUrl: document.getElementById('imageUrl').value,
            sale: parseFloat(document.getElementById('sale').value),
            categoryId: parseInt(document.getElementById('categoryId').value, 10),
            isActive: document.querySelector('input[name="isActive"]:checked').value
        };

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token không tồn tại trong localStorage.');
            return;
        }

        fetch(API_PRODUCTS, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (response.status === 403) {
                    alert('Bạn không có quyền truy cập. Vui lòng kiểm tra lại quyền hoặc đăng nhập lại.');
                    throw new Error('HTTP 403 Forbidden');
                }
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                alert('Sản phẩm đã được thêm thành công!');
                window.location.href = '/page/my-store.html';
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
                document.getElementById('content-product').innerHTML =
                    "<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>";
            });
    });
}

function handleUpdateProductForm() {
    const form = document.getElementById('update-product-form');
    const urlParams = new URLSearchParams(window.location.search);
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn chặn hành động submit mặc định

        const productId = urlParams.get('product_id');

        // Lấy giá trị từ các trường input
        const requestBody = {
            id: productId,
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),
            quantity: parseInt(document.getElementById('quantity').value, 10),
            imageUrl: document.getElementById('imageUrl').value,
            sale: parseFloat(document.getElementById('sale').value),
            categoryId: parseInt(document.getElementById('categoryId').value, 10),
            status: document.querySelector('input[name="status"]:checked').value,
            isActive: document.querySelector('input[name="isActive"]:checked').value
        };

        console.log("aaa ", requestBody);

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token không tồn tại trong localStorage.');
            return;
        }

        fetch(API_PRODUCTS, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (response.status === 403) {
                    alert('Bạn không có quyền truy cập. Vui lòng kiểm tra lại quyền hoặc đăng nhập lại.');
                    throw new Error('HTTP 403 Forbidden');
                }
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                alert('Sản phẩm đã được cập nhật thành công!');
                window.location.href = '/page/my-store.html';
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
                document.getElementById('content-product').innerHTML =
                    "<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>";
            });
    });
}
