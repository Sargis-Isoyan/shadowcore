<?php

require dirname(__FILE__) . '/Base_Controller.php';

class Setting extends Base_Controller
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        $this->load->model('setting_model');
        $this->model = $this->setting_model;
    }

    /**
     * Get all users
     */
    public function index_get()
    {
        $s_key = $this->input->get('key');
        $data = $this->model->getSetting($s_key);
        $this->set_response($data, 200);
    }
    public function index_post()
    {
        if (!$this->protect()) return;
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->model->setSetting($data);
        $this->set_response($result, 200);
    }
}
