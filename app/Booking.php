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
    	'_id', 'date', 'beds', 'room'
    ];

    /**
     * Get the bookings owned by room.
     */
    public function room(){
        return $this->belongsTo( Room::class )->select( ['name', 'beds' ] );
    }

    /**
     * Force attribute to integer, we need it to perform operations
     *
     * @param  string  $value
     * @return string
     */
    public function setBedsAttribute($value)
    {
        $this->attributes['beds'] = (int)($value);
    }
}
