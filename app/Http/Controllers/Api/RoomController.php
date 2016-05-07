<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Room;
use App\Booking;

/**
 * This class is responsible for room resources CRUD
 */
class RoomController extends \App\Http\Controllers\Controller
{

	/**
	 * apply middleware to protected actions
	 */
	public function __construct(){
		 $this->middleware('auth', ['only' => [
            'update',
            'destroy',
        ]]);
	}

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

	/**
	 * returns room names with availability for chosen date
	 * query can be improved, but this mantain database compatibility
	 * @param  string $date date in YYYY-MM-DD format
	 * @return Object       [room name, availability]
	 */
    public function checkAvailability( $date ){
    	$rooms = Room::with([
    		'bookings' => function( $query ) use( $date ){  
    			$query->where('date', $date );
    		}])->get( ['name', 'beds', 'bookings.beds'] );

    	//loop through collection and calculate free beds
    	$rooms->map( function( $item, $key ){
    		$item['beds'] = $item['beds'] - $item->bookings->sum('beds');
    		unset( $item['bookings'] );
    	});

    	return $rooms->all();
    }
}

