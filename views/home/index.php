<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-1">Bảng điều khiển</h2>
        <p class="text-muted mb-0"><i class="far fa-calendar-alt me-2"></i>Thứ Hai, 24 Tháng 10, 2023 (Giả lập)</p>
    </div>
    <button class="btn btn-primary btn-lg px-4 shadow-sm"><i class="fas fa-plus me-2"></i>Thêm sách mới</button>
</div>

<div class="row g-4 mb-5">
    <div class="col-md-6 col-lg-3">
        <div class="card card-dashboard h-100 p-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="card-icon-bg bg-light-primary">
                        <i class="fas fa-book"></i>
                    </div>
                    <span class="badge-trend up">
                        <i class="fas fa-arrow-up me-1"></i><?php echo $stats['books_trend']; ?>
                    </span>
                </div>
                <h6 class="text-muted mb-2">Tổng số sách</h6>
                <h2 class="fw-bold mb-0"><?php echo $stats['total_books']; ?></h2>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-lg-3">
        <div class="card card-dashboard h-100 p-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="card-icon-bg bg-light-warning">
                        <i class="fas fa-book-reader"></i>
                    </div>
                    <span class="badge-trend up">
                        <i class="fas fa-arrow-up me-1"></i><?php echo $stats['borrowing_trend']; ?>
                    </span>
                </div>
                <h6 class="text-muted mb-2">Sách đang mượn</h6>
                <h2 class="fw-bold mb-0"><?php echo $stats['borrowing']; ?></h2>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-lg-3">
        <div class="card card-dashboard h-100 p-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="card-icon-bg bg-light-success">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <span class="badge-trend up">
                        <?php echo $stats['new_users_trend']; ?>
                    </span>
                </div>
                <h6 class="text-muted mb-2">Độc giả mới</h6>
                <h2 class="fw-bold mb-0"><?php echo $stats['new_users']; ?></h2>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-lg-3">
        <div class="card card-dashboard h-100 p-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="card-icon-bg bg-light-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <span class="badge-trend down bg-light-danger text-danger">
                        Xử lý ngay <i class="fas fa-arrow-right ms-1"></i>
                    </span>
                </div>
                <h6 class="text-muted mb-2">Sách quá hạn</h6>
                <h2 class="fw-bold mb-0"><?php echo $stats['overdue']; ?></h2>
            </div>
        </div>
    </div>
</div>

<div class="row g-4">
    <div class="col-lg-8">
        <div class="card card-dashboard h-100 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 class="fw-bold mb-1">Xu hướng mượn sách</h5>
                    <p class="text-muted mb-0">Số lượng sách mượn trong 7 ngày qua</p>
                </div>
                <select class="form-select w-auto shadow-sm border-0 bg-light">
                    <option>Tuần này</option>
                    <option>Tháng này</option>
                    <option>Năm nay</option>
                </select>
            </div>
            <div style="height: 350px;">
                <canvas id="borrowTrendChart"></canvas>
            </div>
        </div>
    </div>

    <div class="col-lg-4">
        <div class="card card-dashboard h-100 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0">Hoạt động gần đây</h5>
                <a href="#" class="text-primary text-decoration-none fw-semibold">Xem tất cả</a>
            </div>
            <div class="activity-list">
                <?php foreach ($recentActivities as $activity): ?>
                    <div class="activity-item d-flex align-items-start">
                        <img src="<?php echo $activity['avatar']; ?>" alt="Avatar" class="activity-avatar me-3 shadow-sm">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <h6 class="mb-0 fw-semibold"><?php echo $activity['user']; ?></h6>
                                <small class="text-muted"><?php echo $activity['time']; ?></small>
                            </div>
                            <p class="mb-1 text-muted">
                                <?php echo $activity['action']; ?> 
                                <span class="fw-semibold text-dark">"<?php echo $activity['book']; ?>"</span>
                            </p>
                            <?php 
                                $badgeClass = 'bg-primary';
                                $badgeText = 'Mượn';
                                if ($activity['type'] === 'return') { $badgeClass = 'bg-success'; $badgeText = 'Trả'; }
                                elseif ($activity['type'] === 'extend') { $badgeClass = 'bg-warning text-dark'; $badgeText = 'Gia hạn'; }
                            ?>
                            <span class="badge <?php echo $badgeClass; ?> btn-action-sm"><?php echo $badgeText; ?></span>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>