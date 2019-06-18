<?php

require dirname(__FILE__) . '/Base_Controller.php';

class Users extends Base_Controller
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        $this->load->model('user_model');
        $this->model = $this->user_model;
    }

    /**
     * Get all users
     */
    public function index_get()
    {
        if (!$this->protect()) return;
        $rows = $this->model->getRows();
        $this->set_response($rows, 200);        
    }


    public function index_post()
    {
        if (!$this->protect()) return;
        $data = json_decode(file_get_contents('php://input'), true);

        if(!$data['id'] || $data['id'] == '0'){
            $resultRow = $this->model->getUserByUsernameOrEmail($data['name']);
            if(count($resultRow)){
                $this->set_response('UserName Already Exsited', 401);
                return true;
            }        

            $resultRow = $this->model->getUserByUsernameOrEmail($data['email']);
            if(count($resultRow)){
                $this->set_response('Email Already Exsited', 401);
                return true;
            }
        }        

        $result = $this->model->saveRow($data);
        $this->set_response($result, 200);
    }

    public function index_delete()
    {
        if (!$this->protect()) return;
        $id = $this->input->get('id');
        $result = $this->model->deleteRowById($id);
        $this->set_response($result, 200);
    }


    public function login_post()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $userName = $data['name'];
        $password = $data['password'];
        $resultRow = $this->model->getUserByUsernameOrEmail($data['name']);
        if(count($resultRow)){
            $row = $resultRow[0];
            $result = $this->model->login($row['id'], $password);
            if($result == false){
                $this->set_response('The current password is incorrect.', 401);
            }else{
                $token = $this->model->setAcessToken($result['id']);
                $row['token'] = $token;                
                $this->set_response($row, 200);
            }   
        }else{
            $this->set_response('Usernae is incorrect.', 401);
        }        
    }
    public function setpassword_post()
    {

        if (!$this->protect("user")) return;

        $data = json_decode(file_get_contents('php://input'), true);

        $user = $this->model->getUserByToken($this->getAuthToken());
        $result = $this->model->setPassword($user->id, $data['oldPwd'], $data['newPwd']);
        if($result)
            $this->set_response($result, 200);
        else
            $this->set_response('The current password is incorrect.', 401);
    }
}
