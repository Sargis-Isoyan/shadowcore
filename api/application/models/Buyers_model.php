<?php


class Buyers_model extends CI_Model
{

    private $table = 'buyers';

    function __construct()
    {
        /* Call the Model constructor */
        $this->load->library('encrypt');
        parent::__construct();
    }

    public function getRows()
    {
        $this->db->select("*");        
        $this->db->from($this->table);
        $this->db->where('deleted != 1');        
        $this->db->order_by("purchased", "desc");
        $query = $this->db->get();
        $results = $query->result();
        $newData = [];
        foreach ($results as $row){
            $row->udids = $this->encrypt->decode($row->udids);
            $newData[] = $row;
        }
        return $newData;
    }

    public function addRow($payerInfo){
        $this->load->model('mailbox_model', 'mailbox_model');
        $this->load->model('udid_model', 'udid_model');
        $udids = $this->udid_model->getUdid5($payerInfo['type'], $payerInfo['keycnt']);

        $uIds = array();
        $idAry = array();
        foreach($udids as $udid){
            $uIds[] = $udid['udid'];
            $idAry[] = $udid['id'];
        }
        $this->udid_model->setUdidAllocated($idAry, $payerInfo['email']);

        $payerInfo['udids'] = implode(" , ", $uIds);
        $payerInfo['udids'] = $this->encrypt->encode($payerInfo['udids']);

        $this->db->insert($this->table, $payerInfo);


        $message = "Dear ". ucfirst($payerInfo['first_name']). " Thank you for purchasing our Product. <br/>Please use below KEYs to activate our product<br/><br/>" ;
        $message .= "<strong>UDIDS</strong>:<br/>";
        $message .= implode("<br/>", $uIds);

        $emailOptions = [
                'to_emails' => [$payerInfo['email']],
                'from_email' => SITE_FROM_EMAIL,
                'message' => $message,
                'subject' => 'Thank you for purchasing our Product',
                'mail_flag' => 'purchasing',
                'mail_template' => 'template1'
        ];
        if($this->mailbox_model->sendMail($emailOptions)){
            return true;
        } else {
            return false;
        }
    }

    public function deleteRowById($rowId)
    {
        $this->db->where('id', $rowId);
        return $this->db->update($this->table, array('deleted' => 1));
    }

    public function getUdidUser(){
        $sql = "SELECT * FROM ".$this->table." WHERE tbl_flag=0 ORDER BY `purchased` Limit 1";
        $query = $this->db->query($sql);
        if($query->num_rows() > 0){
            $row = $query->result_array();
            return $row;
        } else {
            return false;
        }

    }

    public function setUdidFlag($user_id){
        $sql = "UPDATE ".$this->table." SET tbl_flag=5 WHERE id=".$user_id;
        $this->db->query($sql);
    }

    public function sendUdids($udids){
        $this->load->model('mailbox_model', 'mailbox_model');

        $user = $this->getUdidUser();
        if(!$user) return false;

        $this->setUdidFlag($user['id']);

        $message = '';
        foreach ($udids as $row){
            $message .= $row['udid'] . '<br/>';
        }

        $emailOptions = [
                'to_emails' => [$user['email']],
                'from_email' => SITE_FROM_EMAIL,
                'message' => $message,
                'subject' => 'You can use this udids in the app',
                'mail_flag' => 'buyers'
        ];

        if($this->mailbox_model->sendMail($emailOptions)){
            return true;
        } else {
            return false;
        }
    }
}