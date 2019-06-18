<?php


class Report1_model extends CI_Model
{

    private $table = 'sales_report1';

    function __construct()
    {
        /* Call the Model constructor */
        parent::__construct();
    }

    public function getRows()
    {
        $this->db->select("*");
        $this->db->from($this->table);        
        $this->db->order_by("reg_date", "desc");
        $query = $this->db->get();
        return $query->result();
    }

    public function saveRow($data)
    {

        $rowId = $data['id'];

        $cols = array('reg_date', 'paltform','unit','amount');
        $row = array();
        foreach ($cols as $col) {
            $row[$col] = isset($data[$col]) ? $data[$col] : '';
        }

        if ($rowId && $rowId != '0') {
            $this->db->where('id', $rowId);
            $result = $this->db->update($this->table, $row);
        } else {            
            $this->db->insert($this->table, $row);
            $result = ['id'=>$this->db->insert_id()];
        }
        return $result;
    }


    public function deleteRowById($rowId)
    {
        return $this->db->delete($this->table, array('id' => $rowId));
    }

    public function getRowByDateAndPlatform($date, $paltform){
        $this->db->select("*");
        $this->db->from($this->table);        
        $this->db->where("reg_date", $date);
        $this->db->where("paltform", $paltform);
        $query = $this->db->get();
        return $query->result();
    }


    public function getReports(){
        $sql = "SELECT 
                    sum(unit) as total_unit, sum(amount) as total_amount, 
                    sum(if(paltform='steam',unit,0)) as steam_unit, sum(if(paltform='steam',amount,0)) as steam_amount, 
                    sum(if(paltform='facebook',unit,0)) as facebook_unit, sum(if(paltform='facebook',amount,0)) as facebook_amount, 
                    sum(if(paltform='sony',unit,0)) as sony_unit, sum(if(paltform='sony',amount,0)) as sony_amount, 
                    sum(if(paltform='other ',unit,0)) as other_unit, sum(if(paltform='other',amount,0)) as other_amount, 
                    Year(reg_date) as reg_year, Month(reg_date) as reg_month 
                FROM 
                 (
                    select * from `sales_report1`
                    UNION
                    SELECT 1 as id, Date(`purchased`) as reg_date, 'other' as paltform, sum(`keycnt`) as unit, sum(`price`) as amount FROM `buyers` WHERE `deleted`!=1 group by reg_date
                 ) as t1
                WHERE 1 
                group by reg_year, reg_month 
                order by reg_year, reg_month desc";
        $rst = $this->db->query($sql);
        $rows = $rst->result_array();
        return $rows;
    }
}