-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 09, 2026 lúc 10:02 AM
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
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `authors`
--

INSERT INTO `authors` (`id`, `name`, `biography`, `created_at`, `updated_at`) VALUES
(1, 'Nguyễn Văn A', 'Tác giả chuyên viết sách về lập trình Java', '2026-03-05 23:44:47', '2026-03-05 23:44:47'),
(2, 'Trần Văn B', 'Giảng viên khoa Công nghệ thông tin', '2026-03-05 23:44:47', '2026-03-05 23:44:47'),
(3, 'Lê Minh C', 'Chuyên gia về trí tuệ nhân tạo', '2026-03-05 23:44:47', '2026-03-05 23:44:47'),
(4, 'Phạm Hoàng D', 'Nhà nghiên cứu về cấu trúc dữ liệu và giải thuật', '2026-03-05 23:44:47', '2026-03-05 23:44:47'),
(5, 'Hoàng Anh E', 'Tác giả nhiều sách về cơ sở dữ liệu', '2026-03-05 23:44:47', '2026-03-05 23:44:47');

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
  `image_url` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `books`
--

INSERT INTO `books` (`id`, `title`, `category_id`, `author_id`, `publisher_id`, `isbn`, `published_year`, `total_qty`, `available_qty`, `image_url`, `created_at`, `updated_at`, `author`) VALUES
(1, 'Lập trình Python Cơ bản', NULL, NULL, NULL, NULL, NULL, 5, 4, NULL, '2026-03-02 22:45:57', NULL, NULL),
(7, 'Java Programming Basics', 1, 1, 1, '978604000001', 2020, 10, 10, 'images/java.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(8, 'Spring Boot Guide', 1, 2, 2, '978604000002', 2022, 8, 8, 'images/springboot.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(9, 'Data Structures and Algorithms', 2, 4, 1, '978604000003', 2019, 12, 12, 'images/dsa.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(10, 'Machine Learning Fundamentals', 3, 3, 3, '978604000004', 2021, 7, 7, 'images/ml.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(11, 'SQL Database Design', 4, 5, 2, '978604000005', 2018, 15, 15, 'images/sql.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(12, 'Deep Learning Introduction', 3, 3, 3, '978604000006', 2023, 6, 6, 'images/deeplearning.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(13, 'Advanced Java Programming', 1, 1, 1, '978604000007', 2021, 9, 9, 'images/java_adv.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(14, 'Algorithm Design Techniques', 2, 4, 1, '978604000008', 2020, 11, 11, 'images/algorithm.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(15, 'Database Systems Concepts', 4, 5, 4, '978604000009', 2017, 13, 13, 'images/db.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL),
(16, 'Modern Artificial Intelligence', 3, 3, 3, '978604000010', 2024, 5, 5, 'images/ai.jpg', '2026-03-05 23:48:01', '2026-03-05 23:48:01', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `book_copies`
--

CREATE TABLE `book_copies` (
  `id` int(11) NOT NULL,
  `book_id` int(11) DEFAULT NULL,
  `shelf_id` int(11) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `condition_status` varchar(50) DEFAULT NULL,
  `availability_status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `book_copies`
--

INSERT INTO `book_copies` (`id`, `book_id`, `shelf_id`, `barcode`, `condition_status`, `availability_status`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'PY001', NULL, 'BORROWED', '2026-03-02 22:45:57', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
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
(5, 'Tiểu thuyết', 'Sách văn học và tiểu thuyết', '2026-03-05 23:44:35', '2026-03-05 23:44:35');

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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loans`
--

CREATE TABLE `loans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `borrow_date` datetime DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `loans`
--

INSERT INTO `loans` (`id`, `user_id`, `borrow_date`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, '2023-10-10 08:00:00', NULL, '2026-03-02 22:45:57', NULL);

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
(1, 1, 1, '2023-10-24 17:00:00', NULL, 'borrowing', '2026-03-02 22:45:57', NULL);

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
(1, 'NXB Giáo Dục', 'Hà Nội, Việt Nam', 'contact@giaoduc.vn', '2026-03-05 23:44:55', '2026-03-05 23:44:55'),
(2, 'NXB Công Nghệ', 'TP Hồ Chí Minh, Việt Nam', 'info@congnghe.vn', '2026-03-05 23:44:55', '2026-03-05 23:44:55'),
(3, 'NXB Khoa Học', 'Đà Nẵng, Việt Nam', 'contact@khoahoc.vn', '2026-03-05 23:44:55', '2026-03-05 23:44:55'),
(4, 'NXB Tri Thức', 'Hà Nội, Việt Nam', 'support@trithuc.vn', '2026-03-05 23:44:55', '2026-03-05 23:44:55');

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
(6, 3, 1, '2026-03-06 00:00:11', 'pending', '2026-03-06 00:00:11', '2026-03-06 00:00:11'),
(7, 4, 2, '2026-03-06 00:00:11', 'pending', '2026-03-06 00:00:11', '2026-03-06 00:00:11'),
(8, 5, 3, '2026-03-06 00:00:11', 'approved', '2026-03-06 00:00:11', '2026-03-06 00:00:11'),
(9, 3, 4, '2026-03-06 00:00:11', 'cancelled', '2026-03-06 00:00:11', '2026-03-06 00:00:11'),
(10, 4, 5, '2026-03-06 00:00:11', 'pending', '2026-03-06 00:00:11', '2026-03-06 00:00:11');

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
(2, 4, 2, 4, 'Spring Boot giải thích khá dễ hiểu', '2026-03-06 00:16:01', '2026-03-06 00:16:01'),
(3, 5, 3, 5, 'Cấu trúc dữ liệu trình bày rất chi tiết', '2026-03-06 00:16:01', '2026-03-06 00:16:01'),
(4, 3, 5, 4, 'Sách SQL dễ học', '2026-03-06 00:16:01', '2026-03-06 00:16:01'),
(5, 4, 4, 5, 'AI cơ bản nhưng rất hữu ích', '2026-03-06 00:16:01', '2026-03-06 00:16:01');

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
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `role_id`, `full_name`, `email`, `password`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Nguyễn Văn A', 'nva@gmail.com', NULL, NULL, 'ACTIVE', '2026-03-02 22:45:57', NULL),
(2, 1, 'Nguyen Van Admin', 'admin@library.com', '123456', '0900000001', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39'),
(3, 2, 'Tran Thu Thu', 'librarian@library.com', '123456', '0900000002', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39'),
(4, 3, 'Le Minh Anh', 'anh@gmail.com', '123456', '0900000003', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39'),
(5, 3, 'Pham Hoang Nam', 'nam@gmail.com', '123456', '0900000004', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39'),
(6, 3, 'Hoang Thu Ha', 'ha@gmail.com', '123456', '0900000005', 'active', '2026-03-05 23:57:39', '2026-03-05 23:57:39');

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
(4, 2, '2026-03-06 00:16:30', NULL),
(5, 4, '2026-03-06 00:16:30', NULL),
(5, 5, '2026-03-06 00:16:30', NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `book_copies`
--
ALTER TABLE `book_copies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `fines`
--
ALTER TABLE `fines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `loan_details`
--
ALTER TABLE `loan_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `publishers`
--
ALTER TABLE `publishers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `shelves`
--
ALTER TABLE `shelves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
