

function callGTM(eventName, para_1) {
    if ($('#hdnGTM').val() != "" && eventName == 'view_item') {
        gtm_data = view_item_data(eventName);
        if (gtm_data != null)
            gtm_viewitem(gtm_data);
    }
    else if ($('#hdnGTM').val() != "" && eventName == 'add_to_cart') {
        gtm_data = savecart_data(eventName, para_1);
        if (gtm_data != null)
            gtm_add_to_cart(eventName, gtm_data);
    }
    else if ($('#hdnGTM').val() != "" && eventName == 'add_payment_info') {
        gtm_data = para_1;
        if (gtm_data != null)
            gtm_add_payment_info(eventName, gtm_data);
    }
    else if ($('#hdnGTM').val() != "" && eventName == 'purchase') {
        gtm_data = GetBookingData(para_1);
        if (gtm_data != null)
            gtm_purchase(eventName, gtm_data);
    }
    else if ($('#hdnGTM').val() != "" && eventName == 'refund') {
        gtm_data = refund_data(eventName, para_1);
        if (gtm_data != null)
            gtm_refund(eventName, gtm_data);
    }
}

function GetBookingData(RefNo) {
    var GTMData = [];
    $.ajax({
        url: "/AjaxCall.aspx/GetBookingDataFromRefNo",
        data: '{ReferenceNo:"' + RefNo + '"}',
        datatype: "json",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
        },
        success: function (data) {
            debugger
            var res = data.d;
            GTMData.push({
                transaction_id: res[0].transaction_id,
                value: $('#hdngrandtotal').val(),
                item_id: res[0].item_id,
                item_name: res[0].item_name,
                quantity: res[0].quantity,
                tour_option: res[0].tour_option,
                transfer_option: res[0].transfer_option,
                travel_date: res[0].travel_date,
                coupon: '',
                discount: res[0].discount,
                item_category: res[0].item_category,
                Rpoints: res[0].Rpoints,
                currency: 'AED',
                price: res[0].price,
                cardtype: 'credit card',
                country: res[0].country,
                city: res[0].city,
                service: res[0].service,
                room_type: 0,
                no_of_nights: 0,
                visa_type: 0
            });
        },
        error: function (XMLHttpRequest, callStatus, errorThrown) {
            alert(XMLHttpRequest.responseText);
            alert(XMLHttpRequest.status);
            alert(errorThrown);
        },
        complete: function () {
        }
    });
    return GTMData;

}

function gtm_refund(eventName, gtm_data) {
    debugger
    var data = gtm_data.data[0];
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
        event: eventName,
        ecommerce: {
            currency: "AED",
            value: gtm_data.data[0].price,
            items: [
                {
                    transaction_id: data.transaction_id,
                    item_id: data.item_id,
                    item_name: data.item_name,
                    item_category: data.item_category,
                    currency: data.currency,
                    price: data.price,
                    country: data.country,
                    city: data.city,
                    cardtype: data.cardtype,
                    travel_date: data.travel_date,
                    visa_type: data.visa_type
                }
            ]
        }
    });
}

function gtm_viewitem(gtm_data) {
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    dataLayer.push({
        event: gtm_data.eventName,
        ecommerce: {
            currency: "AED",
            value: gtm_data.price - gtm_data.discount,
            items: [
                {
                    item_id: gtm_data.item_id,
                    item_name: gtm_data.item_name,
                    coupon: gtm_data.coupon,
                    discount: gtm_data.discount,
                    Rpoint: gtm_data.rpoints,
                    item_category: gtm_data.item_category,
                    country: gtm_data.country,
                    city: gtm_data.city,
                    service: gtm_data.service,
                    price: gtm_data.price,
                }
            ]
        }
    });
}

function gtm_add_to_cart(eventName, gtm_data) {
    var data = gtm_data.data;
    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    //debugger;
    var items = [];
    var totalAmount = 0;
    data.forEach(element => {
        items.push({
            item_id: element.item_id,
            item_name: element.item_name,
            quantity: element.quantity,
            tour_option: element.tour_option,
            transfer_option: element.transfer_option,
            travel_date: element.travel_date,
            coupon: '',
            discount: element.discount,
            item_category: '',
            Rpoints: element.Rpoints,
            currency: 'AED',
            price: element.price,
            country: '',
            city: '',
            service: 'tour',
            room_type: 0,
            no_of_nights: 0,
            visa_type: 0,
        });
        totalAmount = parseFloat(totalAmount) + parseFloat(element.price);
    });

    dataLayer.push({
        event: eventName,
        ecommerce: {
            currency: "AED",
            value: totalAmount,
            items: items
        }
    });
}

function gtm_add_payment_info(eventName, gtm_data) {
    var data = gtm_data[0];
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
        event: eventName,
        ecommerce: {
            currency: "AED",
            value: gtm_data[0].price,
            items: [
                {
                    item_id: data.item_id,
                    item_name: data.item_name,
                    quantity: data.quantity,
                    tour_option: data.tour_option,
                    transfer_option: data.transfer_option,
                    travel_date: data.travel_date,
                    coupon: '',
                    discount: data.discount,
                    item_category: "",
                    Rpoints: data.Rpoints,
                    currency: data.currency,
                    price: data.price,
                    country: "",
                    city: "",
                    cardtype: 'credit card',
                    service: data.service,
                    room_type: data.room_type,
                    no_of_nights: data.no_of_nights,
                    visa_type: data.visa_type
                }
            ]
        }
    });
}

