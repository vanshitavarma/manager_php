<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

class HealthController extends BaseController
{
    public function index()
    {
        $dbStatus = 'Unknown';
        $dbError  = null;
        $tables   = [];

        try {
            $db = \Config\Database::connect();
            $db->connect();
            if ($db->connID) {
                $dbStatus = 'Connected';
                $tables = $db->listTables();
            } else {
                $dbStatus = 'Failed to connect';
            }
        } catch (\Exception $e) {
            $dbStatus = 'Exception during connection';
            $dbError = $e->getMessage();
        }

        return $this->response->setStatusCode(200)->setJSON([
            'status'     => 'ok',
            'api_status' => 'Teacher API is running',
            'database'   => [
                'status' => $dbStatus,
                'error'  => $dbError,
                'tables' => $tables,
            ],
            'time'       => date('Y-m-d H:i:s'),
        ]);
    }
}
