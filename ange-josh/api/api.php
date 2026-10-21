<?php
// Ange & Josh storage API. PHP 7.4+ with pdo_sqlite. No MySQL setup needed.
header('Content-Type: application/json');
header('Cache-Control: no-store');
$dir = __DIR__ . '/data';
if (!is_dir($dir)) { mkdir($dir, 0750, true); file_put_contents("$dir/.htaccess", "Require all denied\nDeny from all\n"); }
$db = new PDO('sqlite:' . $dir . '/love.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT)');

function get($db, $k) { $s = $db->prepare('SELECT v FROM kv WHERE k=?'); $s->execute([$k]); return $s->fetchColumn(); }
function put($db, $k, $v) { $s = $db->prepare('REPLACE INTO kv (k,v) VALUES (?,?)'); $s->execute([$k, $v]); }
function out($code, $arr) { http_response_code($code); echo json_encode($arr); exit; }

$pass = $_SERVER['HTTP_X_PASS'] ?? '';
$hash = get($db, 'pw');
if ($hash === false) {                       // first visit: this password becomes the shared login
    if (strlen($pass) < 4) out(401, ['error' => 'setup']);
    put($db, 'pw', password_hash($pass, PASSWORD_DEFAULT));
} elseif (!password_verify($pass, $hash)) {
    usleep(400000); out(401, ['error' => 'login']);
}

$a = $_GET['a'] ?? '';
if ($a === 'load') {
    out(200, ['rev' => (int)get($db, 'rev'), 'data' => json_decode(get($db, 'data') ?: 'null'), 'first' => $hash === false]);
}
if ($a === 'save') {
    $in = json_decode(file_get_contents('php://input'), true);
    if (!is_array($in) || !isset($in['data'])) out(400, ['error' => 'bad']);
    $db->beginTransaction();
    $rev = (int)get($db, 'rev');
    if ($rev !== (int)$in['rev']) { $db->rollBack(); out(409, ['error' => 'stale']); }
    put($db, 'data', json_encode($in['data'], JSON_UNESCAPED_UNICODE));
    put($db, 'rev', (string)($rev + 1));
    $db->commit();
    out(200, ['rev' => $rev + 1]);
}
out(400, ['error' => 'unknown']);
