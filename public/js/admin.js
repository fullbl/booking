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




(function(){
	b.loadTable( document.getElementById( 'rooms' ) );
	b.loadTable( document.getElementById( 'bookings' ) );

	/* --------------------- HANDLERS -------------------- */
	document.getElementById('admin').addEventListener( 'submit', function( e ){
		if( e.target.tagName == 'FORM' ){
			e.preventDefault();
			b.sendForm( e.target, function( room ){
				b.createRowInTable( room, document.getElementById( 'rooms-table' ) );
			} );
		}
	} );
})();