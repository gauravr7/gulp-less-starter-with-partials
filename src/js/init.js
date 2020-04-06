// initialisation file for Integration Hub
$(document).ready(function () {

    $(document).keyup(function(e) {
        // esc button pressed
        if (e.keyCode === 27) {
            if($('.js-modal-close')) {
                $(document).find('.js-modal-close').trigger('click');
            } 
            if($('.ih-dropdown-dismiss')) {
                $(document).find('.ih-dropdown-dismiss').trigger('click');
            }
            if($('.ih-close-icon')) {
                $(document).find('.ih-close-icon').trigger('click');
            }
        }   
    });

    $(document).on('keypress','.js-no-special-chars', function(e){
        var regex = new RegExp("^[a-zA-Z0-9 ]");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }

        e.preventDefault();
        return false;
     });

    var specialChars = "[]"
    var check = function(string) {
        for(i = 0; i < specialChars.length;i++){
            if(string.indexOf(specialChars[i]) > -1){
                return true
            }
        }
        return false;
    }
    
    $(document).on('blur','#b1diDIProxyHost', function(e){
        if(check($('#b1diDIProxyHost').val()) != false){
            //alert('Your search string contains illegal characters.');
            $(this).parents('.form-group').next().find('.ih-mandatory').hide();
            $(this).parents('.form-group').next().find('#b1diDIProxyPort').removeClass('.mandatory');
        } else {
            $(this).parents('.form-group').next().find('.ih-mandatory').show();
            $(this).parents('.form-group').next().find('#b1diDIProxyPort').addClass('.mandatory');
        }
    });
    $('#b1diDIProxyHost').trigger('blur');

    // sld assigment 
    $('#add-sld').click(function() {  
        $('#assigned-sld option:selected').each(function() {
            var linkType = $(this).data('link');
            $('#assigned-sld option[data-link="'+linkType+'"]').remove().appendTo('#unassigned-sld');
        });
    });  
    
    $('#remove-sld').click(function() { 
        $('#unassigned-sld option:selected').each(function() {
            var linkType = $(this).data('link');
            $('#unassigned-sld option[data-link="'+linkType+'"]').remove().appendTo('#assigned-sld');
        });
    });  

    var data = $("#unique-id .popover-body").html();
    
    if($('.ih-title-edit-text').length) {
        var editTitle = $('.ih-title-edit-text').val(),
        charLimit = $('.ih-char-limit-counter').data('charLimit');

        $('.usedChar').text(editTitle.length);
        $('.totalCharLimit').text(charLimit);

        $('.ih-title-edit-text').on('keyup', function() {
            editTitle = $('.ih-title-edit-text').val();
            if(editTitle.length >= charLimit) {
                $('.ih-char-limit-counter').addClass('ih-limit-over'); 
            } else {
                $('.ih-char-limit-counter').removeClass('ih-limit-over'); 
            }
            $('.usedChar').text(editTitle.length);
        })
    }
    
    var UrlRegex = /^(?:https?:\/\/)?(?:ftp?:\/\/)?(?:www\.)?/i;

        $('.ihUrlTrimmer').on('blur', function () {
            var orgURL = $(this).val(),
                cleanUrl = orgURL.replace(UrlRegex, "");
            $(this).val(cleanUrl);
        });
            
    // $("[data-toggle=popover]").popover({
    //     html: true,
    //     trigger: 'click',
    //     content: function () {
    //         var content = $(this).attr("data-popover-content");
    //         return $(data);
    //     }
    // });

    $(document).on('click', '.ih-add-custom-item', function() {
        $('<tr><td><input class="form-control ih-form-control1" value="" placeholder="Custom Field"/></td><td><input class="form-control ih-form-control1" value="" placeholder="Custom Field"/></td></tr>').insertBefore($(this).parents('tr'));
        
    })

    $('.ih-accordian-heading').on('click', function() {
        $(this).toggleClass('active');
        $(this).next().toggleClass('active');
    })
    var $body = $('body');
    console.log("ready!");
    setupPage();
    setupSidebar();

    // Show Modal
    $('.ih-js-open-modal-btn').click(function (e) {
        console.log('Open Modal');
        var modalName = $(this).data('open-modal'),
            modalUrl = $(this).data('url'),
            modalWidth = $(this).data('modal-width');

        $.get(modalUrl)
            .done(function (response) {
                console.log("Load was Successful.");
                $body.find('.ih-app-modal').html(response);
                $body.find('.ih-app-modal').removeClass('show-modal');
                if (modalWidth) {
                    $body.find('#' + modalName).find('.ih-app-modal-content').width(modalWidth);
                    $body.find('#' + modalName).addClass('show-modal');
                } else {
                    $body.find('#' + modalName).addClass('show-modal');
                }
            })
            .fail(function () {
                alert('Error in Ajax Call !!');
            });

    });

    //Close Modal Btn
    $(document).on('click', '.ih-js-close-modal-btn', function (e) {
        $body.find('.ih-app-modal').removeClass('show-modal');
    });

    //Form submit
    $("form").on('submit', function (e) {
        //stop form submission
        e.preventDefault();

        console.log('Form Submitted action');
        //write custom JS here.
    });

    //tabs component
    $(document).on('click', '.ih-app-tabs-menu-item', function () {
        var setActiveTab = $(this).data('set-tab');
        $(this).addClass('active').siblings().removeClass('active');
        $('.ih-app-tabs-component').find('.ih-app-tab-container').removeClass('active');
        $('.ih-app-tabs-component').find('.ih-app-tab-container[id=' + setActiveTab + ']').addClass('active');
    })

    //side bar menu item click
    $(document).on('click', '.js-sidebar-item', function () {
        if (!$(this).hasClass('js-disabled-btn')) {
            $('.ih-app-sidebar-list-container').find('.js-sidebar-item').removeClass('active');
            $(this).addClass('active');
            console.log($(this).data('url'), $(this).text());
        }
    });

    //show deployemnt pop    
    $(document).on('click', '#deploynow-btn', function () {
        function displayIndex() { // array as input
            var i = 0,
                arr = $('.ih-deployment-step');
            var current;
            run = setInterval(function () { // set function inside a variable to stop it later
                if (i < arr.length) {
                    current = arr[i]; // Asign i as vector of arr and put in a variable 'current'
                    $(arr[i]).addClass('active');
                    i = i + 1; // i increasing
                } else {
                    clearInterval(run); // This function stops the setInterval when i>=arr.lentgh
                }
            }, 1000);
        }
        displayIndex();
    });

    $(document).on('click', '.ih-app-deployment-OK-btn', function () {
        $('.ih-app-deployment-widget').removeClass('active');
    });

    //----------- Dropdown Toggle
    $(document).on('click', '.ih-dropdown-toggle', function () {
        $('.dropdown').removeClass('show');
        $(this).parent('.dropdown').addClass('show');
    });
    $(document).click(function (e) {
        e.stopPropagation();
        var container = $(".dropdown");

        //check if the clicked area is dropDown or not
        if (container.has(e.target).length === 0) {
            $('.dropdown').removeClass('show');
        }
    })
    $(document).on('click', '.dropdown .ih-dropdown-dismiss', function () {
        $(this).parents('.dropdown').removeClass('show');
    })
    //bootstrap styled modal from js
    $(document).on('click', '.js-modal-show', function () {
        var modal = $(this).attr('data-target');
        $('#' + modal).addClass('show');
    })

    $(document).on('click', ".js-modal-close", function () {
        $(this).parentsUntil('modal').removeClass('show');
    });

    $(document).on('click', '.js-popover-show', function () {
        var popover = $(this).attr('data-popover');
        $(popover).toggle();
    })
    
    //dashboard page 
    var customers = $('.ih-customer-data-list .ih-customer-list-item').length;
    console.log(customers);

    if (customers === 1) {
        $('.ih-customer-data-list').addClass('ih-data-list-view');
        //$('.ih-app-table-filter').hide();
    } else {
        $('.ih-customer-data-list').addClass('ih-data-grid-view');
    }
    
    if (customers > 4) {
        $('.ih-js-customer-carousel').slick({
            arrows: false,
            slidesToShow: 4,
            slidesToScroll: 2,
            speed: 300,
            dots: true,
            infinite: true
        });
    }

    $('.ih-icon-only-btn.ih-sap-icon-grid').on('click', function () {
        if (customers > 4) $('.ih-js-customer-carousel').slick();
        $('.ih-data-view .ih-icon-only-btn').removeClass('active');
        $(this).addClass('active');
        $('.ih-customer-data-list').addClass('ih-data-grid-view');
        $('.ih-customer-data-list').removeClass('ih-tableUi');
        if (customers === 1) {
            $('.ih-customer-data-list').addClass('ih-data-list-view');
            $('.ih-customer-data-list').removeClass('ih-data-grid-view');
        }
    })

    $('.ih-icon-only-btn.ih-sap-icon-list').on('click', function () {
        $('.ih-js-customer-carousel').slick('unslick');
        $('.ih-data-view .ih-icon-only-btn').removeClass('active');
        $(this).addClass('active');
        $('.ih-customer-data-list').removeClass('ih-data-grid-view');
        $('.ih-customer-data-list').addClass('ih-tableUi');
        if (customers === 1) {
            $('.ih-customer-data-list').removeClass('ih-data-list-view');
        }
    })

    // Delete Popup for site	
    $('#delete-1').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#delete-Modal-1').css('opacity', 1);
        $('#delete-Modal-1').show();
    });

    $('#delete-2').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#delete-Modal-2').css('opacity', 1);
        $('#delete-Modal-2').show();
    });

    $('#retry-successful').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#retry-Modal').css('opacity', 1);
        $('#retry-Modal').show();
    });

    $('#tree-popup').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#tree-Modal').css('opacity', 1);
        $('#tree-Modal').show();
    });


    $('#delete-Modal-1, #delete-Modal-2, #retry-Modal').click(function (e) {
        e.stopPropagation(); // when you click within the content area, it stops the page from seeing it as clicking the body too
    });
    $('body').click(function () {
        $('#delete-Modal-1, #delete-Modal-2, #retry-Modal').hide();
        $('#delete-Modal-1, #delete-Modal-2, #retry-Modal').css('opacity', 0);
    });
    $('#delete-Modal-1 .close-popup, #delete-Modal-2 .close-popup, #retry-Modal .close-popup, #tree-Modal .close-popup').click(function () {
        $('#delete-Modal-1, #delete-Modal-2, #retry-Modal, #tree-Modal').hide();
        $('#delete-Modal-1, #delete-Modal-2, #retry-Modal, #tree-Modal').css('opacity', 0);
    });

    $(document).on('click', '.ih-title-edit-text' ,function () {
        $(this).select();
     });

    $(document).on('click','.ih-template-popup .ih-title-edit-icon', function() {
        $('.ih-title-edit-text').addClass('show');
        $('.ih-template-modal-title').removeClass('show');
        $('.ih-title-save-icon').addClass('show');
        $('.ih-title-edit-icon').removeClass('show');
        $('.ih-title-edit-text').trigger('click');
    });
    $(document).on('click','.ih-template-popup .ih-title-save-icon' , function() {
        $('.ih-title-edit-text').removeClass('show');
        $('.ih-template-modal-title').addClass('show');
        $('.ih-title-save-icon').removeClass('show');
        $('.ih-title-edit-icon').addClass('show');
    });

    $(document).on('blur keyup','.ih-template-popup .ih-title-edit-text' , function(e) {
        $('.ih-template-modal-title').text($(this).val());
        var str = $(this).val();
        var newString = str.replace(/[^a-zA-Z0-9]/gm, "");
        $(this).val(newString);
    });

    $(document).on('keypress','.ih-template-popup .ih-title-edit-text' , function(e) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    });
    
    $(document).on('change', '#uploadCompanyLogo', function() {
        var fileName = $(this).val().replace(/C:\\fakepath\\/i, '');
        $('.companyLogoLabel').text(fileName);
    })

    $(document).on('click', '.ih-customer-title', function(e){
        e.preventDefault(); // stops link from making page jump to the top
        e.stopPropagation(); // when you click the button, it stops the page from seeing it as clicking the body too
        $('.ih-customers-list').toggle();
        $(this).toggleClass('active');
    });

    $(document).on('click', '.ih-customers-list li',function() {
        $('.ih-customer-title').text($(this).text());
        $('.ih-customers-list').hide();
    })

    $('body').on('click', function() {
        $('.ih-customers-list').hide();
        $('.ih-customer-title').removeClass('active');
    })
}); // Ready closes here

function showLoader() {
    $('.ih-site-loader').addClass('show');
}

function hideLoader() {
    $('.ih-site-loader').removeClass('show');
}

function setupPage() {
    $(".ih-app-sidebar").load("../partials/sidebar.html");
    $(".ih-app-content-header").load("../partials/header.html");
}

function setupSidebar() {
    $(document).on('click', '.ih-app-sidebar-list-item-label', function () {
        if (!$(this).hasClass('js-disabled-btn')) {
            $(this).parent().toggleClass('active').siblings().not('.ih-app-sidebar-submenu').removeClass('active');
        }
    });
}
