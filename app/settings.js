$('document').ready(function () {
    $('#settings-controls')
        .on('submit', function (ev) {
            ev.preventDefault();
            var interval = $('#refresh-interval').val();
            localStorage.setItem('refresh', interval)
            $('#notify').html('Settings Saved.<br/>Changes will take effect on browser restart!');
        });
    var interval = localStorage.getItem('refresh') || '1';
    $('#refresh-interval').val(interval);
});