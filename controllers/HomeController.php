<?php
class HomeController {
    public function index() {
        // 1. Dữ liệu giả cho các thẻ thống kê
        $stats = [
            'total_books' => '12.450',
            'books_trend' => '+5%',
            'borrowing' => '342',
            'borrowing_trend' => '+12%',
            'new_users' => '15',
            'new_users_trend' => '+3 h.nay',
            'overdue' => '8'
        ];

        // 2. Dữ liệu giả cho biểu đồ "Xu hướng mượn sách" (7 ngày qua)
        $chartData = [
            'labels' => ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            'data'   => [65, 59, 80, 81, 56, 124, 40]
        ];

        // 3. Dữ liệu giả cho danh sách "Hoạt động gần đây"
        $recentActivities = [
            ['user' => 'Lê Minh Tú', 'avatar' => 'https://i.pravatar.cc/150?img=1', 'action' => 'Mượn sách', 'book' => 'Nhà Giả Kim', 'time' => '2 phút trước', 'type' => 'borrow'],
            ['user' => 'Phạm Thu Hà', 'avatar' => 'https://i.pravatar.cc/150?img=5', 'action' => 'Trả sách', 'book' => 'Harry Potter tập 1', 'time' => '15 phút trước', 'type' => 'return'],
            ['user' => 'Nguyễn Thành', 'avatar' => 'https://i.pravatar.cc/150?img=3', 'action' => 'Mượn sách', 'book' => 'Lập trình Python', 'time' => '1 giờ trước', 'type' => 'borrow'],
            ['user' => 'Trần Hùng', 'avatar' => 'https://i.pravatar.cc/150?img=8', 'action' => 'Gia hạn sách', 'book' => 'Kinh tế học vĩ mô', 'time' => '3 giờ trước', 'type' => 'extend'],
        ];

        // Chuẩn bị dữ liệu để truyền sang View
        $data = [
            'stats' => $stats,
            'chartData' => $chartData,
            'recentActivities' => $recentActivities,
            'today' => date('l, d F Y')
        ];

        // Gọi render View (sử dụng hàm render của Base Controller nếu đã tạo, hoặc làm thủ công như dưới đây)
        extract($data);
        ob_start();
        require_once 'views/home/index.php';
        $content = ob_get_clean();
        
        // Thêm script vẽ biểu đồ vào layout
        ob_start();
        ?>
        <script>
            const ctx = document.getElementById('borrowTrendChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: <?php echo json_encode($chartData['labels']); ?>,
                    datasets: [{
                        label: 'Sách mượn',
                        data: <?php echo json_encode($chartData['data']); ?>,
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        borderColor: '#0d6efd',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#0d6efd',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#2c3e50',
                            titleFont: { size: 13 },
                            bodyFont: { size: 14 },
                            padding: 10,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y + ' lượt';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { borderDash: [5, 5], drawBorder: false, color: '#f0f2f5' },
                            ticks: { font: { size: 11 }, color: '#7f8c8d', padding: 10 }
                        },
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { font: { size: 11 }, color: '#7f8c8d', padding: 10 }
                        }
                    }
                }
            });
        </script>
        <?php
        $extra_scripts = ob_get_clean();

        require_once 'views/layouts/main.php';
    }
}
?>