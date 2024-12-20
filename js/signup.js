async function registerUser(formSelector) {
    $(document).ready(function () {
      $(formSelector).on('submit', function (e) {
        e.preventDefault(); // Ngăn form gửi đi theo cách thông thường
  
        // Lấy dữ liệu từ các input fields
        const username = $('#username').val();
        const password = $('#pwd').val();
        const fullName = $('#full_name').val();
        const email = $('#email').val();
        const phoneNumber = $('#phone_number').val();
        const profileImageInput = $('#profile_image')[0].files[0];
  
        // Hàm chuyển file ảnh sang Base64
        const convertImageToBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // Chỉ lấy Base64
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
          });
        };
  
        // Chuẩn bị và gửi dữ liệu
        (async () => {
          let profileImageBase64 = "";
          if (profileImageInput) {
            profileImageBase64 = await convertImageToBase64(profileImageInput);
          }
  
          const requestData = {
            email: email,
            password: password,
            fullName: fullName,
            phoneNumber: phoneNumber,
            address: username, // Giả sử username là "address" vì API yêu cầu address
            profileImage: profileImageBase64
          };
  
          // Gửi dữ liệu qua API
          $.ajax({
            url: 'http://localhost:8083/auth/signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
              alert('Đăng ký thành công!');
              console.log(response);
              // Điều hướng sang trang index.html
              window.location.href = window.location.origin + '/index.html';
            },
            error: function (xhr, status, error) {
              let responseMessage = "Đăng ký thất bại!"; // Thông báo mặc định
              if (xhr.status === 400) {
                try {
                  const response = JSON.parse(xhr.responseText);
                  if (response.message === "during-registration-error") {
                    responseMessage = "Lỗi trong quá trình đăng ký. Vui lòng thử lại!";
                  }
                } catch (e) {
                  console.error("Lỗi parse response:", e);
                }
              }
              alert(responseMessage);
              console.error("Chi tiết lỗi:", xhr.responseText);
            }
          });
        })();
      });
    });
  }
