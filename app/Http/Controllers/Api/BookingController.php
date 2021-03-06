<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Booking;
use App\Room;

/**
 * This class is responsible for updating booking resources
 */
class BookingController extends \App\Http\Controllers\Controller
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
    public function index( Request $request ){
    	$bookings = Booking::with('room');
    	
    	/* filtering by date - not needed for now
    	if( $request->has('date') )
    		$bookings->where( 'date', $request->get('date') );
		*/
		
		$bookings->orderBy( 'date', 'DESC' );

    	return $bookings->get();
    }

    /**
	 * save a new booking
	 * handles also a non ajax-request
	 * @return Room object just created
	 */
    public function store( Request $request ){
    	$this->validate($request, [
		    'beds' => 'required|integer|min:0',
		    'date' => 'required|date',
		    'room_id' => 'required|exists:rooms,_id'
		]);

		$room = Room::find( $request->input( 'room_id' ) );

		
		$freeBeds = $room->beds - $room->bookings()->where( 'date', $request->get( 'date' ) )->sum( 'beds' );
		if( $freeBeds < $request->get( 'beds' ) )
			return response( ['error' => 'not enough beds, try with another day/room'], 400 );

		$booking = $room->bookings()->create( $request->only( 'beds', 'date' ) );
		if($request->ajax()){
			if( $room->exists() )
		    	return response( $booking, 201 );
		    else
				return response( ['error' => 'Something bad happened'], 500 );
	    }
	    else{
	    	if( $room->exists() )
		    	return back()->with( 'message', 'Booking created!' );
		    else
	    		return back()->withInput();
	    }
    }
        
    /**
	 * update a booking	 
	 * @return Booking object just updated
	 */
    public function update( Request $request, $id ){
    	$this->validate( $request, [
		    'beds' => 'required|integer|min:0',
		    'date' => 'required|date'
		] );

		$booking = Booking::with('room')->find( $id );
		if( !$booking->exists() ){
			return response( ['error' => 'Booking not found'], 404 );
		}
		
		$freeBeds = 
			$booking->room->beds
			- $booking->room->bookings()->where( 'date', $request->get( 'date' ) )->sum( 'beds' )
			+ $booking->beds //don't count beds of current booking
			;

		if( $freeBeds < $request->get( 'beds' ) )
			return response( ['error' => 'not enough beds, try with another day/room'], 400 );

		if( $booking->update( $request->all() ) )
			return $booking;
		else
			return response( ['error' => 'Something bad happened'], 500 );

    }

    /**
	 * delete a room	 
	 */
    public function destroy( Request $request, $id ){
		if( Booking::destroy( $id ) )
			return response( '', 204 ); //204 means ok, but you don't get any content back
		else
			return response( ['error' => 'Something bad happened'], 500 );

    }

}
