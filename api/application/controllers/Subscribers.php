<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require dirname(__FILE__) . '/Base_Controller.php';

class Subscribers extends Base_Controller
{

    private $model = null;
    function __construct()
    {
        parent::__construct();
        $this->load->model('subscribers_model');
        $this->model = $this->subscribers_model;
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

        $result = $this->model->saveRow($data);

        if($result){
            $this->load->model('mailbox_model');
            $emailOptions = [
                    'to_emails' => [$data['email']],
                    'from_email' => SITE_FROM_EMAIL,
                    'message' => 'Thank you for subscribing! We’re looking forward to sending you updates on news, events and advice that will keep you up to date with the latest happenings in the SHADOWCORE.',
                    'subject' => 'Thank You, Your Subscription Has Been Successfully Added',
                    'mail_flag' => 'subscribers',
                    'mail_template' => 'template1'
            ];
            $this->mailbox_model->sendMail($emailOptions);
        }


        $this->set_response($result, 200);
    }

    public function index_delete()
    {
        $id = $this->input->get('id');
        $email = $this->input->get('email');
        if($id){
            $result = $this->model->deleteRowById($id);
        }else if($email){
            $result = $this->model->deleteRowByEmail($email);
        }
        $this->set_response($result, 200);
    }
}
