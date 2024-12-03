// Kiểm tra token
function checkAuth() {
    // Lấy token từ localStorage (hoặc sessionStorage tùy dự án)
    const token = localStorage.getItem('token');

    // Nếu không có token, điều hướng về trang login
    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        // Giải mã hoặc kiểm tra token (sử dụng thư viện jwt-decode nếu cần)
        const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã phần payload của JWT

        // Kiểm tra thời hạn token
        const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
        if (payload.exp && payload.exp < currentTime) {
            // Token hết hạn
            alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
            redirectToLogin();
        }
    } catch (error) {
        console.error("Token không hợp lệ:", error);
        redirectToLogin();
    }
}

// Hàm điều hướng về trang login
function redirectToLogin() {
    window.location.href = '../index.html';// Đường dẫn đến trang login
}

// Gọi hàm kiểm tra khi tải trang
document.addEventListener('DOMContentLoaded', checkAuth);