<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class Jointeamimage extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->protect();
        $this->load->model('jointeamimage_model');
        $this->model = $this->jointeamimage_model;
    }
    public function index_get()
    {
        $sdate = $this->input->get('sdate');
        $edate = $this->input->get('edate');
        $rows = $this->model->getRows($sdate, $edate);
        foreach($rows as &$row){
            if($row->imageurl && preg_match('/^https:\/\/www\.youtube\.com/', $row->imageurl)){
                $row->videoUrl = $row->imageurl;
                $url = $row->imageurl;
                parse_str( parse_url( $url, PHP_URL_QUERY ), $my_array_of_vars );
                $youtubeVideoId = $my_array_of_vars['v'];
                $row->imageurl = 'http://img.youtube.com/vi/'.$youtubeVideoId.'/mqdefault.jpg';
                $row->isVideo = true;
            }
        }
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
