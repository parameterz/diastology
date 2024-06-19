$(document).ready(function() {
    // Handle start button click
    $('#startButton').on('click', function() {
        loadDecisionPoint('node1');
    });

    // Handle form submission dynamically
    $(document).on('submit', '#decisionForm', function(event) {
        event.preventDefault();  // Prevent the default form submission
        processDecision();
    });

    // Handle browser back/forward buttons
    window.onpopstate = function(event) {
        if (event.state) {
            loadDecisionPoint(event.state.node, false);
        }
    };
});

function loadDecisionPoint(node, pushState = true) {
    $.ajax({
        url: node + '.html',
        method: 'GET',
        success: function(data) {
            $('#content').html(data);
            if (pushState) {
                history.pushState({ node: node }, '', node);
            }
        },
        error: function() {
            $('#content').html('<p>Error loading content.</p>');
        }
    });
}

function processDecision() {
    const formData = $('#decisionForm').serializeArray();
    const data = {};

    $.each(formData, function(index, field) {
        data[field.name] = field.value;
    });

    let nextNode = 'default';  // Default next node

    const currentPage = $('body').data('node');
    switch(currentPage) {
        case 1:
            if (data.heartRate && data.heartRate < 60) {
                nextNode = 'node_bradycardia';
            } else if (data.heartRate && data.heartRate > 100) {
                nextNode = 'node_tachycardia';
            } else if (data.symptoms === 'severe') {
                nextNode = 'node_critical';
            } else {
                nextNode = 'node2';
            }
            break;
        default:
            nextNode = 'default';
    }

    localStorage.setItem('lastDecision', JSON.stringify(data));
    loadDecisionPoint(nextNode);
}
