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
Booking.prototype.sendForm = function( form, callback ){
	var formData, 
		self = this,
		error = function( errors ){
			self.loopFormElements( form.children, function( el ){
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
		self.loopFormElements( form.elements, function( el ){
			formData.push( el.name + '=' + el.value );
		});
		formData = encodeURI( formData.join( '&' ) );
	}

	this.xhr( form.action, form.method, formData, callback, error );
};


/* ---------------------- APP FUNCTIONS ------------------------- */

/**
 * create room from json Object
 * @param  {json} room object
 */
Booking.prototype.createRoom = function( room ){
	this.createRowInTable( document.getElementById( 'rooms' ), room );
};

/**
 * create room from json Object
 * @param  {json} room object
 */
Booking.prototype.createRoom = function( room ){
	var tr = document.createElement('TR'),
		_td = document.createElement('TD'),
		td,
		table = document.getElementById('rooms');

	for( var i in room )
		if( room.hasOwnProperty( i ) ){
			td = _td.cloneNode();
			td.innerHTML = room[i];
			tr.appendChild( td );
		}
	table.appendChild( tr );
};

(function(){
	if( document.getElementsByTagName( 'form' ).length ){ //attach handler only if there are forms
		document.getElementById('admin').addEventListener( 'submit', function( e ){
			if( e.target.tagName == 'FORM' ){
				e.preventDefault();
				b.sendForm( e.target, b.createRoom );
			}
		} );
	}
})();