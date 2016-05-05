<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Room;

/**
 * This class is responsible for room resources CRUD
 */
class RoomController extends \App\Http\Controllers\Controller
{
	/** 
	 * show a listing
	 * @return array Room
	 */
    public function index(){
    	return Room::all();
    }


	/**
	 * save a new room
	 * @return Room object just created
	 */
    public function store( Request $request ){
    	$this->validate($request, [
		    'title' => 'required|unique:posts|max:255',
		    'author.name' => 'required',
		    'author.description' => 'required',
		]);

    	return Room::all();
    }
}
