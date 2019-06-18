<?php

class Setting_model extends Base_model
{

    private $table = 'settings';
    // get password
    public function setSetting($data)
    {
        foreach($data as $key => $value){

            $row = array('s_key'=>$key, 's_value' => $value);

            $this->db->select("*");
            $this->db->from($this->table);
            $this->db->where("s_key", $key);
            $query = $this->db->get();
            if($query->num_rows() > 0){
                $this->db->where('s_key', $key);
                $this->db->update($this->table, $row);
            } else {
                $this->db->insert($this->table, $row);
            }
        }
        return true;
    }
    public function getSetting($key = null){
        $this->db->select("*");
        $this->db->from($this->table);
        $result = $this->db->get()->result_array();
        $data = array();
        foreach($result as $row){
            if($key && $row['s_key'] == $key){
                return $row['s_value'];
            }
            $data[$row['s_key']] = $row['s_value'];
        }
        if($key){
            return "";
        }else{
            return $data;
        }
    }
}
