// Hàm xử lý đăng nhập
function loginUser(formSelector) {
    $(document).ready(function () {
      $(formSelector).on('submit', function (e) {
        e.preventDefault(); // Ngăn form gửi đi mặc định
  
        // Lấy dữ liệu từ form
        const email = $('#email').val();
        const password = $('#pwd').val();
  
        // Chuẩn bị dữ liệu gửi API
        const requestData = {
          username: email, // API yêu cầu username, bạn dùng email thay thế
          password: password
        };
  
        // Gửi request đến API
        $.ajax({
          url: API_LOGIN,
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(requestData),
          success: function (response) {
            if (response.results && response.results.token) {
              // Lưu token và thông tin người dùng vào localStorage
              localStorage.setItem('authToken', response.results.token);
              localStorage.setItem('username', response.results.username);
              localStorage.setItem('userRoles', JSON.stringify(response.results.roles));
  
              alert('Đăng nhập thành công!');
  
              // Điều hướng về trang chính
              window.location.href = '/page/homepage.html';

            } else {
              alert('Đăng nhập không thành công. Không có token.');
            }
          },
          error: function (xhr, status, error) {
            let errorMessage = 'Đăng nhập thất bại! Vui lòng thử lại.';
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.message) {
                errorMessage = response.message;
              }
            } catch (e) {
              console.error('Lỗi khi parse response:', e);
            }
  
            alert(errorMessage);
            console.error('Chi tiết lỗi:', xhr.responseText);
          }
        });
      });
    });
  }
  