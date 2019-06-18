<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');


require_once(dirname(__DIR__) . '/libraries/vendor/autoload.php');

use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use PayPal\Api\ResultPrinter;


use PayPal\Api\ExecutePayment;
use PayPal\Api\PaymentExecution;


class Paypal extends CI_Controller
{

    private  $_mode = "live"; //or live

    public function __construct()
    {
        parent::__construct();
    }

    public function order()
    {

        $row = array(
            'first_name' => $this->input->get('first_name'),
            'last_name' => $this->input->get('last_name'),
            'email' => $this->input->get('email'),
            'keycnt' => $this->input->get('keycnt'),
            'type' => $this->input->get('type'),
        );


        $this->load->model('buyertemp_model');
        $this->load->model('setting_model');
        

        $key = "";
        if($row['keycnt'] == 1){
            $key = "PriceFor1Keys";
        }else if($row['keycnt'] == 3){
            $key = "PriceFor3Keys";
        }else{
            $key = "PriceFor5Keys";
        }
        $price = $this->setting_model->getSetting($key)*1;

        $paypalConf = $this->config->item('paypal');
        $clientId = $paypalConf['clientId'];
        $clientSecret = $paypalConf['clientSecret'];
        $appName = $paypalConf['appName'];
        if(!$price){
            $price = $paypalConf['price'];
        }

        $row['price'] = $price;
        $userId = $this->buyertemp_model->addRow($row);

        $shiping = 0;
        $tax = 0;
        $mode = $this->_mode; //or live

        $apiContext = new ApiContext(
                new OAuthTokenCredential(
                        $clientId, $clientSecret
                )
        );
        $apiContext->setConfig(
                array(
                        'mode' => $mode,
                        'log.LogEnabled' => false
                )
        );

        $payer = new Payer();
        $payer->setPaymentMethod("paypal");


        $item1 = new Item();
        $item1->setName($appName)
                ->setCurrency('USD')
                ->setQuantity(1)
                ->setPrice($price);

        $itemList = new ItemList();
        $itemList->setItems(array($item1));
        $details = new Details();
        $details->setShipping($shiping)
                ->setTax($tax)
                ->setSubtotal($price);
        $amount = new Amount();
        $amount->setCurrency("USD")
                ->setTotal($price + $shiping + $tax)
                ->setDetails($details);

        $transaction = new Transaction();
        $transaction->setAmount($amount)
                ->setItemList($itemList)
                ->setDescription("Payment description")
                ->setInvoiceNumber(uniqid());

        $token = $this->createToken($userId);
        $baseUrl = $this->config->item('base_url');
        $redirectUrls = new RedirectUrls();

        $redirectUrls->setReturnUrl($baseUrl . "paypal/ordersucess?success=true&tk1=" . $token[0] . "&tk2=" . $token[1]. "&uid=" . $userId)
                ->setCancelUrl($baseUrl . "paypal/orderfailed?success=false");

        $payment = new Payment();
        $payment->setIntent("order")
                ->setPayer($payer)
                ->setRedirectUrls($redirectUrls)
                ->setTransactions(array($transaction));

        // For Sample Purposes Only.
        $request = clone $payment;

        try {
            $payment->create($apiContext);
        } catch (Exception $ex) {
            // NOTE: PLEASE DO NOT USE RESULTPRINTER CLASS IN YOUR ORIGINAL CODE. FOR SAMPLE ONLY
            //ResultPrinter::printError("Created Payment Order Using PayPal. Please visit the URL to Approve.", "Payment", null, $request, $ex);
            exit(1);
        }
        $approvalUrl = $payment->getApprovalLink();
        header("Location: " . $approvalUrl . "");
        die();
    }

    public function ordersucess()
    {


        $params = $_GET;
        $tk1 = $params['tk1'];
        $tk2 = $params['tk2'];
        $uid = $params['uid'];
        $mode = $this->_mode; //or live


        $paypalConf = $this->config->item('paypal');
        $clientId = $paypalConf['clientId'];
        $clientSecret = $paypalConf['clientSecret'];
        $appName = $paypalConf['appName'];
        $apiContext = new ApiContext(
                new OAuthTokenCredential(
                        $clientId, $clientSecret
                )
        );
        $apiContext->setConfig(
                array(
                        'mode' => $mode,
                        'log.LogEnabled' => false
                )
        );


        $paymentId = $_GET['paymentId'];
        $payment = Payment::get($paymentId, $apiContext);
        $payerId = $_GET['PayerID'];

        $execution = new PaymentExecution();
        $execution->setPayerId($payerId);
        $paypalInfo = null;
        try {
            // Execute payment
            $result = $payment->execute($execution, $apiContext);
            $paypalInfo = $result->payer->payer_info;
        } catch (PayPal\Exception\PayPalConnectionException $ex) {
            echo $ex->getCode();
            echo $ex->getData();
            die($ex);
        } catch (Exception $ex) {
            die($ex);
        }

        if ($this->checkToken($tk1, $tk2, $uid)) {

            $this->load->model('buyers_model');
            $this->load->model('buyertemp_model');
            $this->load->model('setting_model');

            $user = $this->buyertemp_model->getRow($uid);

            $payerInfo = [
                    'email'=> $user->email,
                    'first_name'=>$user->first_name,
                    'last_name'=>$user->last_name,
                    'keycnt'=>$user->keycnt,
                    'price'=>$user->price,
                    'type'=>$user->type,
                    'paypal_email'=>$paypalInfo->email,
                    'payer_id'=>$paypalInfo->payer_id,
                    'country_code'=>$paypalInfo->shipping_address->country_code,
                    'city'=>$paypalInfo->shipping_address->city,
                    'purchased'=>date('Y-m-d h:i:s')
            ];

            $this->buyertemp_model->deleteRowById($uid);

            $this->buyers_model->addRow($payerInfo);

            $url = $this->config->item('front_url')."#/order-success";

            header("Location: " . $url . "");


        } else {
            die("Token Is Invailed");
        }
    }

    public function orderfailed()
    {
        die("Payement Failed");
    }

    private function createToken($userId)
    {
        $tk1 = substr(md5(uniqid(rand(), true)), 0, 12);
        $tk2 = substr(md5("$#".$tk1."$#".$userId), 0, 12);
        return array($tk1, $tk2);
    }

    private function checkToken($tk1, $tk2, $userId)
    {
        return substr(md5("$#".$tk1."$#".$userId), 0, 12) == $tk2;
    }

}
