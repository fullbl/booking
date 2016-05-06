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
		if( object.hasOwnProperty( i ) ){
			td = _td.cloneNode();
			td.dataset.name = i;
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
		tr.appendChild( td )
	}
	if( typeof table !== 'undefined' )
		table.appendChild( tr );
	else
		return tr;
}

Booking.prototype.createButton = function( action ){
	var button = document.createElement('BUTTON');
	button.type = 'button';
	button.className = 'btn btn-default';
	button.dataset.action = action;
	button.innerHTML = action;
	return button;
}

/**
 * turn row values into inputs
 * @param {DOMElement} row row of table
 */
Booking.prototype.editRowTable = function( row ){
	var tds = row.children, 
		saveElement = document.createElement( 'DIV' );

	//save actual row for later
	row.dataset.oldHtml = row.innerHTML;

	saveElement.appendChild( this.createButton( 'save' ) );

	for( var i in tds ){
		if( tds[i].className == 'actions' ){
			tds[i].innerHTML = saveElement.innerHTML;
		}
		else{
			tds[i].innerHTML = '<input '
				+ 'type="text" '
				+ 'name="' + tds[i].dataset.name + '" '
				+ 'value="' + tds[i].innerHTML + '">';
		}
	}

}

/**
 * load index table
 * @param  {DOMElement} tableContainer the element which will contain the table
 */
Booking.prototype.loadTable = function( tableContainer, actions ){
	var self = this;
	this.xhr( tableContainer.dataset.url, 'GET', undefined, function( objects ){
		var rows = [], 
			table;
		if( objects.length ){
			table = document.createElement('TABLE');
			for( var i in objects ){
				if( objects.hasOwnProperty( i ) ){
					table.appendChild( self.createRowInTable( objects[i], undefined, actions ) );
				}
			}
			table.className = 'table';
			table.id = tableContainer.id + '-table';
			tableContainer.appendChild( table );
		}
		else{
			tableContainer.innerHTML = 'No data found';
		}


	});
}


var b = new Booking();