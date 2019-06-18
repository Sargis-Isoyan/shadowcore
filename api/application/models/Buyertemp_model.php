<?php


class Buyertemp_model extends CI_Model
{

    private $table = 'buy_temp';

    function __construct()
    {
        parent::__construct();
    }

    public function getRow($id)
    {
        $this->db->select("*");
        $this->db->from($this->table);
        $this->db->where('id', $id);
        $query = $this->db->get();
        $result = $query->result();
        if(count($result)){
            return $result[0];
        }else{
            return false;
        }
    }

    public function addRow($payerInfo){
        $this->db->insert($this->table, $payerInfo);
        return $this->db->insert_id();
    }

    public function deleteRowById($rowId)
    {
        return $this->db->delete($this->table, array('id' => $rowId));
    }
}