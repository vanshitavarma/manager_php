<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

class HealthController extends BaseController
{
    public function index()
    {
        return $this->response->setStatusCode(200)->setJSON([
            'status'  => 'ok',
            'message' => 'Teacher API is running',
            'time'    => date('Y-m-d H:i:s'),
        ]);
    }
}
