-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 19, 2026 lúc 05:45 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `library_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `authors`
--

CREATE TABLE `authors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `biography` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `bookcount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `authors`
--

INSERT INTO `authors` (`id`, `name`, `biography`, `created_at`, `updated_at`, `status`, `country`, `bookcount`) VALUES
(1, 'Updated Author Name', 'A well-known author with updated biography.', '2026-03-05 23:44:47', '2026-03-05 23:44:47', NULL, NULL, NULL),
(3, 'Lê Minh C', 'Chuyên gia về trí tuệ nhân tạo', '2026-03-05 23:44:47', '2026-03-05 23:44:47', NULL, NULL, NULL),
(4, 'Phạm Hoàng D', 'Nhà nghiên cứu về cấu trúc dữ liệu và giải thuật', '2026-03-05 23:44:47', '2026-03-05 23:44:47', NULL, NULL, NULL),
(5, 'Hoàng Anh E', 'Tác giả nhiều sách về cơ sở dữ liệu', '2026-03-05 23:44:47', '2026-03-05 23:44:47', NULL, NULL, NULL),
(6, 'Vũ Thanh F', 'Chuyên gia về an toàn thông tin mạng', '2026-03-09 10:00:00', '2026-03-09 10:00:00', NULL, NULL, NULL),
(7, 'New Author', 'A budding writer.', NULL, NULL, NULL, NULL, NULL),
(8, 'Haruki Murakami', 'Japanese writer. His books and stories have been translated into 50 languages.', NULL, NULL, NULL, NULL, NULL),
(9, '', 'An author with an empty name string.', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `publisher_id` int(11) DEFAULT NULL,
  `isbn` varchar(255) DEFAULT NULL,
  `published_year` int(11) DEFAULT NULL,
  `total_qty` int(11) DEFAULT NULL,
  `available_qty` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `books`
--

INSERT INTO `books` (`id`, `title`, `category_id`, `author_id`, `publisher_id`, `isbn`, `published_year`, `total_qty`, `available_qty`, `image_url`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Lập trình Python Cơ bản', NULL, NULL, NULL, NULL, NULL, 5, 5, NULL, '', '2026-03-02 22:45:57', NULL),
(3, 'Spring Boot Guide', 1, NULL, NULL, '978604000002', 2022, 8, 8, 'images/springboot.jpg', '', '2026-03-05 23:48:01', '2026-03-05 23:48:01'),
(4, 'Data Structures and Algorithms', 2, 4, 1, '978604000003', 2019, 12, 12, 'images/dsa.jpg', 'Cuốn sách trình bày các kiến thức cơ bản về Cấu trúc dữ liệu và giải thuật, là tài liệu học tập và tham khảo cho sinh viên ngành Công nghệ thông tin và Truyền thông. \r\n\r\nNội dung sách bao gồm: Giới thiệu về cấu trúc dữ liệu; Ngăn xếp (STACK); Đệ qui; Hàm đợi và danh sách nối đơn; Cây; Sắp xếp; Tìm kiếm; Đồ thị và những ứng dụng; Quản lý bộ nhớ', '2026-03-05 23:48:01', '2026-03-05 23:48:01'),
(5, 'Machine Learning Fundamentals', 3, 3, 3, '978604000004', 2021, 7, 7, 'images/ml.jpg', '', '2026-03-05 23:48:01', '2026-03-05 23:48:01'),
(6, 'SQL Database Design', 4, 5, NULL, '978604000005', 2018, 15, 15, 'images/sql.jpg', '', '2026-03-05 23:48:01', '2026-03-05 23:48:01'),
(7, 'Deep Learning Introduction', 3, 3, 3, '978604000006', 2023, 6, 6, 'images/deeplearning.jpg', '', '2026-03-05 23:48:01', '2026-03-05 23:48:01'),
(8, 'Advanced Java Programming', 1, 1, 1, '978604000007', 2021, 9, 9, 'images/java_adv.jpg', '', '2026-03-05 23:48:01', '2026-03-05 23:48:01'),
(9, 'Algorithm Design Techniques', 2, 4, 1, '978604000008', 2020, 11, 1, 'images/algorithm.jpg', '', '2026-03-05 23:48:01', '2026-04-19 15:37:02'),
(10, 'Database Systems Concepts', 4, 5, 4, '978604000009', 2017, 13, 12, 'unnamed.jpg', 'dfádfádf', '2026-03-05 23:48:01', '2026-03-05 23:48:01'),
(11, 'Modern Artificial Intelligence', 3, 3, 3, '978604000010', 2024, 5, 5, 'images/ai.jpg', '', '2026-03-05 23:48:01', '2026-03-05 23:48:01'),
(12, 'Bảo Mật Hệ Thống Web', 6, 6, 5, '978604000011', 2025, 20, 19, 'discord-profile-pictures-sfbi4olzfj2s5byh.jpg', 'fsdfsdf', '2026-03-09 10:00:00', '2026-03-09 10:00:00'),
(13, 'Flutter Cơ Bản', 1, NULL, NULL, '978604000012', 2026, 15, 15, 'images/flutter.jpg', '', '2026-03-09 10:00:00', '2026-03-09 10:00:00'),
(14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL),
(15, 'Minimal Book Example', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL),
(16, 'Minimal Book Title', NULL, NULL, NULL, '1234567890123', 2023, 1, 1, NULL, '', NULL, NULL),
(17, 'Minimal Title', NULL, NULL, NULL, '9780000000001', 2024, 1, 1, NULL, '', NULL, NULL),
(18, NULL, NULL, NULL, NULL, '9781234567890', 2023, 10, 10, NULL, '', NULL, NULL),
(19, '<script>alert(\'XSS Test\');</script>', NULL, NULL, NULL, '9781234567890', 2023, 1, 1, NULL, '', NULL, NULL),
(20, 'fsd', 1, 1, 1, '0978658647', 2022, 0, 0, 'unnamed.jpg', 'dfsdfsa', NULL, NULL),
(21, 'fsdfsa', 1, 1, 1, '123445768990', 2026, 0, 0, 'Chụp ảnh, đăng bài 3.png', '1dfádfsdà', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `book_copies`
--

CREATE TABLE `book_copies` (
  `id` int(11) NOT NULL,
  `book_id` int(11) DEFAULT NULL,
  `shelf_id` int(11) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `condition_status` varchar(255) DEFAULT NULL,
  `availability_status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `book_copies`
