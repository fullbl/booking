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
	 * handles also a non ajax-request
	 * @return Room object just created
	 */
    public function store( Request $request ){
    	$this->validate($request, [
		    'name' => 'required|max:255',
		    'beds' => 'required|integer',
		    'price' => 'required',
		]);

		$room = Room::create( $request->all() );
		if($request->ajax()){
			if( $room->exists() )
		    	return $room;
		    else
	    		response( '{error: Something bad happened}', 500 );
	    }
	    else{
	    	if( $room->exists() )
		    	return back()->with( 'message', 'Room created!' );
		    else
	    		return back()->withInput();
	    }
    }
}
