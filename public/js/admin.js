/* ------------------ GENERAL FUNCTIONS ------------------------- */
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
Booking.prototype.sendForm = function( elements, action, method, callback ){
	var formData, 
		self = this,
		error = function( errors ){
			self.loopFormElements( elements, function( el ){
				self.removeClassName( el.parentElement, 'has-error' );
			})

			self.loopFormElements( errors, function( el ){
				self.addClassName( el.parentElement, 'has-error' );
			})
		};
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
 * turn row values into inputs
 * @param {DOMElement} row row of table
 */
Booking.prototype.editRowTable = function( row ){
	var tds = row.children, 
		fakeForm = document.createElement( 'FORM' ),
		saveElement = document.createElement( 'DIV' );

	//save actual row for later
	row.dataset.oldHtml = row.innerHTML;

	saveElement.appendChild( this.createButton( 'save' ) );

	for( var i in tds ){
		if( tds.hasOwnProperty( i ) ){
			if( tds[i].className == 'actions' ){
				tds[i].innerHTML = saveElement.innerHTML;
			}
			else{
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
		row.parentElement.removeChild( row );
	} );
};

/* ---------------------- APP FUNCTIONS ------------------------- */
(function(){
	var adminContainer = document.getElementById('admin'),
	roomsForm = document.getElementById( 'admin-rooms' ),
	bookingsForm = document.getElementById( 'admin-bookings' );
	b.loadTable( roomsForm, [ 'edit', 'remove' ] );
	b.loadTable( bookingsForm, [ 'edit', 'remove' ] );

	/* --------------------- HANDLERS -------------------- */

	/** actions buttons listener */
	roomsForm.addEventListener( 'click', function( e ){
		switch( e.target.dataset.action ){
			case 'edit':
				b.editRowTable( e.target.parentElement.parentElement );
				break;

			case 'remove':
				b.removeRowTable( 
					e.target.parentElement.parentElement, 
					'/api/room/' + e.target.parentElement.parentElement.dataset.id );
				break;

			case 'save':
				//TODO: get action from backend (using META or <script>)
				b.saveRowTable( 
					e.target.parentElement.parentElement, 
					'/api/room/' + e.target.parentElement.parentElement.dataset.id );
			break;
		}
	});

	/** forms submit listener */
	adminContainer.addEventListener( 'submit', function( e ){
		if( e.target.tagName == 'FORM' ){
			e.preventDefault();
			b.sendForm( e.target.elements, e.target.action, e.target.method, function( room ){
				b.createRowInTable( room, document.getElementById( 'admin-rooms-table' ), [ 'edit', 'remove' ] );
			} );
		}
	} );
})();