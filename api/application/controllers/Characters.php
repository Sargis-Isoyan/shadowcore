<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class Characters extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->protect();
        $this->load->model('character_model');
        $this->model = $this->character_model;
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

        if (isset($data['image'])) {
            if (strpos($data['image'], 'base64')) {
                list(, $img) = explode(',', $data['image']);
                $path = 'uploads/images/' . time() . rand(0,9) . '.jpg';
                if(file_put_contents($path, base64_decode($img))){
                    $data['imageurl'] = $this->config->item('base_url') . '/' . $path;
                };
            }
            unset($data['image']);
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
}
