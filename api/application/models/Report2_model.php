<?php


class Report2_model extends CI_Model
{

    private $table = 'sales_report2';

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

        $cols = array('reg_date', 'paltform','unit','amount','refund_unit', 'refund_amount');
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
                    sum(refund_unit) as total_refund_unit, sum(refund_amount) as total_refund_amount, 
                    sum(if(paltform='steam',unit,0)) as steam_unit, sum(if(paltform='steam',amount,0)) as steam_amount, 
                    sum(if(paltform='steam',refund_unit,0)) as steam_refund_unit, sum(if(paltform='steam',refund_amount,0)) as steam_refund_amount,
                    sum(if(paltform='facebook',unit,0)) as facebook_unit, sum(if(paltform='facebook',amount,0)) as facebook_amount, 
                    sum(if(paltform='facebook',refund_unit,0)) as facebook_refund_unit, sum(if(paltform='facebook',refund_amount,0)) as facebook_refund_amount, 
                    sum(if(paltform='sony',unit,0)) as sony_unit, sum(if(paltform='sony',amount,0)) as sony_amount, 
                    sum(if(paltform='sony',refund_unit,0)) as sony_refund_unit, sum(if(paltform='sony',refund_amount,0)) as sony_refund_amount, 
                    sum(if(paltform='other ',unit,0)) as other_unit, sum(if(paltform='other',amount,0)) as other_amount, 
                    sum(if(paltform='other ',refund_unit,0)) as other_refund_unit, sum(if(paltform='other',refund_amount,0)) as other_refund_amount, 
                    Year(reg_date) as reg_year, Month(reg_date) as reg_month 
                FROM 
                 (
                    select * from `sales_report2`
                    UNION
                    SELECT 
                        1 as id, Date(`purchased`) as reg_date, 
                        'other' as paltform,
                        sum(if(deleted != 1,keycnt,0)) as unit, 
                        sum(if(deleted != 1,price,0)) as amount,    
                        sum(if(deleted = 1,keycnt,0)) as refund_unit,   
                        sum(if(deleted = 1,price,0)) as refund_amount
                    FROM `buyers` WHERE 1 group by reg_date
                 ) as t1
                WHERE 1 
                group by reg_year, reg_month 
                order by reg_year, reg_month desc";
        $rst = $this->db->query($sql);
        $rows = $rst->result_array();
        return $rows;
    }
}