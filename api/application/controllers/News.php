<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class News extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->protect();
        $this->load->model('news_model');
        $this->model = $this->news_model;
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
            $row->content1 = nl2br($row->content);
            $row->content2 = nl2br(substr(($row->content), 0, 250)."....");
        }
        $this->set_response($rows, 200);
    }

    public function index_post()
    {
        if (!$this->protect()) return;
        $this->load->model('subscribers_model');
        $this->load->model('mailbox_model');

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

        //if(!$data['id']){
            $subscribers = $this->subscribers_model->getRows();
            $to_emails = [];
            foreach ($subscribers as $subscriber){
                $to_emails[] = $subscriber->email;
            }

            $params = array();

            $params['newstitle'] = strlen($data['title'])>40?(substr($data['title'],0,40).'...'):$data['title'] ;
            $params['newscontent'] = strlen($data['title'])>80?(substr($data['content'],0,80).'...'):$data['content'] ;
            if(!$data['imageurl']){
                $params['imageurl'] = "https://serebrumlab.com/images/img_placeholder.jpg";
            }else if(preg_match('/^https:\/\/www\.youtube\.com/', $data['imageurl'])){
                parse_str( parse_url( $data['imageurl'], PHP_URL_QUERY ), $my_array_of_vars );
                $youtubeVideoId = $my_array_of_vars['v'];
                $params['imageurl'] = 'http://img.youtube.com/vi/'.$youtubeVideoId.'/mqdefault.jpg';
            }else{
                $params['imageurl'] = $data['imageurl'];
            }

            $emailOptions = [
                'to_emails' => $to_emails,
                'from_email' => SITE_FROM_EMAIL,
                'message' => nl2br($data['content']),
                'subject' => "ShadowCore Broadcast News: ". (strlen($data['title'])>80?(substr($data['title'],0,80).'...'):$data['title']),
                'mail_flag' => 'news',
                'params' => $params,
                'mail_template' => 'template2'
            ];
            $this->mailbox_model->sendMail($emailOptions);
        //}


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
