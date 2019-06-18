<?php


class Udid_model extends CI_Model
{

    private $table = 'udids';

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
        $this->db->order_by("created", "desc");
        $query = $this->db->get();
        $results = $query->result();
        $newData = [];
        foreach ($results as $row){
            $row->udid = $this->encrypt->decode($row->udid);
            $newData[] = $row;
        }
        return $newData;
    }

    public function getUdid5($type=null, $cnt=5)
    {
        $sql = "SELECT * FROM ".$this->table." WHERE (`allocated_user` IS NULL OR allocated_user='') ";
        if($type){
            $sql .= " AND type='" . $type . "' ";
        }
        $sql .= " ORDER BY `created` Limit ".$cnt;
        $query = $this->db->query($sql);
        $newData = [];
        foreach ($query->result_array() as $row)
        {
            $row['udid'] = $this->encrypt->decode($row['udid']);
            $newData[] = $row;
        }
        return $newData;
    }

    public function setUdidAllocated($idAry, $email){
        if(count($idAry) == 0){
            return true;
        }
        $idStr = implode(',', $idAry);
        $datestr = date('Y-m-d H:i:s');
        $sql = "UPDATE ".$this->table." SET allocated_user='".$email."', allocated_date='".$datestr."' WHERE `id` IN(".$idStr.")";
        $this->db->query($sql);
        return true;
    }


    public function getUdidCount(){
        $sql = "SELECT count(id) as cnt, type FROM `udids` WHERE `allocated_user` IS NULL OR allocated_user='' group by type";
        $rst = $this->db->query($sql);
        $row = $rst->result_array();
        return $row;
    }

    public function checkDuplicate($udid, $type){
        $sql = "SELECT udid FROM `udids` WHERE type='{$type}'";        
        $rst = $this->db->query($sql);
        $rows = $rst->result_array();
        foreach($rows as $row){
            if($udid == $this->encrypt->decode($row['udid'])){
                return false;
            }
        }
        return true;
    }

    public function saveRow($data)
    {

        $rowId = $data['id'];

        $cols = array('udid','type');
        $row = array();
        foreach ($cols as $col) {
            $row[$col] = isset($data[$col]) ? $data[$col] : '';
            if($col == 'udid'){
                $originUdid = $row[$col];
                $row[$col] = $this->encrypt->encode($row[$col]);
            }
        }

        if ($rowId != '0') {
            $this->db->where('id', $rowId);
            $result = $this->db->update($this->table, $row);
        } else {
            $row['created'] = date('Y-m-d h:i:s');

            if($this->checkDuplicate($originUdid, $row['type'])){
                $this->db->insert($this->table, $row);
                $result = ['id'=>$this->db->insert_id(), 'created'=>$row['created']];    
            }else{
                $result = ['id'=>'n', 'created'=>$row['created']];    
            }

            

            /*
            $udids = $this->getUdid5();
            if(count($udids) == 5){
                $this->load->model('buyers_model', 'buyers_model');
                $this->buyers_model->sendUdids($udids);
            }
            */

            
        }

        return $result;
    }




    public function deleteRowById($rowId)
    {
        return $this->db->delete($this->table, array('id' => $rowId));
    }
}