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
    
}
