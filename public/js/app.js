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
	var allowedMethods = [ 'GET', 'POST', 'PUT', 'DELETE' ],
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
	    			if( req.response )
	        			callback( JSON.parse( req.response ) );
	        		else
	        			callback();
	    	}
	        else if( typeof error === 'function' ){
	        	try{
	        		if( req.response )
	        			error( JSON.parse( req.response ) );
	        		else
	        			error();
	        	}
	        	catch( e ){
	        		alert( 'something bad happened' );
	        	}
	        }

	    }
	};
	req.open( method, url, true );
	req.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
	req.setRequestHeader( 'X-CSRF-TOKEN', document.querySelector("meta[name='csrf-token']").getAttribute('content') );
	req.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded; charset=UTF-8' );

	req.send( data );
};

/**
 * execute a function for every form element
 * @param  {Array}   elements elements collection
 * @param  {Function} callback what to do
 */
Booking.prototype.loopFormElements = function( elements, callback ){
	var length = elements.length;
	for( var i = 0; i < length; i++ ){
		if( elements[i].value ){
			//it's really a form element
			callback( elements[i] );
		}
	}
}

/**
 * send form data through ajax
 * @param  {DOMElement}   form     form DOM Element
 * @param  {Function} callback what to execute after
 */
Booking.prototype.sendForm = function( elements, action, method, callback, error ){
	var formData, 
		self = this;

	if( typeof error === 'undefined' ){
		error = function( errors ){
			self.loopFormElements( elements, function( el ){
				self.removeClassName( el.parentElement, 'has-error' );
			})

			self.loopFormElements( errors, function( el ){
				self.addClassName( el.parentElement, 'has-error' );
			})
		};
	}
	
	if( 0 && typeof FormData === 'function' ){
		formData = new FormData(form);
	}
	else{
		formData = [];
		self.loopFormElements( elements, function( el ){
			formData.push( el.name + '=' + el.value );
		});
		formData = encodeURI( formData.join( '&' ) );
	}

	this.xhr( action, method, formData, callback, error );
};

/**
 * create and return button for actions
 * @param  {Array} action array with action names
 * @return {Button}        button
 */
Booking.prototype.createButton = function( action ){
	var button = document.createElement('BUTTON');
	button.type = 'button';
	button.className = 'btn btn-default';
	button.dataset.action = action;
	button.innerHTML = action;
	return button;
}

/* ---------------------- APP FUNCTIONS ------------------------- */

/**
 * create row from json Object with link for actions
 * @param {json} room object
 * @param {DOMElement|undefined} table table object. If not present return row
 */
Booking.prototype.createRowInTable = function( object, table, actions ){
	if( typeof append === 'undefined' )
		append = true;
	var tr = document.createElement('TR'),
		_td = document.createElement('TD'),
		td;

	for( var i in object )
		if( object.hasOwnProperty( i ) && i != '_id' ){
			td = _td.cloneNode();
			td.dataset.name = i;
			if( object[i].hasOwnProperty( 'name' ) ) //it could be a booking with a room object... for simplicity just get the name
				td.innerHTML = object[i].name;
			else
				td.innerHTML = object[i];

			tr.appendChild( td );
		}

	if( typeof actions !== 'undefined' ){
		td = _td.cloneNode();
		td.className = 'actions';
		for( var i in actions ){			
			//TODO: to improve speed, move createButton out of the for cycle
			td.appendChild( this.createButton( actions[i] ) );
		}
		tr.dataset.id = object._id;
		tr.appendChild( td )
	}
	if( typeof table !== 'undefined' )
		table.appendChild( tr );
	else
		return tr;
}

/**
 * load index table
 * @param  {DOMElement} tableContainer the element which will contain the table
 */
Booking.prototype.loadTable = function( tableContainer, actions ){
	var self = this;
	this.xhr( tableContainer.dataset.url, 'GET', undefined, function( objects ){
		var rows = [], 
			table = document.createElement('TABLE');
		table.className = 'table';
		table.id = tableContainer.id + '-table';
		if( objects.length ){
			for( var i in objects ){
				if( objects.hasOwnProperty( i ) ){
					table.appendChild( self.createRowInTable( objects[i], undefined, actions ) );
				}
			}
			tableContainer.innerHTML = '';
		}
		else{
			tableContainer.innerHTML = 'No data found';
		}
		//append it also if it's empty
		tableContainer.appendChild( table );

	});
}


Booking.prototype.showCalendar = function( row ){
	var form = document.createElement( 'FORM' ),
		_input = document.createElement( 'INPUT' );
	form.method = 'POST';
	form.action = '/api/booking';

	_input.className = 'form-control';

	input = _input.cloneNode();
	input.type = 'hidden';
	input.name = 'room_id';
	input.value = row.dataset.id;
	form.appendChild( input );

	input = _input.cloneNode();
	input.type = 'number';
	input.name = 'beds';
	input.placeholder = 'how many beds?';
	form.appendChild( input );

	input = _input.cloneNode();
	input.type = 'date';
	if( input.type != 'date' ) //browser don't support date
		input.placeholder = 'YYYY-MM-DD';
	input.name = 'date';
	form.appendChild( input );

	input = document.createElement( 'button' );
	input.type = 'button';
	input.className = 'btn btn-default';
	input.dataset.action = 'send';
	input.innerHTML = 'book!';
	form.appendChild( input );


	row.lastChild.dataset.oldHtml = row.lastChild.innerHTML;
	row.lastChild.innerHTML = '';
	row.lastChild.appendChild( form );
}


/* ---------------------- STARTUP FUNCTIONS ------------------------- */
var b = new Booking(); //global, it's used also in admin.js

(function(){
var userContainer = document.getElementById('user'),
	roomsContainer = document.getElementById( 'user-rooms' );

	b.loadTable( roomsContainer, [ 'book' ] );

	/* --------------------- HANDLERS -------------------- */

	/** actions buttons listener */
	roomsContainer.addEventListener( 'submit', function( e ){
		if( e.target.tagName == 'FORM' ){
			e.preventDefault();
			b.sendForm( 
				e.target.children, 
				e.target.action,
				e.target.method,
				function(){
					alert( 'booking sent!' );
			} );
		}
	});
	roomsContainer.addEventListener( 'click', function( e ){
		switch( e.target.dataset.action ){
			case 'book':
				b.showCalendar( e.target.parentElement.parentElement );
				break;

			case 'send':
				e.preventDefault();
				b.sendForm( 
					e.target.parentElement.children, 
					e.target.parentElement.action,
					e.target.parentElement.method,
				 	function(){
						alert( 'booking sent!' );
					} );
				break;
		}
	});



})();