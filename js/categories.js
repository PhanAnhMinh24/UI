// Hàm lấy danh sách danh mục từ API
function fetchCategories(token, apiUrl) {
    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Đính kèm token vào header
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Trả về dữ liệu JSON từ API
        });
}

// Hàm hiển thị danh mục trên giao diện
function renderCategories(categories, isMyStore) {
    const categoryList = document.getElementById('category-list');

    if (!categories || !Array.isArray(categories)) {
        console.error('Dữ liệu không chứa danh sách categories hợp lệ.');
        return;
    }

    // Duyệt qua mảng categories và thêm vào danh sách giao diện
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'category-item';
        if (isMyStore) {
            li.innerHTML = `
            <a href="../page/my-store.html?category_id=${category.id}">
                ${category.name} <!-- Hiển thị tên danh mục -->
            </a>
        `;
        } else {
            li.innerHTML = `
            <a href="../page/products.html?category_id=${category.id}">
                ${category.name} <!-- Hiển thị tên danh mục -->
            </a>
        `;
        }
        categoryList.appendChild(li);
    });
}

// Lắng nghe sự kiện DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('authToken'); // Lấy token từ localStorage

    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return; // Nếu không có token, dừng lại
    }

    // Kiểm tra sự tồn tại của category-container và gán giá trị mặc định cho isMyStore
    let isMyStore = false; // Giá trị mặc định
    const categoryContainer = document.getElementById('category-container');
    if (categoryContainer && categoryContainer.dataset.isMyStore === 'true') {
        isMyStore = true; // Gán true nếu tồn tại và có giá trị 'true'
    }

    fetchCategories(token, API_CATEGORIES)
        .then(data => {
            if (data.results) {
                renderCategories(data.results, isMyStore); // Hiển thị danh mục
            } else {
                console.error('Dữ liệu không chứa danh sách categories hợp lệ.');
            }
        })
        .catch(error => {
            console.error('Error loading categories:', error);
        });

    populateCategoryDropdown();
});

function populateCategoryDropdown() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return;
    }

    fetch(API_CATEGORIES, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const categoryDropdown = document.getElementById('categoryId');

            if (!data || !Array.isArray(data.results)) {
                console.error('Dữ liệu danh mục không hợp lệ.');
                return;
            }

            data.results.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoryDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải danh mục:', error);
        });
}