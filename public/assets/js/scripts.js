 // copy to memory tweets text
  $('.copy-one').on('click', function(event){
    event.preventDefault();
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('.user-one').text()).select();
    document.execCommand("copy");
    $temp.remove();
  })
  $('.copy-two').on('click', function(event){
    event.preventDefault();
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('.user-two').text()).select();
    document.execCommand("copy");
    $temp.remove();
  })

  // capture the form inputs
  $('#submit').on('click', function(event) {
    event.preventDefault();
    $('.spinner').show();

    // Form validation
    function validateForm() {
      var isValid = true;
      $('.form-control').each(function() {
        if ($(this).val() === '') {
          isValid = false;
        }
      });
      return isValid;
    }

    if (validateForm()) {
      var userData = {
        handle1: $('#handle1').val(),
        handle2: $('#handle2').val(),
      };

      // post the data to the tweets API.
      $.get(
        '/api/tweets/' + userData.handle1 + '/' + userData.handle2,
        function(data) {
          $('.user-one').text(data.user1);
          $('.user-two').text(data.user2);
          $('.bird1').text(userData.handle1);
          $('.bird2').text(userData.handle2);
          $('.copy-results').show('slow');
          $('#handle1').val('');
          $('#handle2').val('');
          $('.spinner').hide();
        }
      );
    } else {
      alert('Please fill out all fields before submitting!');
    }
  });