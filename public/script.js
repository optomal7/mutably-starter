console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  // get all the data on load of the page
  getAllpokemon();

  $('#new-poke-form').on('submit', function(event) {
    event.preventDefault()
    var newpokeData = $(this).serialize();
    console.log(newpokeData);
    $(this).trigger("reset");
    $.ajax({
      method: 'POST',
      url: 'http://mutably.herokuapp.com/pokemon/',
      data: newpokeData,
      success: handlepokeAddResponse
    })
  })

  // becasue the delete-btn is added dynamically, the click handler needs to be written like such, bound to the document
  $(document).on('click', '.delete-btn', function() {
    var id = $(this).data('id')
    $.ajax({
      method: 'DELETE',
      url: 'http://mutably.herokuapp.com/pokemon/'+id,
      success: handlepokeDeleteResponse
    })
  })

  $(document).on('click', '.edit-btn', function() {
    var id = $(this).data('id')

    // hide the static name, show the input field
    $('.name-'+id).hide()
    $('.input-'+id).show()

    // hide the edit button, show the save button
    $('.edit-'+id).hide()
    $('.save-'+id).show()

  })

  $(document).on('click', '.save-btn', function() {
    var id = $(this).data('id')

    // grab the user's inputted data
    var updatedname = $('.input-'+id+' input').val()
    $.ajax({
      method: 'PUT',
      url: 'http://mutably.herokuapp.com/pokemon/'+id,
      data: {name: updatedname},
      success: handlepokeUpdateResponse
    })
  })
});

function getAllpokemon() {
  $('.list-group').html('')
  $.ajax({
    method: 'GET',
    url: 'http://mutably.herokuapp.com/pokemon'
  }).done(function(data) {
    for (var i=0; i<data.pokemon.length; i++) {
      $('.list-group').append('<li class="list-group-item item-'+data.pokemon[i]._id+'">'
      +'<button class="btn btn-primary edit-btn edit-'+data.pokemon[i]._id+'" data-id="'+data.pokemon[i]._id+'">Edit</button>'
      +'<button class="btn btn-success save-btn save-'+data.pokemon[i]._id+'" data-id="'+data.pokemon[i]._id+'">Save</button>'
      +'<span class="name-'+data.pokemon[i]._id+'">&nbsp;'+data.pokemon[i].name+'</span>'
      +'<span class="form-inline edit-form input-'+data.pokemon[i]._id+'">&nbsp;<input class="form-control" value="'+data.pokemon[i].name+'"/></span>'
      +'<button class="btn btn-danger delete-btn pull-right" data-id="'+data.pokemon[i]._id+'">Delete</button>'
      +'</li>')
    }
  })
}

function handlepokeAddResponse(data) {
  console.log(data);
  // reretrieve and rerender all the pokemon
  getAllpokemon();
}

function handlepokeDeleteResponse(data) {
  console.log('handlepokeDeleteResponse got ', data);
  var pokeId = data._id;
  var $row = $('.item-' + pokeId);
  // remove that poke row
  $row.remove();
}

function handlepokeUpdateResponse(data) {
  var id = data._id;

  // replace the old name with the new name
  $('.name-'+id).html('&nbsp;'+data.name)

  $('.name-'+id).show()
  $('.input-'+id).hide()
  $('.edit-'+id).show()
  $('.save-'+id).hide()
}
