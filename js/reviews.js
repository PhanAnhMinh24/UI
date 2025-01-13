// Hàm render sao dựa trên điểm trung bình
function renderStars(averageRating) {
    const starContainer = document.getElementById('star-rating');
    starContainer.innerHTML = ''; // Xóa các sao cũ nếu có

    // Vẽ các sao đầy (★) hoặc sao rỗng (☆) dựa trên điểm trung bình
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        if (i <= averageRating) {
            star.innerHTML = '★'; // Sao đầy
        } else {
            star.innerHTML = '☆'; // Sao rỗng
        }
        starContainer.appendChild(star);
    }
}

function renderComments(reviewData) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    reviewData.forEach(comment => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `<div class="row">
                                    <div class="col-md-12"><strong>${comment.fullName}</strong> (${comment.rating} ★)</div>
                                    <div class="row">
                                        <div class="col-md-6">Nội dung: ${comment.comment}</div>
                                        <div class="col-md-6">Ngày đăng: ${comment.createdAt}</div>
                                    </div>
                                </div>`;
        commentsList.appendChild(listItem);
    });
}

// Hàm lấy dữ liệu từ API và hiển thị đánh giá
function loadProductRating() {
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

    fetch(API_REVIEW_DETAIL(productId), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })  // Đường dẫn API của bạn
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi tải dữ liệu đánh giá');
            }
            return response.json();  // Chuyển phản hồi thành JSON
        })
        .then(data => {
            const reviews = data.results;

            console.log("aaaa ", reviews);

            document.getElementById('average-rating').textContent = reviews.averageRating; // Hiển thị điểm trung bình

            renderStars(reviews.averageRating);

            renderComments(reviews.reviewResponses);
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
            document.getElementById('star-rating').innerHTML = "<p>Không thể tải đánh giá. Vui lòng thử lại sau.</p>";
        });
}

// Hàm gửi bình luận và đánh giá mới lên API
function addComment() {
    const form = document.getElementById('comment-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product_id'); // Lấy productId từ URL
        const token = localStorage.getItem('authToken'); // Lấy token từ localStorage

        if (!productId) {
            console.error("Không tìm thấy product_id trong URL.");
            return;
        }
        if (!token) {
            console.error('Token không tồn tại trong localStorage.');
            return;
        }

        // Lấy giá trị rating và comment từ form
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;

        // Kiểm tra nếu thiếu thông tin
        if (!productId || !rating || !comment) {
            console.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Dữ liệu cần gửi lên API
        const reviewData = {
            productId: productId,
            rating: parseInt(rating), // Chuyển rating sang kiểu số nguyên
            comment: comment
        };

        // Gửi dữ liệu đến API
        fetch(API_REVIEWS, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData) // Gửi dữ liệu dưới dạng JSON
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi khi gửi đánh giá');
                }
                return response.json();
            })
            .then(data => {
                // Cập nhật danh sách bình luận và điểm trung bình sau khi thêm bình luận thành công
                loadProductRating(); // Tải lại đánh giá sản phẩm
                document.getElementById('comment-form').reset(); // Reset form sau khi gửi thành công
            })
            .catch(error => {
                console.error('Lỗi khi thêm bình luận:', error);
            });
    });
}
