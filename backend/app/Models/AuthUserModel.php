<?php

namespace App\Models;

use CodeIgniter\Model;

class AuthUserModel extends Model
{
    protected $table            = 'auth_user';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'email',
        'first_name',
        'last_name',
        'password',
        'phone',
        'created_at',
    ];

    protected $useTimestamps = false;

    public function findByEmail(string $email): ?array
    {
        return $this->where('email', $email)->first();
    }
}
