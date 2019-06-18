<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';

// use namespace
use Restserver\Libraries\REST_Controller;

/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Base_Controller extends REST_Controller
{

    protected $_currentUser = null;

    public function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->load->model('User_model');
    }

    protected function getAuthToken()
    {
        $token = $this->head('x-auth-token');
        if(!$token){
            $token = $this->head('X-Auth-Token');
        }
        return $token;
    }

    protected function getCurrentUser()
    {
        if (empty($this->_currentUser)) {
            $this->_currentUser = $this->User_model->getUserByToken($this->getAuthToken());
        }
        return $this->_currentUser;
    }

    protected function protect($role='superadmin')
    {
        $this->User_model->deleteExpiredTokens();
        if (empty($this->User_model->isValidToken($this->getAuthToken()))) {
            $this->set_response("You need to login first", 403);
            return false;
        }
        if($role=='superadmin'){
            $user = $this->User_model->getUserByToken($this->getAuthToken());
            if($user->is_supperadmin != '1'){
                $this->set_response("You don't have permission", 403);
                return false;
            }
        }
        return true;
    }

}
