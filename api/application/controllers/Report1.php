<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class Report1 extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->protect();
        $this->load->model('report1_model');
        $this->model = $this->report1_model;
    }
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
            $rows = $this->model->getRowByDateAndPlatform($data['reg_date'], $data['paltform']);
            if(count($rows) > 0){
                $this->set_response('Already Exsited', 401);
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

    public function report_get()
    {
        if (!$this->protect("user")) return;
        $rows = $this->model->getReports();
        $this->set_response($rows, 200);
    }
}
