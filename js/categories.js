document.addEventListener("DOMContentLoaded", function () {
    // Token lấy từ storage hoặc cookie
    const token = localStorage.getItem('authToken'); // Lấy token từ localStorage

    if (!token) {
        console.error('Token không tồn tại trong localStorage.');
        return; // Nếu không có token, dừng lại và không thực hiện fetch
    }


    // Lấy danh sách danh mục từ API
    fetch('http://localhost:8083/categories', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Đính kèm token vào header
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Giả sử API trả về dữ liệu dưới dạng JSON
    })
    .then(data => {
        if (data.results && Array.isArray(data.results)) {
            const categoryList = document.getElementById('category-list');

            // Duyệt qua mảng results để tạo các phần tử danh mục
            data.results.forEach(category => {
                const li = document.createElement('li');
                li.className = 'category-item';
                li.innerHTML = `
                    <a href="../page/products.html?category_id=${category.id}">
                        ${category.name} <!-- Hiển thị tên danh mục -->
                    </a>
                `;
                categoryList.appendChild(li);
            });
        } else {
            console.error('Dữ liệu không chứa danh sách categories hợp lệ.');
        }
    })
    .catch(error => {
        console.error('Error loading categories:', error);
    });
});