--

INSERT INTO `book_copies` (`id`, `book_id`, `shelf_id`, `barcode`, `condition_status`, `availability_status`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'PY001', 'DAMAGED', 'UNAVAILABLE', '2026-03-02 22:45:57', NULL),
(3, 12, 1, 'WEB002', 'NEW', 'BORROWED', '2026-03-09 10:00:00', '2026-03-09 10:00:00'),
(4, 13, 1, 'FLUTTER001', 'DAMAGED', 'UNAVAILABLE', '2026-03-09 10:00:00', '2026-03-09 10:00:00'),
(5, 9, 1, 'BASICCODE', 'GOOD', 'BORROWED', NULL, '2026-04-19 15:37:02'),
(6, 12, NULL, 'BC17756604592200', 'NEW', 'AVAILABLE', NULL, NULL),
(7, 12, NULL, 'BC17756604592491', 'NEW', 'AVAILABLE', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Lập trình', 'Sách về lập trình và phát triển phần mềm', '2026-03-05 23:44:35', '2026-03-05 23:44:35'),
(2, 'Khoa học máy tính', 'Sách về thuật toán, cấu trúc dữ liệu', '2026-03-05 23:44:35', '2026-03-05 23:44:35'),
(3, 'Trí tuệ nhân tạo', 'Sách về AI, Machine Learning, Deep Learning', '2026-03-05 23:44:35', '2026-03-05 23:44:35'),
(4, 'Cơ sở dữ liệu', 'Sách về SQL, NoSQL và hệ quản trị CSDL', '2026-03-05 23:44:35', '2026-03-05 23:44:35'),
(5, 'Tiểu thuyết', 'Sách văn học và tiểu thuyết', '2026-03-05 23:44:35', '2026-03-05 23:44:35'),
(6, 'Bảo mật', 'Sách về Cyber Security và Network', '2026-03-09 10:00:00', '2026-03-09 10:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fines`
--

CREATE TABLE `fines` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `loan_detail_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `fines`
--

INSERT INTO `fines` (`id`, `user_id`, `loan_detail_id`, `amount`, `reason`, `is_paid`, `created_at`, `updated_at`) VALUES
(3, 14, 13, 500000.00, 'Mượn sách quá hạn', 1, '2026-04-08 15:20:46', '2026-04-08 15:21:01'),
(4, 14, 12, 500000.00, 'Mượn sách quá hạn', 0, '2026-04-08 15:42:39', '2026-04-08 15:42:39'),
(5, 1, 8, 500000.00, 'Mượn sách quá hạn', 1, '2026-04-08 15:45:03', '2026-04-08 15:47:11'),
(6, 2, 4, 100000.00, 'Trả trễ hạn 10 ngày', 0, '2026-04-08 15:48:49', '2026-04-08 15:48:49'),
(7, 1, 5, 6930000.00, 'Trả trễ hạn 693 ngày', 0, '2026-04-08 16:04:00', '2026-04-08 16:04:00'),
(8, 1, 6, 6780000.00, 'Trả trễ hạn 678 ngày', 0, '2026-04-08 16:36:47', '2026-04-08 16:36:47'),
(9, 1, 6, 50000.00, 'Sách bị hư hỏng - sách bị hỏng', 0, '2026-04-08 16:36:47', '2026-04-08 16:36:47'),
(10, 14, 13, 2000000.00, 'mất 10 quyển sách', 0, '2026-04-18 09:15:26', '2026-04-18 09:15:26'),
(11, 14, 11, 40000.00, 'Trả trễ hạn 4 ngày', 0, '2026-04-18 09:16:12', '2026-04-18 09:16:12'),
(12, 1, 8, 6810000.00, 'Trả trễ hạn 681 ngày', 0, '2026-04-18 09:16:36', '2026-04-18 09:16:36'),
(13, 1, 8, 50000.00, 'Sách bị hư hỏng', 0, '2026-04-18 09:16:36', '2026-04-18 09:16:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loans`
--

CREATE TABLE `loans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `borrow_date` datetime DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `loans`
--

INSERT INTO `loans` (`id`, `user_id`, `borrow_date`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, '2023-10-10 08:00:00', NULL, '2026-03-02 22:45:57', NULL),
(2, 7, '2026-03-09 09:00:00', 'Độc giả mới mượn sách', '2026-03-09 10:00:00', '2026-03-09 10:00:00'),
(3, 6, '2026-03-23 17:00:00', 'mượn sách', NULL, NULL),
(4, 2, '2026-03-26 17:00:00', 'ádfádfsdf', NULL, NULL),
(5, 1, '2024-04-30 17:00:00', 'Loan for a new user and popular book', NULL, NULL),
(6, 1, '2024-05-14 17:00:00', 'Wrong data type test', NULL, NULL),
(7, 1, '2024-05-19 17:00:00', '\'; DROP TABLE loans; --', NULL, NULL),
(8, 1, '2024-05-21 17:00:00', '<script>alert(\'XSS Attack!\')</script>', NULL, NULL),
(12, 14, '2026-04-07 17:00:00', 'ádfsfsf', NULL, NULL),
(13, 14, '2026-04-07 17:00:00', 'Mượn sách 12 ngày', NULL, NULL),
(14, 14, '2026-04-07 17:00:00', 'fsdfsa', NULL, NULL),
(15, 15, '2026-04-19 15:37:02', 'Tạo tự động từ phiếu đặt #RES015', '2026-04-19 15:37:02', '2026-04-19 15:37:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loan_details`
--

CREATE TABLE `loan_details` (
  `id` int(11) NOT NULL,
  `loan_id` int(11) DEFAULT NULL,
  `book_copy_id` int(11) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `return_date` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `loan_details`
--

INSERT INTO `loan_details` (`id`, `loan_id`, `book_copy_id`, `due_date`, `return_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2023-10-24 17:00:00', NULL, 'borrowing', '2026-03-02 22:45:57', NULL),
(4, 4, 4, '2026-03-29 16:59:59', '2026-04-08 15:48:49', 'returned', NULL, NULL),
(5, 5, 1, '2024-05-15 16:59:59', '2026-04-08 16:04:00', 'returned', NULL, NULL),
(6, 6, 1, '2024-05-30 16:59:59', '2026-04-08 16:36:47', 'returned', NULL, NULL),
(7, 7, 1, '2024-06-04 16:59:59', NULL, 'borrowing', NULL, NULL),
(8, 8, 1, '2024-06-06 16:59:59', '2026-04-18 09:16:36', 'returned', NULL, '2026-04-18 09:16:36'),
(11, 12, 5, '2026-04-14 16:59:59', '2026-04-18 09:16:12', 'returned', NULL, '2026-04-18 09:16:12'),
(12, 13, 5, '2026-04-20 16:59:59', '2026-04-08 15:05:24', 'returned', NULL, NULL),
(13, 14, 3, '2026-04-30 16:59:59', NULL, 'borrowing', NULL, NULL),
(14, 15, 5, '2026-05-03 15:37:02', NULL, 'borrowing', '2026-04-19 15:37:02', '2026-04-19 15:37:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `publishers`
--

CREATE TABLE `publishers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `publishers`
--

INSERT INTO `publishers` (`id`, `name`, `address`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Updated Publisher Name', '123 New Address', 'updated@publisher.com', '2026-03-05 23:44:55', '2026-03-05 23:44:55'),
(3, 'NXB Khoa Học', 'Đà Nẵng, Việt Nam', 'contact@khoahoc.vn', '2026-03-05 23:44:55', '2026-03-05 23:44:55'),
(4, 'NXB Tri Thức', 'Hà Nội, Việt Nam', 'support@trithuc.vn', '2026-03-05 23:44:55', '2026-03-05 23:44:55'),
(5, 'NXB Trẻ', 'TP Hồ Chí Minh, Việt Nam', 'info@nxbtre.vn', '2026-03-09 10:00:00', '2026-03-09 10:00:00'),
(6, 'New Publisher Co.', '456 Main St', 'contact@newpublisher.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `reservation_date` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `book_id`, `reservation_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 1, '2026-03-06 00:00:11', 'approved', '2026-03-06 00:00:11', '2026-04-18 15:14:59'),
(3, 5, 3, '2026-03-06 00:00:11', 'cancelled', '2026-03-06 00:00:11', '2026-04-18 15:15:09'),
(4, 3, 4, '2026-03-06 00:00:11', 'cancelled', '2026-03-06 00:00:11', '2026-03-06 00:00:11'),
(5, 4, 5, '2026-03-06 00:00:11', 'pending', '2026-03-06 00:00:11', '2026-03-06 00:00:11'),
(6, 3, 1, '2024-12-25 03:00:00', 'pending', NULL, NULL),
(7, 5, 3, '2024-10-01 02:00:00', 'completed', NULL, '2026-04-18 15:46:34'),
(8, 3, 1, '2024-12-25 03:00:00', 'completed', NULL, NULL),
(9, 3, 1, '2024-12-25 03:00:00', 'cancelled', NULL, NULL),
(11, 14, 7, '2026-03-17 23:31:52', 'pending', NULL, NULL),
(12, 15, 12, '2026-04-19 02:00:00', 'completed', '2026-04-18 10:35:21', '2026-04-18 10:35:21'),
(13, 15, 12, '2026-04-30 02:00:00', 'pending', '2026-04-18 10:37:13', '2026-04-18 10:37:13'),
(14, 15, 4, '2026-04-20 02:00:00', 'completed', '2026-04-19 14:51:49', '2026-04-19 14:52:26'),
(15, 15, 9, '2026-04-20 02:00:00', 'completed', '2026-04-19 15:35:45', '2026-04-19 15:37:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `book_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 5, 'Sách rất hay cho người mới học Java', '2026-03-06 00:16:01', '2026-03-06 00:16:01'),
(3, 5, 3, 5, 'Cấu trúc dữ liệu trình bày rất chi tiết', '2026-03-06 00:16:01', '2026-03-06 00:16:01'),
(4, 3, 5, 4, 'Sách SQL dễ học', '2026-03-06 00:16:01', '2026-03-06 00:16:01'),
(5, 4, 4, 5, 'AI cơ bản nhưng rất hữu ích', '2026-03-06 00:16:01', '2026-03-06 00:16:01'),
(6, 15, 12, 10, 'sách hay bổ ích', '2026-04-18 08:57:35', '2026-04-18 08:57:35'),
(7, 15, 12, 5, 'sách ngon vờ lờ', '2026-04-18 10:34:48', '2026-04-18 10:34:48'),
(8, 15, 4, 4, 'sách ok, đọc dễ hiểu, thấu cảm nội dung', '2026-04-19 14:51:18', '2026-04-19 14:51:32'),
(9, 15, 9, 5, 'Sách hay, truyền cảm cho người đọc', '2026-04-19 15:36:03', '2026-04-19 15:36:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'admin', '2026-03-05 23:57:30', '2026-03-05 23:57:30'),
(2, 'librarian', '2026-03-05 23:57:30', '2026-03-05 23:57:30'),
(3, 'user', '2026-03-05 23:57:30', '2026-03-05 23:57:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shelves`
--

CREATE TABLE `shelves` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shelves`
--

INSERT INTO `shelves` (`id`, `name`, `floor`, `created_at`, `updated_at`) VALUES
(1, 'Kệ A1 - Lập trình cơ bản', 1, '2026-03-09 10:00:00', '2026-03-09 10:00:00'),
(2, 'Kệ B2 - Trí tuệ nhân tạo', 2, '2026-03-09 10:00:00', '2026-03-09 10:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `masv` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `role_id`, `full_name`, `email`, `password`, `phone`, `status`, `created_at`, `updated_at`, `masv`) VALUES
(1, NULL, 'Nguyễn Văn A', 'nva@gmail.com', NULL, NULL, 'ACTIVE', '2026-03-02 22:45:57', NULL, ''),
(2, 1, 'Nguyen Van Admin', 'admin@library.com', '123456', '0900000001', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39', ''),
(3, 2, 'Tran Thu Thu', 'librarian@library.com', '123456', '0900000002', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39', ''),
(4, 3, 'Le Minh Anh', 'anh@gmail.com', '123456', '0900000003', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39', ''),
(5, 3, 'Pham Hoang Nam', 'nam@gmail.com', '123456', '0900000004', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39', ''),
(6, 3, 'Hoang Thu Ha', 'ha@gmail.com', '123456', '0900000005', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39', ''),
(7, 3, 'Đỗ Văn G', 'g@gmail.com', '123456', '0900000006', 'active', '2026-03-09 10:00:00', '2026-03-09 10:00:00', ''),
(8, 3, 'Test User', 'test.user@example.com', '$2a$10$vfopNDFZYbhvGWH6r8CDXeC/douj84kawjOFxcXVkvUu6oc2fdgI.', '0987654321', 'ACTIVE', NULL, NULL, ''),
(9, 3, 'Nguyen Van A', 'nguyenvana@example.com', '$2a$10$qOQ9W.2i63j1xXkwvW7YoOSFe/9Stsxnip/oasLu7cvQXtVMF1C5G', '0912345678', 'ACTIVE', NULL, NULL, ''),
(10, 3, NULL, 'missingname@example.com', '$2a$10$eMQNa.Ph/4dLtD4qocr3vuPZ63.VLW.si3q/wn5ra8Krw51YDZxcS', '0911223344', 'ACTIVE', NULL, NULL, ''),
(11, 3, 'Tran Thi B', NULL, '$2a$10$0i2ztMm88IEG3RlT7WkPw.ijwJQVnP0blpRt9XN8B1qxRXOkOmBAy', '0987654321', 'ACTIVE', NULL, NULL, ''),
(12, 3, 'Le Van C', 'missingpass@example.com', NULL, '0900112233', 'ACTIVE', NULL, NULL, ''),
(13, 3, 'Pham Thi D', 'invalid-email-format', '$2a$10$/H69tCQvXJvkWUsxAaK96us5Ijnlsx.eDumZxBhNuGbwKYcIL9SWG', '0977889900', 'ACTIVE', NULL, NULL, ''),
(14, 1, 'Admin', 'admin@gmail.com', '$2a$10$w5CbmWb1WyvEabZHFesNf.xiGg1/PxTIixbq0DP2JqHmsfcx95Qsa', '0123456789', 'ACTIVE', NULL, NULL, ''),
(15, 3, 'Dũng', 'nguyenanhdung831@gmail.com', '$2a$10$XtIWndqI9tWfOdXjk1JC6.ZfPeeX448WaWp8LrSQbRPVDdwdyL0Uy', '012345678910', 'ACTIVE', NULL, NULL, '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wishlists`
--

CREATE TABLE `wishlists` (
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `wishlists`
--

INSERT INTO `wishlists` (`user_id`, `book_id`, `created_at`, `updated_at`) VALUES
(3, 1, '2026-03-06 00:16:30', NULL),
(3, 3, '2026-03-06 00:16:30', NULL),
(5, 4, '2026-03-06 00:16:30', NULL),
(5, 5, '2026-03-06 00:16:30', NULL),
(15, 12, '2026-04-18 10:43:13', '2026-04-18 10:43:13.000000');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_book_category` (`category_id`),
  ADD KEY `fk_book_author` (`author_id`),
  ADD KEY `fk_book_publisher` (`publisher_id`);

--
-- Chỉ mục cho bảng `book_copies`
--
ALTER TABLE `book_copies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_copy_book` (`book_id`),
  ADD KEY `fk_copy_shelf` (`shelf_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `fines`
--
ALTER TABLE `fines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_fine_user` (`user_id`),
  ADD KEY `fk_fine_detail` (`loan_detail_id`);

--
-- Chỉ mục cho bảng `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_loan_user` (`user_id`);

--
-- Chỉ mục cho bảng `loan_details`
--
ALTER TABLE `loan_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_detail_loan` (`loan_id`),
  ADD KEY `fk_detail_copy` (`book_copy_id`);

--
-- Chỉ mục cho bảng `publishers`
--
ALTER TABLE `publishers`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_res_user` (`user_id`),
  ADD KEY `fk_res_book` (`book_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_review_user` (`user_id`),
  ADD KEY `fk_review_book` (`book_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shelves`
--
ALTER TABLE `shelves`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_role` (`role_id`);

--
-- Chỉ mục cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`user_id`,`book_id`),
  ADD KEY `fk_wish_book` (`book_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `book_copies`
--
ALTER TABLE `book_copies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fines`
--
ALTER TABLE `fines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `loan_details`
--
ALTER TABLE `loan_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `publishers`
--
ALTER TABLE `publishers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shelves`
--
ALTER TABLE `shelves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `fk_book_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_book_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_book_publisher` FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `book_copies`
--
ALTER TABLE `book_copies`
  ADD CONSTRAINT `fk_copy_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_copy_shelf` FOREIGN KEY (`shelf_id`) REFERENCES `shelves` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `fines`
--
ALTER TABLE `fines`
  ADD CONSTRAINT `fk_fine_detail` FOREIGN KEY (`loan_detail_id`) REFERENCES `loan_details` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_fine_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `fk_loan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `loan_details`
--
ALTER TABLE `loan_details`
  ADD CONSTRAINT `fk_detail_copy` FOREIGN KEY (`book_copy_id`) REFERENCES `book_copies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detail_loan` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_res_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_res_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `fk_wish_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wish_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
