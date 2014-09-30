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
        ($saved).append('<button class="entry-btn" value="'+key+'">'+key+'</button>');
      }
    }
    refreshList();

    // display an entry if you click its button
    ($saved).on('click', '.entry-btn', function() {
      var k = $(this).html();
      var content = localStorage[k];

      ($saved).append('<div class="entry"><button class="edit" value="'+k+'">&#9999; EDIT</button><button class="close">&#10006;</button><div class="entry-content"><h3>'+k+'</h3>'+content+'</div><div class="entry-opts"><button class="delete" value="'+k+'">&#9447; DELETE</button><button class="pdf">&#9660; PDF</button></div></div>');
    });

    // restore entry to editor if you hit edit
    ($saved).on('click', '.edit', function() {
      // close our preview, empty the editor input
      $(this).parent().remove();
      ($editor).empty();
      // set up some vars
      var k = $(this).attr('value'),
      restore = localStorage.getItem[k];
      // restore editor and title content using those vars
      ($editor).append(restore);
      ($textTitle).val(k);
      ($save).attr('enabled', 'enabled').removeAttr('disabled');
    });

    // close the entry if you hit close
    ($saved).on('click', '.close', function() {
      $(this).parent().remove();
    });

    // move localStorage to sessionStorage if you click delete
    ($saved).on('click', '.delete', function() {
      $(this).parent().remove();
      var k = $(this).attr('value');
      sessionStorage[k] = localStorage.getItem[k];
      localStorage.removeItem[k];
      refreshList();
      $('body').append('<button class="undo" value="'+k+'">&#10226; UNDO</button>');
    });

    $('body').on('click', '.undo', function() {
      var k = $(this).attr('value');
      localStorage[k] = sessionStorage.getItem[k];
      refreshList();
      $(this).remove();
    });

    // create and download a PDF if you click on pdf button
    var doc = new jsPDF();

    ($saved).on('click', '.pdf', function() {
      doc.fromHTML($('.entry-content').get(0), 15, 15, {
        'width': 170 
    });

      doc.save('Test.pdf');
    });

	});

})(window.jQuery);