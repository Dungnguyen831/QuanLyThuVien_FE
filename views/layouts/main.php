<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo APP_NAME; ?> - Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="wrapper">
        <nav id="sidebar">
            <div class="sidebar-header d-flex align-items-center">
                <i class="fas fa-book-reader fa-2x text-primary me-3"></i>
                <h5 class="mb-0 fw-bold">LMS PRO</h5>
            </div>

            <ul class="list-unstyled components">
                <li class="active">
                    <a href="index.php?page=home"><i class="fas fa-th-large"></i> Dashboard</a>
                </li>
                <li>
                    <a href="index.php?page=book"><i class="fas fa-book"></i> Sách</a>
                </li>
                <li>
                    <a href="#"><i class="fas fa-exchange-alt"></i> Mượn/Trả</a>
                </li>
                <li>
                    <a href="#"><i class="fas fa-users"></i> Bạn đọc</a>
                </li>
                <li>
                    <a href="#"><i class="fas fa-chart-bar"></i> Báo cáo</a>
                </li>
            </ul>

            <div class="sidebar-footer">
                <div class="d-flex align-items-center">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=0D6EFD&color=fff" class="rounded-circle me-3" width="40" alt="Admin">
                    <div>
                        <h6 class="mb-0 fw-bold">Trần Văn Admin</h6>
                        <small class="text-muted">Quản trị viên</small>
                    </div>
                </div>
            </div>
        </nav>

        <div id="content">
            <nav class="navbar navbar-expand-lg navbar-light navbar-custom">
                <div class="container-fluid">
                    <div class="d-flex align-items-center w-50 search-bar">
                        <i class="fas fa-search text-muted position-absolute ps-3"></i>
                        <input type="text" class="form-control py-2" placeholder="Tìm kiếm sách, độc giả...">
                    </div>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                            <li class="nav-item mx-2">
                                <a class="nav-link text-muted position-relative" href="#">
                                    <i class="fas fa-bell fa-lg"></i>
                                    <span class="position-absolute top-10 start-80 translate-middle p-1 bg-danger border border-light rounded-circle">
                                        <span class="visually-hidden">New alerts</span>
                                    </span>
                                </a>
                            </li>
                            <li class="nav-item mx-2">
                                <a class="nav-link text-muted" href="#"><i class="fas fa-cog fa-lg"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <?php echo $content; ?>

            <footer class="text-center text-muted py-4 mt-5">
                <small>© 2023 LMS Pro Library Management System.</small>
            </footer>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <?php if (isset($extra_scripts)) echo $extra_scripts; ?>
</body>
</html>