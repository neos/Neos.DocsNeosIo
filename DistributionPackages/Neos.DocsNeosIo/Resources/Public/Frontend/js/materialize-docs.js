(function($) {
  $(function() {

    // Plugin initialization
    $('.carousel').carousel();
    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicators: true,
      onCycleTo: function(item, dragged) {}
    });
    $('.collapsible').collapsible();
    $('.collapsible.expandable').collapsible({
      accordion: false
    });

    $('.dropdown-trigger').dropdown();
    $('.slider').slider();
    $('.parallax').parallax();
    $('.materialboxed').materialbox();
    $('.modal').modal();
    $('.scrollspy').scrollSpy();
    $('.datepicker').datepicker();
    $('.tabs:not(:empty)').tabs({
		indicator: false
	});
    $('.timepicker').timepicker();
    $('.tooltipped').tooltip();
    $('select')
      .not('.disabled')
      .formSelect();
    $('.sidenav').sidenav();
    $('.tap-target').tapTarget();
    $('input.autocomplete').autocomplete({
      data: { Apple: null, Microsoft: null, Google: 'http://placehold.it/250x250' }
    });
    $('input[data-length], textarea[data-length]').characterCounter();

    // Fab
    $('.fixed-action-btn').floatingActionButton();
    $('.fixed-action-btn.horizontal').floatingActionButton({
      direction: 'left'
    });
    $('.fixed-action-btn.click-to-toggle').floatingActionButton({
      direction: 'left',
      hoverEnabled: false
    });
    $('.fixed-action-btn.toolbar').floatingActionButton({
      toolbarEnabled: true
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space
