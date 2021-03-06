<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class Contactus extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->load->model('contactus_model');
        $this->model = $this->contactus_model;
    }
    public function index_get()
    {

        if (!$this->protect()) return;

        $rows = $this->model->getRows();
        $this->set_response($rows, 200);
    }

    public function index_post()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->model->addRow($data);
        $this->set_response($result, 200);
    }

    public function index_delete()
    {
        if (!$this->protect()) return;

        $id = $this->input->get('id');

        $result = $this->model->deleteRowById($id);
        $this->set_response($result, 200);
    }
}
