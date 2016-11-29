var camerasActive;
$('.gallery').each(function() { // the containers for all your galleries
    $(this).magnificPopup({
        delegate: 'a', // the selector for gallery item
        type: 'image',
        gallery: {
            enabled: true
        }
    });
});

var cameras = {
    curiosity: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
    opportunity: ['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM'],
    spirit: ['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM']
};

function getRoverData(name, callback) {

    $.ajax({
        url: 'https://api.nasa.gov/mars-photos/api/v1/manifests/' + name.toLowerCase() + '?api_key=PGRl3RyHaHjj3ParHKccTiMMNCNuDeSRpbdHJWsm',
        method: 'GET'
    }).done(function(res) {
        callback(res);
        showRoverCamera(name);
    });
}

function getRoverGallery(name, callback, camerasActive) {
    var sol_day = $('#sol-selector_val').text();
    $.ajax({
        url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + name.toLowerCase() + '/photos?sol=' + sol_day + '&api_key=Gr3St2r31hrlUI1kMV88Xi2OLbQLIK5RKRmPeTDc',
        method: 'GET',
        type: 'jsonp',
    }).done(function(res) {
        callback(res);
    });
}

function showRoverCamera(name) {

    var roverCamera = cameras[name];
    $('#rover_camera').empty();
    var div = $("<div class='checkbox'>");
    $('#rover_camera').append(div);

    for (var i = 0; i < roverCamera.length; i++) {

        var input;
        var label = $("<label>")
        if (i === 0) {
            input = $('<input type="checkbox" checked>');
        } else {
            input = $('<input type="checkbox">');
        }
        label.text(roverCamera[i]);
        input.val(roverCamera[i]);


        $(div).append(input);
        $(div).append(label);
        $(div).append('<br>');
    }

};

$('span.rover').on("click", function() {
    name = $(this).attr('id');
    $('span.rover img').removeClass('active') //Clear all checked class on span.rover img
    $(this).children('img').addClass('active') //Add checked class to current clicked .active
    getRoverData(name, handleResults);
});


function handleResults(res) {
    $('#rover_name').text(res.photo_manifest.name);
    $('#total_photos').text(res.photo_manifest.total_photos);
    $('#max_sol').text(res.photo_manifest.max_sol);
    $('#landing_date').text(res.photo_manifest.landing_date);
    $('#launch_date').text(res.photo_manifest.launch_date);
    $('#sol-selector').attr('max', res.photo_manifest.max_sol);
    $('#sol-selector').attr('value', res.photo_manifest.max_sol);
    $("#sol-selector_val").text(res.photo_manifest.max_sol);

}
$("#sol-selector").on('change', function() {
    $("#sol-selector_val").text($(this).val());
});


getRoverData('curiosity', handleResults);

function handelCameraRes(res) {
    var gallery = res.photos;
    var arrayChange = [];
    $(".gallery").html('');
    for (var i = 0; i < gallery.length; i++) {
        for (var j = 0; j < camerasActive.length; j++) {
            if (camerasActive[j] === gallery[i].camera.name) {
                var img_src = gallery[i].img_src;
                var figure = $('<figure class="col-md-3 text-center">');
                var anqer = $('<a  href="' + img_src + '">')
                var imgSee = $('<img src="' + img_src + '"/>');
                $(anqer).append(imgSee);
                $(figure).append(anqer);
                $('.gallery').append(figure);
            }
        }

    }

}

var camerasActive;
$('#rover_photo').on('click', function() {
    camerasActive = [];
    $('#rover_camera input:checked').each(function() {
        camerasActive.push($(this).attr('value'));
    });
    var rover = $('#rover_name').text().toLowerCase();
    getRoverGallery(rover, handelCameraRes);
});
