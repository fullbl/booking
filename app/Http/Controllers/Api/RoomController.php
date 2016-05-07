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
		    	return response( $room, 201 );
		    else
				return response( ['error' => 'Something bad happened'], 500 );
	    }
	    else{
	    	if( $room->exists() )
		    	return back()->with( 'message', 'Room created!' );
		    else
	    		return back()->withInput();
	    }
    }

    /**
	 * update a room	 
	 * @return Room object just updated
	 */
    public function update( Request $request, $id ){
    	$this->validate($request, [
		    'name' => 'required|max:255',
		    'beds' => 'required|integer',
		    'price' => 'required',
		]);

		$room = Room::find( $id );
		if( !$room->exists() ){
			return response( ['error' => 'Room not found'], 404 );
		}

		if( $room->update( $request->all() ) )
			return $room;
		else
			return response( ['error' => 'Something bad happened'], 500 );

    }

    /**
	 * delete a room	 
	 */
    public function destroy( Request $request, $id ){
		if( Room::destroy( $id ) )
			return response( '', 204 ); //204 means ok, but you don't get any content back
		else
			return response( ['error' => 'Something bad happened'], 500 );

    }

    //TODO: divide login protected methods, here or in routes.php
}
