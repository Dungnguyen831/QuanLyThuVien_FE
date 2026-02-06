<?php
class ApiService {
    public static function callAPI($endpoint, $method = 'GET', $data = []) {
        // Cấu hình curl để gọi sang Java
        $url = API_BASE_URL . $endpoint;
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 5); // Timeout nhanh nếu không thấy Java

        if ($method != 'GET') {
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
            if (!empty($data)) {
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
                curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            }
        }

        $response = curl_exec($curl);
        $error = curl_error($curl);
        curl_close($curl);

        // Nếu Java chưa chạy hoặc lỗi kết nối, trả về dữ liệu giả để test giao diện
        if ($error) {
            return null; // Trả về null để Controller biết mà xử lý
        }

        return json_decode($response, true);
    }
}
?>