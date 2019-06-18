<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class Buyers extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->load->model('buyers_model', 'buyers_model');
        $this->model = $this->buyers_model;
    }
    public function index_get()
    {
        if (!$this->protect()) return;
        $rows = $this->model->getRows();
        $this->set_response($rows, 200);
    }

    public function index_delete()
    {
        if (!$this->protect()) return;
        $id = $this->input->get('id');
        $result = $this->model->deleteRowById($id);
        $this->set_response($result, 200);
    }
}
