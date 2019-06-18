<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class Udids extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->load->model('udid_model');
        $this->model = $this->udid_model;
    }
    public function index_get()
    {

        if (!$this->protect()) return;


        $rows = $this->model->getRows();
        $this->set_response($rows, 200);
    }

    public function validkey_get()
    {
        $rows = $this->model->getUdidCount();
        $data = array();
        foreach($rows as $row){
            $data[$row['type']] = $row['cnt']>5?5:$row['cnt'];
        }
        //print_
        $this->set_response($data, 200);
    }

    public function index_post()
    {
        if (!$this->protect()) return;


        $data = json_decode(file_get_contents('php://input'), true);

        if(!$data['id']){
            $udidStr = $data['udid'];
            $udIds = explode("\n", $udidStr);
            foreach($udIds as $uString){
                $ids = explode(",", $uString);
                foreach($ids as $id){
                    if($id){
                        $row = $data;
                        $row['udid'] = $id;
                        $result = $this->model->saveRow($row);
                    }
                }
            }
        }else{
            $result = $this->model->saveRow($data);
        }
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
