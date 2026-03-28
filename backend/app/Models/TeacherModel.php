<?php

namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table            = 'teachers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields = [
        'user_id',
        'university_name',
        'gender',
        'year_joined',
        'bio',
        'created_at',
    ];

    protected $useTimestamps = false;

    public function getAllWithUserData(): array
    {
        return $this->db->table('teachers t')
            ->select('t.id, t.user_id, t.university_name, t.gender, t.year_joined, t.bio, t.created_at,
                      u.first_name, u.last_name, u.email, u.phone')
            ->join('auth_user u', 'u.id = t.user_id')
            ->get()
            ->getResultArray();
    }
}
