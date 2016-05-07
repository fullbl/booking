<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;


/**
 * Room model
 */
class Room extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'beds', 'price',
    ];
    
    /**
     * The attributes that are visible.
     *
     * @var array
     */
    protected $visible = [
    	'_id', 'name', 'beds', 'price', 'bookings'
    ];

    /**
     * Get the bookings owned by room.
     */
    public function bookings(){
        return $this->hasMany( Booking::class );
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

    /**
     * delete bookings when room is deleted!
     */
    protected static function boot() {
        parent::boot();

        static::deleting( function( $room ){ // before delete() method call this
            $room->bookings()->delete();
        });
    }
}
