<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Booking;

/**
 * This class is responsible for updating booking resources
 */
class BookingController extends \App\Http\Controllers\Controller
{

	/** 
	 * show a listing
	 * @return array Room
	 */
    public function index(){
    	return Booking::all();
    }
    //TODO: copy from RoomController
    //TODO: add filtering options for index
}
