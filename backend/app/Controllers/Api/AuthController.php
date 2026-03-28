<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use Firebase\JWT\JWT;

class AuthController extends BaseController
{
    public function register()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'first_name'      => 'required|min_length[2]',
            'last_name'       => 'required|min_length[2]',
            'email'           => 'required|valid_email|is_unique[auth_user.email]',
            'password'        => 'required|min_length[6]',
            'university_name' => 'required',
            'gender'          => 'required|in_list[male,female,other]',
            'year_joined'     => 'required|exact_length[4]',
        ];

        if (!$this->validateData($input, $rules)) {
            return $this->response->setStatusCode(422)->setJSON([
                'status'  => false,
                'message' => 'Validation failed',
                'errors'  => $this->validator->getErrors(),
            ]);
        }

        $authModel = new AuthUserModel();
        $teacherModel = new TeacherModel();
        $db = \Config\Database::connect();

        $db->transStart();

        // 1. Insert into auth_user
        $userId = $authModel->insert([
            'first_name' => $input['first_name'],
            'last_name'  => $input['last_name'],
            'email'      => $input['email'],
            'password'   => password_hash($input['password'], PASSWORD_BCRYPT),
            'phone'      => $input['phone'] ?? null,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        if ($userId) {
            // 2. Insert into teachers
            $teacherModel->insert([
                'user_id'         => $userId,
                'university_name' => $input['university_name'],
                'gender'          => $input['gender'],
                'year_joined'     => $input['year_joined'],
                'bio'             => $input['bio'] ?? null,
                'created_at'      => date('Y-m-d H:i:s'),
            ]);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            $dbError = $db->getError();
            return $this->response->setStatusCode(500)->setJSON([
                'status'  => false,
                'message' => 'Registration failed',
                'db_error' => $dbError['message'] ?? 'Unknown DB error',
            ]);
        }

        $user = $authModel->find($userId);
        unset($user['password']);

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => true,
            'message' => 'User and Teacher registered successfully',
            'data'    => $user,
        ]);
    }

    public function login()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($input['email']) || empty($input['password'])) {
            return $this->response->setStatusCode(422)->setJSON([
                'status'  => false,
                'message' => 'Email and password are required',
            ]);
        }

        $model = new AuthUserModel();
        $user  = $model->findByEmail($input['email']);

        if (!$user || !password_verify($input['password'], $user['password'])) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Invalid email or password',
            ]);
        }

        $secret  = $_ENV['JWT_SECRET'] ?? 'default_secret';
        $expire  = (int)($_ENV['JWT_EXPIRE'] ?? 86400);
        $payload = [
            'iss'   => 'teacher-app',
            'iat'   => time(),
            'exp'   => time() + $expire,
            'uid'   => $user['id'],
            'email' => $user['email'],
            'name'  => $user['first_name'] . ' ' . $user['last_name'],
        ];

        $token = JWT::encode($payload, $secret, 'HS256');

        unset($user['password']);

        return $this->response->setStatusCode(200)->setJSON([
            'status'  => true,
            'message' => 'Login successful',
            'token'   => $token,
            'data'    => $user,
        ]);
    }
}
