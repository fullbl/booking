/* ------------------ GENERAL FUNCTIONS ------------------------- */

/* ---------------------- APP FUNCTIONS ------------------------- */

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
		if( tds.hasOwnProperty( i ) ){
			switch( tds[i].className ){
				case 'actions':
					tds[i].innerHTML = saveElement.innerHTML;
					break;

				case 'related':
					//can't edit field from related tables
					break;

				default:
					tds[i].innerHTML = '<input '
						+ 'class="form-control" '
						+ 'type="text" '
						+ 'name="' + tds[i].dataset.name + '" '
						+ 'value="' + tds[i].innerHTML + '">';
			}
		}
	}

};

/**
 * save row data
 * @param {DOMElement} row row of table
 * @param {String} url where to send PUT data
 */
Booking.prototype.saveRowTable = function( row, url ){
	var self = this;
	this.sendForm( row.getElementsByTagName( 'INPUT' ), url, 'PUT', function( data ){
		var tr = self.createRowInTable( data, undefined, [ 'edit', 'remove' ] );
		row.parentElement.replaceChild( tr, row );
	} );
};


/**
 * delete row data
 * @param {DOMElement} row row of table
 * @param {String} url where to send PUT data
 */
Booking.prototype.removeRowTable = function( row, url ){
	var self = this;
	this.xhr( url, 'DELETE', undefined, function(){
		location.reload() // deleting a room means deleting related bookings.. it's easier to reload page!
	}, function( res ){ // do nothing if error
	});
};

/* ---------------------- STARTUP FUNCTIONS ------------------------- */
(function(){
	var adminContainer = document.getElementById('admin'),
	roomsForm = document.getElementById( 'admin-rooms' ),
	bookingsForm = document.getElementById( 'admin-bookings' ),
	handler
	;

	b.loadTable( roomsForm, [ 'edit', 'remove' ] );
	b.loadTable( bookingsForm, [ 'edit', 'remove' ] );

	/* --------------------- HANDLERS -------------------- */

	handler = function( endpoint, e ){
		switch( e.target.dataset.action ){
			case 'edit':
				b.editRowTable( e.target.parentElement.parentElement );
				break;

			case 'remove':
				b.removeRowTable( 
					e.target.parentElement.parentElement, 
					endpoint + e.target.parentElement.parentElement.dataset.id );
				break;

			case 'save':				
				b.saveRowTable( 
					e.target.parentElement.parentElement, 
					endpoint + e.target.parentElement.parentElement.dataset.id );
			break;
		}

	}
	/** actions buttons listener */
	if( roomsForm )
		roomsForm.addEventListener( 'click', function( e ){
			handler( '/api/room/', e ); //TODO: get action from backend (using META or <script>)
		});

	if( bookingsForm )
		bookingsForm.addEventListener( 'click', function( e ){
			handler( '/api/booking/', e ); //TODO: get action from backend (using META or <script>)
		});

	/** forms submit listener */
	if( adminContainer )
		adminContainer.addEventListener( 'submit', function( e ){
			if( e.target.tagName == 'FORM' ){
				e.preventDefault();
				b.sendForm( 
					e.target.elements, 
					e.target.action, 
					e.target.method, 
					function( obj ){
						b.createRowInTable( obj, document.getElementById( 'admin-rooms-table' ), [ 'edit', 'remove' ] );
					} );
			}
		} );
})();