/*Number input should take only number. mozilla fix */
(function () {
    var selectors = document.querySelectorAll('input[type="number"]');
    for (i = 0; i < selectors.length; i++) {
        setInputFilter(selectors[i], function (value) {
            return /^\d*\.?\d*$/.test(value); /* Allow digits and '.' only, using a RegExp */
        });
    }
})();
/* Restricts input for the given textbox to the given inputFilter function. */
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}
/* Ajax uploader */
/* this is the id of the form */
/*
$(".ajax-upload").submit(function (event) {
    event.preventDefault();
    event.stopPropagation();
    var form = $(this);
    if (form.find('.list'))
        form.find('.list').fadeIn(100).css("width", "0px");
    var data = new FormData();
    var fields = form.serializeArray();
    $.each(fields, function (i, field) {
        data.append(field.name, field.value);
    });
    $.each(form.find('[type="file"]'), function (i, file_field) {
        data.append(file_field.getAttribute("name"), file_field.files[0]);
    });
    var url = form.attr('action');
    $.ajax({
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    if (form.find('.list')) {
                        form.find('.list').fadeIn(100).css({"width": 100 * percentComplete + '%',
                            "text-align": "center",
                            "color": "#000"
                        }).html(Math.floor(100 * percentComplete) + '%');
                    }
                }
            }, false);
            xhr.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                }
            }, false);
            return xhr;
        },
        success: function (data2) {
            if (form.find('.list')) {
                form.find('.list').css({
                    "width": "100%"
                }).html("Upload Complete!");
            }
            $('#success-modal').modal('show');
        },
        error: function (data2) {
            $('#error-modal').modal('show');
        }
    });
    return false;
});
*/
/* Display photo after selecting */
function displayPhotoOnSelect(input, id = 'display-photo-on-select') {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + id).attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
/* Form validation of the form with .needs-validation */
(function () {
    'use strict';
    window.addEventListener('load', function () {
        var forms = document.getElementsByClassName('needs-validation');
        Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                /* was-validated is a bootstrap class */
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();
/* Location control */
(function () {
    locationHandle('division', 'district', 'upazila', 'union', 'region');
    locationHandle('billing-division', 'billing-district', 'billing-upazila', 'billing-union', 'billing-region');
    locationHandle('shipping-division', 'shipping-district', 'shipping-upazila', 'shipping-union', 'shipping-region');
})();
function locationHandle(division, district, upazila, union, region) {
    var division_el = document.getElementById(division);
    var district_el = document.getElementById(district);
    var upazila_el = document.getElementById(upazila);
    var union_el = document.getElementById(union);
    var region_el = document.getElementById(region);
    if (division_el && district_el)
        division_el.addEventListener('change', function () {
            locationAjaxCall(division_el, district_el);
        });
    if (district_el && upazila_el)
        district_el.addEventListener('change', function () {
            locationAjaxCall(district_el, upazila_el);
        });
    if (division_el && region_el)
        division_el.addEventListener('change', function () {
            locationAjaxCall(division_el, region_el);
        });
    if (upazila_el && union_el)
        upazila_el.addEventListener('change', function () {
            locationAjaxCall(upazila_el, union_el);
        });
    if (union_el && region_el)
        union_el.addEventListener('change', function () {
            locationAjaxCall(union_el, region_el);
        });
}
function locationAjaxCall(item, child) {
    var base_url = $("meta[name=base-url]")[0].content;
    var id = item.id;
    id = id.replace("billing-", "");
    id = id.replace("shipping-", "");
    var c_id = child.id;
    c_id = c_id.replace("billing-", "");
    c_id = c_id.replace("shipping-", "");
    $.ajax({
        url: base_url + '/' + id + 's/' + item.value,
        success: function (result) {
            var options = result[0][c_id + 's'];
            var html = '<option value="0">--Select ' + c_id + '--</option>';
            options.forEach(function (entry) {
                html += '<option value="' + entry.id + '">' + entry.name + '</option>';
            });
            child.innerHTML = html;
        }
    });
}
/* Dropdowns filtering with two classes .derive-from (parent's id) in select, .derive-parent (parent option's value) in option */
(function () {
    var derives = document.querySelectorAll('[derive-from]');
    derives.forEach(function (item, index) {
        var id = item.getAttribute('derive-from');
        var options = item.options;
        for (let i = 0; i < options.length; i++) {
            options[i].classList.add('d-none');
        }
        var parent = document.getElementById(id);
        parent.addEventListener('change', function (e) {
            for (let i = 0; i < options.length; i++) {
                var value = parent.options[parent.selectedIndex].value;
                if (options[i].getAttribute('derive-parent') != value) {
                    options[i].classList.add('d-none');
                } else {
                    options[i].classList.remove('d-none');
                }
            }
        });
    });
})();
/* Vue cart */
(function () {
    if (!localStorage.getItem("cart")) {
        localStorage.cart = '[]';
    }
    if (document.getElementById('cart'))
        window.cart = new Vue({
            el: '#cart',
            data: {
                products: JSON.parse(localStorage.cart)
            },
            methods: {
                remove: function (id) {
                    this.products = this.products.filter(function (el) {
                        return el.id != id;
                    });
                }
            },
            computed: {
                totalProduct: function () {
                    var quantity_obj = {quantity: 0};
                    if (this.products.length > 0) {
                        quantity_obj = this.products.reduce(function (previousValue, currentValue) {
                            return {
                                "quantity": parseInt(previousValue.quantity) + parseInt(currentValue.quantity)
                            };
                        });
                    }
                    return quantity_obj.quantity;
                }
            },
            watch: {
                products: {
                    handler: function (n, o) {
                        localStorage.cart = JSON.stringify(n);
                        if (app2)
                            app2.products = n;
                    },
                    deep: true,
                }
            }
        });
})();
(function() {
    setTimeout(function(){ setParentsHeight(); }, 0);
})();
function setParentsHeight() {
    var elements = document.getElementsByClassName("h-parent");
    for(let i = 0; i<elements.length; i++) {
        elements[i].style.height = elements[i].parentElement.offsetHeight+'px';
    }
    
}
/*sticky-top event */
(function() {
    /* get the sticky element */
    window.observer = new IntersectionObserver(
        ([e]) => {
            e.target.classList.toggle('stuck', e.intersectionRatio < 1);
        },
        {
            threshold: [1]
        }
        );
})();
/* Multi handle slider starts */
(function() {
    multiHandleSlider();
})();
function multiHandleSlider() {
    var slides = document.getElementsByClassName("multi-handle-slider");
    if(!slides.length)
        return false;
    var handle1Clicked = false;
    var handle2Clicked = false;
    
    var slide = slides[0];
    
    for(let i=0; i<slides.length; i++) {
        slides[i].setAttribute("data-handle-1-position", updateHandle1(slides[i]));
        slides[i].setAttribute("data-handle-2-position", updateHandle2(slides[i]));
        slides[i].querySelector(".handle-1").addEventListener('mousedown', e => {
            slide = e.target.parentElement || e.srcElement.parentElement;
            handle1Clicked = true;
        });
        slides[i].querySelector(".handle-1").addEventListener('touchstart', e => {
            slide = e.target.parentElement || e.srcElement.parentElement;
            handle1Clicked = true;
        });
        slides[i].querySelector(".handle-2").addEventListener('mousedown', e => {
            slide = e.target.parentElement || e.srcElement.parentElement;
            handle2Clicked = true;
        });
        slides[i].querySelector(".handle-2").addEventListener('touchstart', e => {
            slide = e.target.parentElement || e.srcElement.parentElement;
            handle2Clicked = true;
        });
    }
    document.addEventListener('mousemove', event => {
        event = getMouseEvent(event);
        var left = slide.getBoundingClientRect().left;
        
        var position = event.pageX-left-10;
        if(handle1Clicked) {
            updateHandle1(slide, position);
        } else if(handle2Clicked) {
            updateHandle2(slide, position);
        }
    });
    document.addEventListener('touchmove', event => {
        event = getMouseEvent(event);
        var x = event.changedTouches[0].pageX;
        var left = slide.getBoundingClientRect().left;
        
        var position = x-left-10;
        if(handle1Clicked) {
            updateHandle1(slide, position);
        } else if(handle2Clicked) {
            updateHandle2(slide, position);
        }
    });
    document.addEventListener('mouseup', e => {
        let updated = slide.getAttribute("data-updated");
        if(updated && (handle1Clicked || handle2Clicked)) {
            window[updated]();
        }
        handle1Clicked = false;
        handle2Clicked = false;
    });
    document.addEventListener('touchend', e => {
        let updated = slide.getAttribute("data-updated");
        if(updated && (handle1Clicked || handle2Clicked)) {
            window[updated]();
        }
        handle1Clicked = false;
        handle2Clicked = false;
    });
}
function getMouseEvent(event) {
    var eventDoc, doc, body;
    event = event || window.event;
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;
        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
    }
    return event;
}
function updateHandle1(slide, position = null) {
    let width = slide.offsetWidth-20;
    let logarithm = slide.getAttribute("data-logarithm");
    let handle_1 = log(slide.getAttribute("data-handle-1"), logarithm);
    let handle1 = slide.querySelector(".handle-1");
    let highlight = slide.querySelector(".highlight");
    let min = log(slide.getAttribute("data-min"), logarithm);
    let max = log(slide.getAttribute("data-max"), logarithm);
    
    let onchange = slide.getAttribute("data-onchange");
    let handle2Position = slide.getAttribute("data-handle-2-position");
    let range = max-min;
    handle_1 = handle_1?handle_1:min;
    let unit = width/range;
    if(position == null) {
        position = (handle_1 - min) * unit;
    }
    position = position<0?0:position;
    let value = round(position/unit, logarithm);
    
    let handle1Position = position;
    let minimum = slide.querySelector(".minimum");
    handle1Position = handle1Position>width-handle2Position?width-handle2Position:handle1Position;
    handle1.style.transform = "translate("+handle1Position+"px, 0)";
    highlight.style.left = handle1Position+"px";
    highlight.style.width = width-handle1Position-handle2Position+2+"px";
    if(minimum) {
        minimum.value = Math.round(alog(handle1Position/unit+min, logarithm));
    }
    if(onchange)
        window[onchange](Math.round(alog(handle1Position/unit+min, logarithm)), Math.round(alog(range-handle2Position/unit+min, logarithm)));
    slide.setAttribute("data-handle-1-position", handle1Position);
    return handle1Position;
}
function updateHandle2(slide, position = null) {
    let width = slide.offsetWidth-20;
    let logarithm = slide.getAttribute("data-logarithm");
    let handle_2 = log(slide.getAttribute("data-handle-2"), logarithm);
    let handle2 = slide.querySelector(".handle-2");
    let highlight = slide.querySelector(".highlight");
    let min = log(slide.getAttribute("data-min"), logarithm);
    let max = log(slide.getAttribute("data-max"), logarithm);
    
    let onchange = slide.getAttribute("data-onchange");
    let handle1Position = slide.getAttribute("data-handle-1-position");
    let range = max-min;
    handle_2 = handle_2?handle_2:max;
    let unit = width/range;
    if(position == null)
        position = (handle_2 - min) * unit;
    position = position>width?width:position;
    let value = round((width-position)/unit, logarithm); /* value from reverse side */
    
    let handle2Position = value*unit;
    let maximum = slide.querySelector(".maximum");
    handle2Position = handle2Position>width-handle1Position?width-handle1Position:handle2Position;
    handle2.style.transform = "translate(-"+handle2Position+"px, 0)";
    highlight.style.width = width-handle1Position-handle2Position+2+"px";
    
    if(maximum)
        maximum.value = Math.round(alog(range-handle2Position/unit+min, logarithm));
    if(onchange)
        window[onchange](Math.round(alog(handle1Position/unit+min, logarithm)), Math.round(alog(range-handle2Position/unit+min, logarithm)));
    slide.setAttribute("data-handle-2-position", handle2Position);
    return handle2Position;
}
function round(value, logarithm = false) {
    value = parseFloat(value);
    if(logarithm)
        return value;
    return Math.round(value);
}
function log(value, logarithm = false) {
    value = parseFloat(value);
    if(logarithm) {
        value = value?value:1;
        return Math.log(value);
    }
    return value;
}
function alog(value, logarithm = false) {
    value = parseFloat(value);
    if(logarithm)
        return Math.pow(Math.E, value);
    return value;
}
/* Multi handle slider ends */
/*Number formatting */
function integerWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
function integerWithCommasIndian(x) {
    x=x.toString();
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
}
/*Fade out element */
(function() {
    fadeOut();
})();
function fadeOut() {
    var fades = document.getElementsByClassName('fade-out');
    if(fades.length>0)
        Array.prototype.forEach.call(fades, function(item) {
            item.style.opacity = '0';
            item.addEventListener('transitionend', () => { item.style.opacity = '1'; item.remove();});
        });
}
/*Togglable left menu */
(function() {
    leftMenu();
})();
function leftMenu() {
    var left_menu_toggle=document.getElementById("left-menu-toggle");
    var left_menu=document.getElementById("left-menu");
    if(left_menu_toggle && left_menu)
        left_menu_toggle.addEventListener("click", function() {
            left_menu.classList.toggle("left-menu-collapse");
        });
}