<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', [
    'as' => 'index', 
    'uses' => 'IndexController@showBooking'
]);

Route::group( ['prefix' => 'api'], function (){

	Route::resource('room', 'Api\RoomController');

	Route::resource('booking', 'Api\BookingController');

	Route::get( 'availability/{date}', [
    	'as' => 'availability', 
    	'uses' => 'Api\RoomController@checkAvailability'
	]);

});

Route::auth();

Route::get('/admin', 'AdminController@index');
