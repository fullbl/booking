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
		    'beds' => 'required|integer',
		    'date' => 'required|date',
		    'room_id' => 'required|exists:rooms,_id'
		]);

		$room = Room::find( $request->input( 'room_id' ) );

		
		$freeBeds = $room->beds - $room->bookings()->where( 'date', $request->get( 'date' ) )->sum( 'beds' );
		if( $freeBeds < $request->get( 'beds' ) )
			return response( ['error' => 'all beds are taken, try another day'], 400 );

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
		    'beds' => 'required|integer',
		    'date' => 'required|date'
		] );

		$booking = Booking::find( $id );
		if( !$booking->exists() ){
			return response( ['error' => 'Booking not found'], 404 );
		}

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
