<?php
// cPanel Email Handler
// Upload this file to your cPanel public_html directory

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
 $to = $_POST['to'] ?? 'hello@foodvrse.com';
$from = $_POST['from'] ?? 'noreply@foodvrse.com';
$subject = $_POST['subject'] ?? 'Business Partnership Application';
$message = $_POST['message'] ?? '';
$name = $_POST['name'] ?? 'Unknown';

// Validate required fields
if (empty($message) || empty($name)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Create email headers
$headers = array();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: ' . $name . ' <' . $from . '>';
$headers[] = 'Reply-To: ' . $from;
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Create HTML email content
$htmlMessage = '
<!DOCTYPE html>
<html>
<head>
    <title>Business Partnership Application</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3D6C56; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { color: #666; font-size: 14px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Business Partnership Application</h1>
        </div>
        
        <div class="content">
            <h3>Application Details:</h3>
            ' . nl2br(htmlspecialchars($message)) . '
        </div>
        
        <div class="footer">
            <p>This application was submitted through the FoodVrse website.</p>
            <p>From: ' . htmlspecialchars($name) . ' (' . htmlspecialchars($from) . ')</p>
        </div>
    </div>
</body>
</html>';

// Send email
$mailSent = mail($to, $subject, $htmlMessage, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email'
    ]);
}
?>

