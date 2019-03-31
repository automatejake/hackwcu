$(document).ready(function () {
    
    // for each element in array
    // $('#new').append($('<li>').text(message));
    
    $('#arrow').click(function(){
        window.location.href = '/landing'
    });

    $('#new').sortable({
        connectWith: '#new,#progress,#review',
        stop: function () {
            console.log('progress')
        }
    })
    $('#progress').sortable({
        connectWith: '#new,#progress,#review',
        stop: function () {
            console.log('review')
        }
    })
    $('#review').sortable({
        connectWith: '#new,#progress,#review',
        stop: function () {
            console.log('new')
        }
    })
});