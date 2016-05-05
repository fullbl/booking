var Booking = function(){

	

};

/* ------------------ GENERAL FUNCTIONS ------------------------- */
/**
 * classList.add simple polyfill
 * @param {DOMElement} element   the element
 * @param {string} className the class name
 */
Booking.prototype.addClassName = function( element, className ){
	if( typeof element.classList !== 'undefined' ){
		element.classList.add( className );
	}
	else{
		//check if element doesn't have already className
		if( ( ' ' + element.className + ' ').indexOf(' ' + className + ' ') === -1 ){
			element.className += ' ' + className;
		}

	}
}

/**
 * classList.remove simple polyfill
 * @param {DOMElement} element   the element
 * @param {string} className the class name
 */
Booking.prototype.removeClassName = function( element, className ){
	/*if( typeof element.classList !== 'undefined' ){
		element.classList.remove( className );
	}
	else{*/
		element.className = (' ' + element.className + ' ').replace( className, '' ).trim();
	//}
}

/**
 * send ajax request
 * @param  {String}   url      url
 * @param  {String}   method   'GET', 'POST', 'CREATE', 'PUT'
 * @param  {FormData|String}   FormData or already encoded  
 * @param  {Function} callback function to execute in case of success
 * @param  {Function} callback function to execute in case of error
 */
Booking.prototype.xhr = function( url, method, data, callback, error ){
	var allowedMethods = [ 'GET', 'POST', 'CREATE', 'PUT' ],
		req = new XMLHttpRequest();
	method = method.toUpperCase();
	if( allowedMethods.indexOf( method ) === -1 ){
		alert( 'unsupported method' );
		return false;
	}
	req.onreadystatechange = function() {
		var status = parseInt( req.status / 100 );
	    if( req.readyState == XMLHttpRequest.DONE ){

	    	if( status == 2 ){
	    		if( typeof callback === 'function' )
	        		callback( JSON.parse( req.response ) );
	    	}
	        else if( typeof error === 'function' ){
	        	try{
	        		error( JSON.parse( req.response ) );
	        	}
	        	catch( e ){
	        		alert( 'something bad happened' );
	        	}
	        }

	    }
	};
	req.open( method, url, true );
	req.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
	req.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded; charset=UTF-8' );

	req.send( data );
};

/* ---------------------- APP FUNCTIONS ------------------------- */

/**
 * create row from json Object
 * @param {DOMElement} table table object
 * @param {json} room object
 */
Booking.createRowInTable( table, object ){
	var tr = document.createElement('TR'),
		_td = document.createElement('TD'),
		td;

	for( var i in room )
		if( object.hasOwnProperty( i ) ){
			td = _td.cloneNode();
			td.innerHTML = object[i];
			tr.appendChild( td );
		}
	table.appendChild( tr );
}


var b = new Booking();