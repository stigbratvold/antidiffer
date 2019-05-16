$(function () {
  
  var $window = $(window)
  var $res = $('.res')
  
  var $p = $('.first_test .body')
  var $longread = $('.first_test .body.long_read')
  var $h1 = $('.first_test h1')
  var $h2 = $('.first_test h2')
  var $h3 = $('.first_test h3')
  var $description = $('.first_test .description')
  var $size_p = $('.first_test .size_p')
  var $size_h1 = $('.first_test .size_h1')
  var $size_h2 = $('.first_test .size_h2')
  var $size_h3 = $('.first_test .size_h3')
  var $size_description = $('.first_test .size_description')
  
  var $lineheight_p = $('.first_test .lineheight_p')
  var $lineheight_longread = $('.first_test .lineheight_longread')
  var $lineheight_h1 = $('.first_test .lineheight_h1')
  var $lineheight_h2 = $('.first_test .lineheight_h2')
  var $lineheight_h3 = $('.first_test .lineheight_h3')
  var $lineheight_description = $('.first_test .lineheight_description')
  
  var $p_second_test = $('.second_test .body')
  var $h1_second_test = $('.second_test h1')
  var $h2_second_test = $('.second_test h2')
  var $h3_second_test = $('.second_test h3')
  var $description_second_test = $('.second_test .description')
  var $size_p_second_test = $('.second_test .size_p')
  var $size_h1_second_test = $('.second_test .size_h1')
  var $size_h2_second_test = $('.second_test .size_h2')
  var $size_h3_second_test = $('.second_test .size_h3')
  var $size_description_second_test = $('.second_test .size_description')
  
  $window.on('resize', function (data) {
    $res.text($window.width())
    $size_h1.text($h1.css('fontSize'))
    $size_h2.text($h2.css('fontSize'))
    $size_h3.text($h3.css('fontSize'))
    $size_description.text($description.css('fontSize'))
    $size_p.text($p.css('fontSize'))
    
    $lineheight_p.text($p.css('lineHeight'))
    $lineheight_longread.text($longread.css('lineHeight'))
    $lineheight_h1.text($h1.css('lineHeight'))
    $lineheight_h2.text($h2.css('lineHeight'))
    $lineheight_h3.text($h3.css('lineHeight'))
    $lineheight_description.text($description.css('lineHeight'))
    
    $size_h1_second_test.text($h1_second_test.css('fontSize'))
    $size_h2_second_test.text($h2_second_test.css('fontSize'))
    $size_h3_second_test.text($h3_second_test.css('fontSize'))
    $size_description_second_test.text($description_second_test.css('fontSize'))
    $size_p_second_test.text($p_second_test.css('fontSize'))
    
  }).trigger('resize')
})

$(document).ready(function(){
    $("button").click(function(){
        $("small").toggle();
    });
});