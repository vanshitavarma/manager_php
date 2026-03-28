<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->get('api/health', 'Api\HealthController::index');
$routes->post('api/register', 'Api\AuthController::register');
$routes->post('api/login', 'Api\AuthController::login');
$routes->options('(:any)', 'Home::index');

$routes->group('api', ['filter' => 'jwt'], function ($routes) {
    $routes->get('users', 'Api\UserController::index');
    $routes->get('teachers', 'Api\TeacherController::index');
    $routes->post('teachers/create', 'Api\TeacherController::create');
});
