<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;


/**
 * Booking model
 */
class Booking extends Model
{
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date', 'beds'
    ];
    
    /**
     * The attributes that are visible.
     *
     * @var array
     */
    protected $visible = [
    	'_id', 'date', 'beds'
    ];

    /**
     * Get the room that owns the booking.
     */
    public function user(){
        return $this->belongsTo( App\Room::class );
    }
}
