<?php

class User_model extends Base_model
{

    private $table = 'users';
    
    public function getRows()
    {
        $this->db->select("*");
        $this->db->from($this->table);
        $query = $this->db->get();
        return $query->result();
    }

    public function getUserByUsernameOrEmail($userName){
        $sql = "SELECT * FROM users WHERE `name`='$userName' or email='{$userName}'";        
        $rst = $this->db->query($sql);
        $rows = $rst->result_array();
        return  $rows;
    }

    public function saveRow($data)
    {

        $rowId = $data['id'];

        $cols = array('name', 'email','first_name','last_name','password');
        $row = array();
        foreach ($cols as $col) {
            $row[$col] = isset($data[$col]) ? $data[$col] : '';
        }

        if ($rowId && $rowId != '0') {            
            $this->db->where('id', $rowId);
            if($row['password'] == '#password#'){
                unset($row['password']);
            }else{
                $row['password'] =  md5($row['password']);    
            }
            $result = $this->db->update($this->table, $row);
        } else {
            $row['password'] =  md5($row['password']);
            $this->db->insert($this->table, $row);
            $result = ['id'=>$this->db->insert_id()];
        }
        return $result;
    }

    public function deleteRowById($rowId)
    {
        return $this->db->delete($this->table, array('id' => $rowId));
    }

    // get password
    public function setPassword($id, $oldPwd, $newPwd)
    {
        $sql = "SELECT * FROM users WHERE `id`='{$id}' AND password=MD5('".$oldPwd."')";
        $rst = $this->db->query($sql);
        $row = $rst->result_array();
        if(count($row) > 0){
            $sql = "UPDATE users SET password=MD5('".$newPwd."') WHERE `id`='{$id}' AND password=MD5('".$oldPwd."')";
            $this->db->query($sql);
            return true;
        } else {
            return false;
        }
    }
    public function login($id, $password){
        $sql = "SELECT * FROM users WHERE `id`='{$id}' AND password=MD5('". $this->escapeString($password) ."')";
        $rst = $this->db->query($sql);
        $row = $rst->result_array();
        if(count($row) > 0){
            return $row[0];
        } else {
            return false;
        }
    }

    public function setAcessToken($userID, $expireDays = 0)
    {
        $token = md5($userID . '-' . time() . '-' . rand());
        $expires = time() + 3600 * 2; //expire after 2 hours in default
        if ($expireDays > 0) {
            $expires = time() + 3600 * 24 * $expireDays;
        }

        $this->deleteExpiredTokens();

        $this->db->insert('ci_access_tokens', [
                'token' => $token,
                'user_id' => $userID,
                'expires' => date('Y-m-d H:i:s', $expires),
                'createdOn' => date('Y-m-d H:i:s')
        ]);
        return $token;
    }

    public function deleteExpiredTokens()
    {
        $this->db->where('expires <=', date('Y-m-d H:i:s'));
        $this->db->delete('ci_access_tokens');
    }

    public function isValidToken($token)
    {
        $this->db->select('user_id');
        $this->db->from('ci_access_tokens');
        $this->db->where('token', $token);

        $query = $this->db->get();

        if ($query->num_rows() == 0) {
            return null;
        }

        return $query->row()->user_id;
    }

    public function getUserByToken($token)
    {
        $userID = $this->isValidToken($token);

        $this->db->select('*');
        $this->db->from($this->table);
        $this->db->where('id', $userID);

        $query = $this->db->get();

        return $query->row();
    }

    public function logoutByToken($token)
    {
        $this->db->where('token', $token);
        $this->db->delete('ci_access_tokens');
    }
}
