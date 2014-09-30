// remap jQuery to $
(function($){

	"use strict";

	/* trigger when page is ready */
	$(document).ready(function (){

		// define some ambiguously named variables
		var $save = $('.save'),
			$saved = $('.saved'),
      $textTitle = $('.text-title'),
      $editor = $('.editor'),
      $saveAlert = $('.save-alert');

		// init jquery.notebook.js plugin
    ($editor).notebook({
        autoFocus: true,
        placeholder: 'Type something awesome...'
    });

    // save the contents of the editor window to localstorage and name its key after the title field
    ($save).on( "click", function() {
      var title = $('.text-title').val();
      localStorage[title] = document.querySelector('.editor').innerHTML;
      // refresh the list of entries
      refreshList();
      ($saveAlert).slideDown().delay(1500).slideUp('slow');
    });
	  // save button is disabled if title field is empty 
    ($textTitle).on('input', function() {
      if ($(this).val()) {
        ($save).attr('enabled', 'enabled').removeAttr('disabled');
      } else {
        ($save).attr('disabled', 'disabled').removeAttr('enabled');
      }
    });

    // on ready give the list of existing localstorage
    function refreshList() {
      ($saved).empty();

      for(var i=0, len=localStorage.length; i<len; i++) {
        var key = localStorage.key(i);
        ($saved).append('<button class="entry" value="'+key+'">'+key+'</button>');
      }
    }
    refreshList();

    // display an entry if you click its button
    ($saved).on('click', '.entry', function() {
      var k = $(this).html();
      var content = localStorage[k];

      ($saved).append('<div class="entry-content"><button class="edit" value="'+k+'">&#9999;</button><button class="close">&times;</button>'+content+'<button class="delete" value="'+k+'">&#9447; DELETE</button></div>');
    });

    // restore entry to editor if you hit edit
    ($saved).on('click', '.edit', function() {
      // close our preview, empty the editor input
      $(this).parent().remove();
      ($editor).empty();
      // set up some vars
      var k = $(this).attr('value'),
      restore = localStorage.getItem(k);
      // restore editor and title content using those vars
      ($editor).append(restore);
      ($textTitle).val(k);
      ($save).attr('enabled', 'enabled').removeAttr('disabled');
    });
    // close the entry if you hit close
    ($saved).on('click', '.close', function() {
      $(this).parent().remove();
    });
    // permanently delete the entry if you click delete
    ($saved).on('click', '.delete', function() {
      $(this).parent().remove();
      var k = $(this).attr('value');
      localStorage.removeItem(k);
      refreshList();
    });

	});

})(window.jQuery);