<?php
session_start();

require_once 'config/config.php';
require_once 'services/ApiService.php';

// Nếu không có thì mặc định là 'home'
$page = isset($_GET['page']) ? $_GET['page'] : 'home';

switch ($page) {
    case 'home':
        require_once 'controllers/HomeController.php';
        $controller = new HomeController();
        $controller->index();
        break;

    case 'book':
        echo "<h3>Chức năng Quản lý sách đang phát triển...</h3>";
        // Sau này sẽ tạo BookController.php và gọi ở đây
        break;

    default:
        echo "<h1 style='text-align:center; margin-top:50px'>404 - Trang không tồn tại</h1>";
        break;
}
?>