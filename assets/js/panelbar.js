
// Class handler functions

var hasClass = function (elem, className) {
  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
};

var addClass = function (elem, className) {
  if (!hasClass(elem, className)) {
    elem.className += ' ' + className;
  }
};

var removeClass = function (elem, className) {
  var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '');
  }
};


var panelbar  = document.getElementById('panelbar');
var controls  = document.getElementById('panelbar_controls');
var switchbtn = document.getElementById('panelbar_switch');
var flipbtn   = document.getElementById('panelbar_flip');



if ( 'querySelector' in document && 'addEventListener' in window ) {

  // Visibility toggle & flip
  switchbtn.addEventListener('click', function () {
    if (hasClass(panelbar, 'hidden')) {
      removeClass(panelbar, 'hidden');
    } else {
      addClass(panelbar, 'hidden');
    }
  });

  flipbtn.addEventListener('click', function () {
    if (hasClass(panelbar, 'top')) {
      removeClass(panelbar, 'top');
    } else {
      addClass(panelbar, 'top');
    }

    if (hasClass(panelbar, 'bottom')) {
      removeClass(panelbar, 'bottom');
    } else {
      addClass(panelbar, 'bottom');
    }

  });


} else {
  // remove switch in legacy Browser
  controls.remove();
  panelbar.style.paddingRight = 0;
  panelbar.classList.remove("hidden");
}



// EnhancedJS with jQuery

if (window.jQuery && enhancedJS === true) {
  $(function() {

    // Element: toggle
    $(".panelbar--toggle > a").on("click", function (e) {
      e.preventDefault();

      var status = $(this).find('span').text() === 'Visible' ? 'hide' : 'publish';
      var url    = siteURL + "/panel/api/pages/" + status + "/" + currentURI;

      $.ajax({
        type: "POST",
        url: url
      });

      $(this).find('.fa').toggleClass('fa-toggle-off fa-toggle-on');
      $(this).find('span').text(status === "hide" ? "Invisible" : "Visible");

      setTimeout(function() {
        location.reload();
      }, 100);

    });

    // Element: preview

    $(".panelbar--preview > a").on("click", function (e) {
      e.preventDefault();

      // Button & Label
      $(this).find('i').toggleClass('fa-compress fa-desktop');


      // Iframes
      var wrapper = $('.panelbar__preview');
      var editIF  = wrapper.find('.panelbar__preview--edit');
      var viewIF  = wrapper.find('.panelbar__preview--view');

      // Show split preview
      wrapper.toggleClass('show');
      $('html, body').toggleClass('pb_disable');
      $('.panelbar__preview iframe').attr('src', function() {
        return $(this).data('src');
      });

      // EDIT
      editIF.load(function () {
        PBPreviewInitEdit(editIF, viewIF);
      });

      // VIEW
      viewIF.load(function () {
        var view    = viewIF.contents();

        view.find('a').on('click', function () {
          e.preventDefault();
          window.location = $(this).attr('href');
        });
      });


    });


  });
}

function PBPreviewInitEdit(editIF, viewIF) {
  var edit = editIF.contents();

  setTimeout(function() {
    edit.find('.topbar').hide();
    edit.find('body').css({'margin-top':'-48px'});

    var offset = edit.find('.form').offset();
    if(offset !== undefined) {
      edit.scrollTop(offset.top - 10);
    }

    edit.find('.btn-submit').on('click', function() {
      setTimeout(function() {
        viewIF.attr('src', viewIF.attr('src'));
        PBPreviewInitEdit(editIF, viewIF);
      }, 200);
    });

  }, 200);
}
