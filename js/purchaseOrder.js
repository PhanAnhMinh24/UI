function addPurchaseOrder(event) {
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', function (event) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.error('Token không tồn tại trong localStorage.');
            return;
        }

        event.preventDefault(); // Prevent form submission

        const receiverName = document.getElementById('receiver-name').value;
        const receiverPhone = document.getElementById('receiver-phone').value;
        const receiverAddressId = document.getElementById('receiver-address').value;

        if (!receiverName || !receiverPhone || !receiverAddressId) {
            alert("Vui lòng điền đầy đủ thông tin người nhận.");
            return;
        }

        const orderDetails = {
            addressId: receiverAddressId,
            fullName: receiverName,
            phoneNumber: receiverPhone
        };

        console.log("aaa ", orderDetails);

        fetch(API_PURCHASE_ORDER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(orderDetails)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể tạo đơn hàng.');
                }
                return response.json();
            })
            .then(data => {
                alert("Đơn hàng đã được tạo thành công!");
                window.location.href = "/page/homepage.html";
            })
            .catch(error => {
                console.error('Lỗi khi tạo đơn hàng:', error);
                alert('Không thể tạo đơn hàng. Vui lòng thử lại sau.');
            });
    });
}