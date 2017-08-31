$(document).ready(function(){
    var socket = initSockerIO();
    var register = {};

    function clickCallback(el, data) {

        socket.emit('click_wish_item', data);

    }

    initWithList(clickCallback, register);

    socket.on('connect', function(msg) {
        console.log('WebSocket Connect', msg);

        if (msg) {
            $.each(msg, function(k, v) {
                var el = register[k];
                if (v === 'True') {
                    el.addClass('completed');
                } else {
                    el.removeClass('completed');
                }
                el.data('completed', v === 'True');
            });
        }
    });

    socket.on('click_wish_item_response', function (msg) {
        console.log('WebSocket Response:', msg);
        var id = msg['id'];
        var el = register[id];

        if (msg['completed']) {
            el.addClass('completed');
        } else {
            el.removeClass('completed');
        }
        el.data('completed', msg['completed']);

    });
});


function initSockerIO() {
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/wish_list');

    return socket;
}


function initWithList(clickCallback, register) {
    var items = $('li.wish-item');
    $.each(items, function() {
        var el = $(this);
        var data = el.data();
        register[data['id']] = el;
    });

    items.click(function() {
        var el = $(this);
        var data = el.data();

        data['completed'] = !data['completed'];

        console.log('Element data:', data);

        if (data['completed']) {
            el.addClass('completed');
        } else {
            el.removeClass('completed');
        }
        clickCallback(el, data);
    });
}
