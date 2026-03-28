<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AuthUserModel;

class UserController extends BaseController
{
    public function index()
    {
        $model = new AuthUserModel();
        $users = $model->select('id, email, first_name, last_name, phone, created_at')->findAll();

        return $this->response->setStatusCode(200)->setJSON([
            'status' => true,
            'data'   => $users,
        ]);
    }
}