function gtm_purchase(eventName, gtm_data) {
    debugger
    var data = gtm_data[0];
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
        event: eventName,
        ecommerce: {
            currency: "AED",
            value: gtm_data[0].value,
            items: [
                {
                    transaction_id: data.transaction_id,
                    item_id: data.item_id,
                    item_name: data.item_name,
                    quantity: data.quantity,
                    tour_option: data.tour_option,
                    transfer_option: data.transfer_option,
                    travel_date: data.travel_date,
                    coupon: data.coupon,
                    discount: data.discount,
                    item_category: data.item_category,
                    Rpoints: data.Rpoints,
                    currency: data.currency,
                    price: data.price / data.quantity,
                    country: data.country,
                    city: data.city,
                    cardtype: data.cardtype,
                    service: data.service,
                    room_type: data.room_type,
                    no_of_nights: data.no_of_nights,
                    visa_type: data.visa_type
                }
            ]
        }
    });
}

function view_item_data(eventName) {
    var gtm_data = {
        eventName: eventName,
        price: $('#hdnPrice').val(),
        item_id: $('#hdnTourId').val(),
        item_name: $('#hdnTourName').val(),
        coupon: '',
        discount: $('#hdnDiscount').val(),
        rpoints: $('#hdnRewardPoints').val(),
        item_category: $('#hdnTourType').val(),
        country: $('#hdnCountry').val(),
        city: $('#hdnCity').val(),
        service: 'tour'
    }
    return gtm_data;
}

function savecart_data(eventName, para) {
    //debugger;
    var gtm_data = {
        eventName: eventName,
        price: 0,
        data: []
    }
    $.each(para, function (i, data) {
        //gtm_data.data.push({
        //    item_id: data.tourId,
        //    item_name: $('#hdnTourName').val(),
        //    quantity: data.selectedAdults + data.selectedChild,
        //    tour_option: data.optionName,
        //    transfer_option: data.selectedTransfer.transferName,
        //    travel_date: data.selectedDate,
        //    coupon: '',
        //    discount: data.withoutDiscountAmount - data.finalAmount,
        //    item_category: $('#hdnTourType').val(),
        //    Rpoints: data.rewardPoints,
        //    currency: 'AED',
        //    price: data.finalAmount,
        //    country: $('#hdnCountry').val(),
        //    city: $('#hdnCity').val(),
        //    service: 'tour',
        //    room_type: 0,
        //    no_of_nights: 0,
        //    visa_type: 0,
        //});
        gtm_data.data.push({
            item_id: data.item_id,
            item_name: data.item_name,
            quantity: data.quantity,
            tour_option: data.tour_option,
            transfer_option: data.transfer_option,
            travel_date: data.travel_date,
            coupon: '',
            discount: data.discount,
            item_category: '',
            Rpoints: data.Rpoints,
            currency: 'AED',
            price: data.price,
            country: '',
            city: '',
            service: 'tour',
            room_type: 0,
            no_of_nights: 0,
            visa_type: 0,
        });
    })
    return gtm_data;
}

function refund_data(eventName, para) {
    debugger
    var gtm_data = {
        eventName: eventName,
        price: 0,
        data: []
    }
    $.each(para, function (i, data) {
        gtm_data.data.push({
            transaction_id: data.referenceNo,
            item_id: data.serviceId,
            item_name: data.serviceName,
            item_category: "",
            currency: 'AED',
            price: data.totalAmount,
            country: data.country,
            city: data.city,
            cardtype: 'credit card',
            travel_date: data.checkInDate,
            visa_type: 0,
        });
    })
    return gtm_data;
}

function callAdmitAd(eventName, refno) {
    $.ajax({
        url: "/AjaxCall.aspx/GetBookingDataFromRefNo",
        data: '{ReferenceNo:"' + RefNo + '"}',
        datatype: "json",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
        },
        success: function (data) {
            debugger
            var res = data.d;
        },
        error: function (XMLHttpRequest, callStatus, errorThrown) {
            alert(XMLHttpRequest.responseText);
            alert(XMLHttpRequest.status);
            alert(errorThrown);
        },
        complete: function () {
        }
    });
}
//Cookie lifetime (days)
//$(document).ready(function () {
//    var days_to_store = 90;
//    debugger;
//    //Parameters for creating a cookie containing the Admitad UID value
//    var uid_cookie_name = 'uid-' + $('#hdnwebsiteId').val(); // Name of cookie storing admitad_uid
//    var uid_channel_name = 'uid'; // function for receiving a source from the GET parameter

//    function getParamFromUriAdmitad(get_param_name) {
//        var pattern = get_param_name + '=([^&]+)';
//        var re = new RegExp(pattern);
//        return (re.exec(document.location.search) || [])[1] || '';
//    };

//    // function for writing the source to the cookie named cookie_name
//    function setAdmitadCookie(param_name, cookie_name) {
//        var param = getParamFromUriAdmitad(param_name);
//        if (!param) { return; }
//        var period = days_to_store * 60 * 60 * 24 * 1000;   // in seconds
//        var expiresDate = new Date((period) + +new Date);
//        var cookieString = cookie_name + '=' + param + '; path=/; expires=' + expiresDate.toGMTString();
//        document.cookie = cookieString;
//        document.cookie = cookieString + '; domain=.' + location.host;
//    };

//    // writing value to cookie
//    setAdmitadCookie(uid_channel_name, uid_cookie_name);
//});
