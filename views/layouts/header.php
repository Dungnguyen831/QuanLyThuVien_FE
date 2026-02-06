<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo APP_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background-color: #f8f9fa; }
        .sidebar { min-height: 100vh; background: #343a40; color: white; }
        .sidebar a { color: #adb5bd; text-decoration: none; display: block; padding: 12px 20px; }
        .sidebar a:hover, .sidebar a.active { background: #495057; color: white; }
    </style>
</head>
<body>
    <div class="d-flex">
        <div class="sidebar p-3" style="width: 250px;">
            <h4 class="text-center mb-4"><i class="fas fa-book-reader"></i> TV Số</h4>
            <a href="index.php?page=home" class="active"><i class="fas fa-home me-2"></i> Trang chủ</a>
            <a href="index.php?page=book"><i class="fas fa-book me-2"></i> Quản lý Sách</a>
            <a href="#"><i class="fas fa-users me-2"></i> Độc giả</a>
            <a href="#"><i class="fas fa-history me-2"></i> Mượn trả</a>
        </div>

        <div class="flex-fill p-4">
            <nav class="navbar navbar-light bg-white shadow-sm mb-4 rounded px-3">
                <span class="navbar-brand mb-0 h1">Dashboard</span>
                <div>
                    <span class="me-2">Xin chào, <b>Admin</b></span>
                    <button class="btn btn-sm btn-outline-danger">Đăng xuất</button>
                </div>
            </nav>