<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AuthUserModel;
use App\Models\TeacherModel;

class TeacherController extends BaseController
{
    public function index()
    {
        $model    = new TeacherModel();
        $teachers = $model->getAllWithUserData();

        return $this->response->setStatusCode(200)->setJSON([
            'status' => true,
            'data'   => $teachers,
        ]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'first_name'      => 'required',
            'last_name'       => 'required',
            'email'           => 'required|valid_email|is_unique[auth_user.email]',
            'password'        => 'required|min_length[6]',
            'university_name' => 'required',
            'gender'          => 'required|in_list[male,female,other]',
            'year_joined'     => 'required|integer|greater_than[1900]',
        ];

        if (!$this->validateData($input, $rules)) {
            return $this->response->setStatusCode(422)->setJSON([
                'status'  => false,
                'message' => 'Validation failed',
                'errors'  => $this->validator->getErrors(),
            ]);
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            $userModel = new AuthUserModel();
            $userId = $userModel->insert([
                'first_name' => $input['first_name'],
                'last_name'  => $input['last_name'],
                'email'      => $input['email'],
                'password'   => password_hash($input['password'], PASSWORD_BCRYPT),
                'phone'      => $input['phone'] ?? null,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            $teacherModel = new TeacherModel();
            $teacherId = $teacherModel->insert([
                'user_id'         => $userId,
                'university_name' => $input['university_name'],
                'gender'          => $input['gender'],
                'year_joined'     => $input['year_joined'],
                'bio'             => $input['bio'] ?? null,
                'created_at'      => date('Y-m-d H:i:s'),
            ]);

            $db->transComplete();

            if ($db->transStatus() === false) {
                throw new \Exception('Transaction failed');
            }

            $user = $userModel->find($userId);
            unset($user['password']);
            $teacher = $teacherModel->find($teacherId);

            return $this->response->setStatusCode(201)->setJSON([
                'status'  => true,
                'message' => 'Teacher created successfully',
                'data'    => [
                    'user'    => $user,
                    'teacher' => $teacher,
                ],
            ]);
        } catch (\Exception $e) {
            $db->transRollback();
            return $this->response->setStatusCode(500)->setJSON([
                'status'  => false,
                'message' => 'Failed to create teacher: ' . $e->getMessage(),
            ]);
        }
    }
}
