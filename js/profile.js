document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('Bạn chưa đăng nhập! Vui lòng đăng nhập trước.');
        window.location.href = '/index.html'; // Chuyển hướng đến trang đăng nhập
        return;
    }

    loadUserProfile(token);

    setupProfileImagePreview();

    setupProfileFormSubmit(token);
});

/**
 * Hàm tải thông tin người dùng từ API
 */
function loadUserProfile(token) {
    fetch(API_PROFILE, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể tải thông tin người dùng.');
            }
            return response.json();
        })
        .then(data => {
            const userInfo = data.results;

            // Hiển thị thông tin vào form
            populateUserProfile(userInfo);
        })
        .catch(error => {
            console.error('Lỗi khi tải thông tin người dùng:', error);
            alert('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        });
}

/**
 * Hàm điền thông tin người dùng vào form
 */
function populateUserProfile(userInfo) {
    const addressSelector = document.getElementById('addressSelector');
    const addressDetails = document.getElementById('addressDetails');
    const profileImagePreview = document.getElementById('profileImagePreview');

    // Hiển thị ảnh đại diện
    if (profileImagePreview) {
        profileImagePreview.src = userInfo.profileImage || '/path/to/default-image.jpg';
    }

    // Đổ dữ liệu vào select
    if (addressSelector) {
        userInfo.addressResponses.forEach((addr) => {
            const option = document.createElement('option');
            option.value = addr.id;
            option.textContent = addr.address;
            option.selected = addr.isDefault; // Chọn mặc định nếu isDefault = true
            addressSelector.appendChild(option);
        });
    }

    // Điền thông tin vào các trường trong form
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
        fullNameInput.value = userInfo.fullName || 'Chưa cập nhật';
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.value = userInfo.email || 'Chưa cập nhật';
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.value = userInfo.phoneNumber || 'Chưa cập nhật';
    }

    const isSellerInput = document.getElementById('isSeller');
    if (isSellerInput) {
        isSellerInput.checked = userInfo.isSeller;
    }

    // Hiển thị địa chỉ mặc định
    if (addressDetails) {
        const defaultAddress = userInfo.addressResponses.find(addr => addr.isDefault);
        addressDetails.value = defaultAddress ? defaultAddress.address : '';
    }
}

/**
 * Hàm thiết lập sự kiện xem trước ảnh đại diện
 */
function setupProfileImagePreview() {
    const profileImageInput = document.getElementById('profileImage');
    profileImageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('profileImagePreview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Hàm thiết lập sự kiện submit form cập nhật thông tin
 */
function setupProfileFormSubmit(token) {
    document.getElementById('profile-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn trình duyệt tải lại trang

        // Lấy thông tin từ form
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phone').value;
        const addressId = parseInt(document.getElementById('addressSelector').value, 10);
        const profileImageInput = document.getElementById('profileImage');
        const isSellerCheckbox = document.getElementById('isSeller');
        const isSeller = isSellerCheckbox.checked;

        // Nếu API yêu cầu JSON:
        const requestBody = {
            fullName: fullName,
            phoneNumber: phoneNumber,
            addressId: addressId,
            profileImage: profileImageInput && profileImageInput.files[0]
                ? profileImageInput.files[0].name // Lưu tên file nếu cần
                : null,
            isSeller: isSeller
        };

        updateUserProfile(token, requestBody);
    });
}

/**
 * Hàm gửi dữ liệu cập nhật thông tin người dùng
 */
function updateUserProfile(token, requestBody) {
    fetch(API_PROFILE, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Cập nhật thông tin không thành công.');
            }
            return response.json();
        })
        .then(data => {
            alert('Cập nhật thông tin thành công!');
            console.log('Thông tin sau khi cập nhật:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật thông tin:', error);
            alert('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
        });
}
