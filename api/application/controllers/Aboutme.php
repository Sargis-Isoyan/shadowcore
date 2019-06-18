<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class Aboutme extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->protect();
        $this->load->model('aboutme_model');
        $this->model = $this->aboutme_model;
    }
    public function index_get()
    {
        $rows = $this->model->getRows();
        $this->set_response($rows, 200);
    }

    public function index_post()
    {
        if (!$this->protect()) return;
        $data = json_decode(file_get_contents('php://input'), true);
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
}
