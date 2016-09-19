<?php

use \Workerman\Worker;
use \Workerman\Autoloader;
use \Applications\iyov\Gateway;

// 自动加载类
require_once __DIR__ . '/../../Workerman/Autoloader.php';
Autoloader::setRootPath(__DIR__);

$gateway_worker = new Worker('websocket://0.0.0.0:4355');

$gateway_worker->name = 'iyov-gateway';

$gateway_worker->count = 1;

$gateway_worker->onWorkerStart = function() use ($gateway_worker) {
	Gateway::init($gateway_worker);
};