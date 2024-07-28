RaynaApp.controller("StickyFooterController", function ($scope, $http, $rootScope, $location, $window) {
    //=======Cities=======//
    $rootScope.ShowStickyicon = 0;
    $scope.CityId = $rootScope.StickyCityId == undefined ? 0 : $rootScope.StickyCityId;
    $rootScope.ShowStickyicon = $scope.CityId == 0 ? 0 : 1;
    $scope.staticFilePath = "";
    //$scope.TourIds = [];
    $scope.TourSearchlist = function () {
        var h = '{"staticFilePath":"' + $scope.staticFilePath + '" ,"folderName":"' + 'MobStickyFooter' + '","CountryId":"' + 0 + '" ,"CityId":"' + 0 + '"}'

        $http({
            url: "/AjaxCall.aspx/LoadAllTourListApi",
            method: "POST",
            data: h
        }).then(function successCallback(response) {
            var e = response.data.d;
            $scope.AllTourListDetails = e;
            $scope.TourIds = [];
            $scope.TourIds = $scope.AllTourListDetails[0];
            $scope.loadCities($scope.TourIds);
            if ($scope.CityId != 0) {
                $scope.loadCategory($scope.TourIds);
            }

        }, function errorCallback(response) {
            $scope.error = response.statusText;

        });
    }
    //debugger;
    if ($("#hdnShowCities").val().toLowerCase() == "true") {
        $scope.TourSearchlist();
    }

    $scope.loadCities = function () {
        $scope.Citylist = [];
        $.ajax({
            type: 'POST',
            data: "{Flag:2}",
            contentType: 'application/json; charset=utf-8',
            url: '/AjaxCall_Dashboard.aspx/GetCountryCityTariffWise',
            async: true,
            beforeSend: function () {
            },
            success: function (data) {
                var arr = data.d[0];
                if (arr.length > 0) {
                    $scope.$apply(function () {
                        $scope.Citylist = arr;
                    });
                }
            },
            error: function () { },
            complete: function () {

            }
        });



    }

    $scope.SetCityDetail = function (cityname, countryname, CityId, CountryId) {
        $scope.Destination = cityname + ", " + countryname;
        $("#searchcontant").css("display", "none");
        /* window.location.href = "/CategoryWiseTours.aspx?CountryId="+ 13063 + '&CityId='+13688*/
        /*  window.location.href = "CityTours/" + countryname.replace(/\s/g, '-') + "/" + cityname.replace(/\s/g, '-');*/
        var t = {
            cityId: CityId,
            countryId: CountryId,
            travelDate: $scope.getnewdate(),
            markupPercentage: 0
        };
        $http({
            url: "/AjaxCall.aspx/TourSearchUrl",
            method: "POST",
            data: JSON.stringify({ m: t })
        }).then(function successCallback(response) {
            var e = response.data;
            window.location.href = e.d;
        }, function errorCallback(response) {
            $scope.error = response.statusText;
        });
    }

    $scope.getnewdate = function () {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return formattedToday = dd + '/' + mm + '/' + yyyy;
    }

    $scope.loadCities_old = function (TourIds) {
        $scope.Citylist = [];
        var s = {
            data: TourIds
        }
        var postdata = JSON.stringify(s);
        $http({
            url: "/AjaxCall.aspx/GetDynamicCities",
            method: "POST",
            data: postdata
        }).then(function successCallback(response) {
            var e = response.data.d;
            $scope.Citylist = e;
        }, function errorCallback(response) {
            $scope.error = response.statusText;
        });
    }



    //=======Category=======//
    $scope.loadCategory = function (TourIds) {

        $scope.CityCategory = [];
        var s = {
            cityId: $scope.CityId,
            data: TourIds
        }
        var postdata = JSON.stringify(s);
        $http({
            url: "/AjaxCall.aspx/GetDynamicCategory",
            method: "POST",
            data: postdata
        }).then(function successCallback(response) {
            var e = response.data.d;
            $scope.CityCategory = e;
        }, function errorCallback(response) {
            $scope.error = response.statusText;
        });
    }


    $scope.CityListUrl = function (ListUrl) {
        $('#CitieIconmodal').modal('toggle');
        $window.location.href = ListUrl;
    }
});



function Getdynamichideshow(hide, show) {
    if (show == "#divlogin1") {
        //loadJSfile("https://d1vqfl8cu8qgdj.cloudfront.net/assets/js/JsB2cloginnew.js?V1");
        loadJSfile("font-face/js/MobileViewB2C/JsB2cloginnew.js?V1");
    }
    if (show == "#inquirydiv") {
        // loadJSfile("https://d1vqfl8cu8qgdj.cloudfront.net/assets/m-assets/js/B2CMobileView/JSMobEnquiry.js");
        loadJSfile("font-face/js/MobileViewB2C/JSMobEnquiryNew.js");
    }
    $(show).removeClass("hide");
    $(hide).addClass("hide");

    if ($("#homepagesection").hasClass("hide")) $("#homepagesection").removeClass("hide");
    else $("#homepagesection").addClass("hide");
    if ($("#showhidedivm").hasClass("hide")) $("#showhidedivm").removeClass("hide");
    else $("#showhidedivm").addClass("hide");

    $(".mobile-side-menu ").removeClass("addmenudiv");
    $(".overlaydiv").removeClass("overlaymenu");

}

function loadJSfile(e) {
    for (var r = !0, a = document.getElementsByTagName("script"), o = e.replace(/^.*[\\\/]/, ""), l = a.length; l--;) {
        a[l].src.replace(/^.*[\\\/]/, "") == o && (r = !1);
    }
    if (r) {
        var i = document.createElement("script");
        (i.type = "application/javascript"), (i.src = e), document.body.appendChild(i), changeTraveloElementUI();
    }
}

function GuestUserBookingList() {
    var guestUserId = $("#hdnGuestUserId").val() == "" ? 0 : parseInt($("#hdnGuestUserId").val());
    if (guestUserId > 0) {
        var json = { guestUserId: guestUserId };
        var arr = [];
        $.ajax({
            url: "/AjaxCall.aspx/GetUserProfileDetail",
            datatype: "json",
            type: "POST",
            cache: !0,
            contentType: "application/json; charset=utf-8",
            beforeSend: function () { },
            success: function (data) {
                if (data != null || data.d != "") {
                    $("#dynamicData").removeClass("hide");
                    $("#bookingFilters").removeClass("hide");
                    var dbData = data.d[0].lstUserBookingHistory;
                    var headerHtm = "<div class='row p0 currencymobile'>" + "<div class='container p0' style='padding-top: 60px !important;'>";
                    var dataHtml = "";
                    $.each(dbData, function (i, d) {
                        var myClass =
                            d.BookingStatus.indexOf("Cancelled") != -1
                                ? "col_Red text-bold"
                                : d.BookingStatus.indexOf("On Request") != -1
                                    ? "onrequest_color text-bold"
                                    : d.BookingStatus.indexOf("Vouchered") != -1
                                        ? "col_purple text-bold"
                                        : d.BookingStatus.indexOf("Confirmed") != -1
                                            ? "col_Green text-bold"
                                            : d.BookingStatus.indexOf("Process") != -1
                                                ? "applicationinProcess text-bold"
                                                : "completed_color text-bold";
                        var iconClases = d.ServiceName == "Tour" ? "tourcicon" : d.ServiceName == "Visa" ? "visa_icon " : d.ServiceName == "Hotel" ? "hotelicon" : "none";
                        dataHtml +=
                            "<div class='row m0 myServices ' data-ServiceName='" +
                            d.ServiceName.toLowerCase() +
                            "' onclick='gotoTravelCartPage(\"" +
                            d.ReferenceNo +
                            "\");'>" +
                            "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 pb15 border-b'>" +
                            "<div class='icon-wd'>" +
                            " <span class='icon-strip " +
                            iconClases +
                            " '></span>" +
                            "</div>" +
                            "<div class='ml30'>" +
                            "<div class='font-15 font-b text-black'><span>" +
                            d.ProductName +
                            "</span></div>" +
                            "<div class='col-md-7 col-sm-7 col-xs-7 p0'>" +
                            "<div class='font-12'>" +
                            "<div class=''>Reference No</div>" +
                            " <div class=''>" +
                            d.ReferenceNo +
                            "</div>" +
                            "</div>" +
                            " </div>" +
                            "<div class='col-md-5 col-sm-5 col-xs-5 p0 mt10 text-trans'>" +
                            "<label class='pull-right " +
                            myClass +
                            "'>" +
                            d.BookingStatus +
                            "</label>" +
                            "<div class='col-md-6 col-sm-6 col-xs-6'>" +
                            "</div></div></div></div></div>";
                    });
                    document.getElementById("dynamicData").innerHTML = "";
                    document.getElementById("dynamicData").innerHTML = headerHtm + dataHtml + "</div></div>";
                    $("#bookingFilters").removeClass("hide");
                    $("#filterPanel").addClass("hide");
                    $("#filterHeaderTop").addClass("hide");
                    $("#mytripsHeaderTop").removeClass("hide");
                    $("#collapseOne").removeClass("in");
                } else {
                    $("#dynamicData").removeClass("hide");
                    $("#bookingFilters").addClass("hide");
                }
            },
            error: function (XMLHttpRequest, callStatus, errorThrown) {
                alert(XMLHttpRequest.responseText);
                alert(XMLHttpRequest.status);
                alert(errorThrown);
            },
            complete: function () { },
        });
    }
}

function GetTravelCartData() {
    var e = { EmailId: $("#bookingemailid").val(), RefNo: $("#referenceno").val() };
    $.ajax({
        url: "/AjaxCall.aspx/GetBookingUrlAPI",
        data: JSON.stringify(e),
        datatype: "json",
        type: "POST",
        async: !1,
        cache: !0,
        contentType: "application/json; charset=utf-8",
        success: function (e) {
            return "1" == e.d ? ShowMyModel("Sorry! your email address or booking reference number is invalid.") : (window.location.href = "/" + e.d), !0;
        },
        error: function (e, t, n) { },
    });
}


function usersingup(hide, show) {
    $(hide).addClass("hide");
    $(show).removeClass("hide");
}

function LoadUserControl(e, t) {
    var n = AjaxCallPost("/AjaxCall.aspx/LoadUserControl", "{ControlName:'" + e + "'}");
    $("#" + t).html(n.d);
    $("html, body").animate({ scrollTop: "0px" }, 0);
}

function EnableDisableSetting() {
    $("#homepagesection").removeClass("hide");
    $("#showhidedivm").removeClass("hide");
    $("#maincurrencylist1").addClass("hide");
    tjq(".preloading").unveil();
    return !1;
}

function applyFilter() {
    tourStatusArray = [];
    visaStatusArray = [];
    holidayStatusArray = [];
    $("#collapseOne input").each(function () {
        if ($(this).prop("checked") == !0) {
            tourStatusArray.push($(this).attr("data-text"));
        }
    });
    if (tourStatusArray.length > 0) {
        filterServices("tour", !1, tourStatusArray);
    } else {
        filterServices("tour", !0, tourStatusArray);
    }
    $("#collapseTwo input").each(function () {
        if ($(this).prop("checked") == !0) {
            visaStatusArray.push($(this).attr("data-text"));
        }
    });
    if (visaStatusArray.length > 0) {
        filterServices("visa", !1, visaStatusArray);
    } else {
        filterServices("visa", !0, visaStatusArray);
    }
    if (tourStatusArray.length <= 0 && visaStatusArray.length <= 0) {
        $("#dynamicData .myServices").each(function () {
            $(this).removeClass("hide");
        });
    }
    $("#filterPanel").addClass("hide");
    $("#dynamicData").removeClass("hide");
    $("#filterHeaderTop").addClass("hide");
    $("#mytripsHeaderTop").removeClass("hide");
}

function showFilterPanel() {
    $("#filterPanel").removeClass("hide");
    $("#dynamicData").addClass("hide");
    $("#bookingFilters").addClass("hide");
    $("#mytripsHeaderTop").addClass("hide");
    $("#filterHeaderTop").removeClass("hide");
}

function resetAllFilters() {
    $("#filterPanel").addClass("hide");
    $("#dynamicData").removeClass("hide");
    $("#collapseOne").removeClass("in");
    $("#collapseTwo").removeClass("in");
    $("#collapseThree").removeClass("in");
    $("#bookingFilters").removeClass("hide");
    $("#filterHeaderTop").addClass("hide");
    $("#mytripsHeaderTop").removeClass("hide");
    $("#dynamicData .myServices").each(function () {
        $(this).removeClass("hide");
    });
    $(".panel-body div").each(function () {
        $(this).removeClass("checked");
    });

}
//=================Footer Menu=================//

function ActiveDeactive(a) {
    if (a == 0) {
        $("#Home").addClass("active");
        $("#Bookings").removeClass("active");
        $("#Cart").removeClass("active");
        $("#Notification").removeClass("active");
        $("#Profile").removeClass("active");
        $("#Profileb2c").removeClass("active");
        $("#Profilelogin").removeClass("active");
        $("#Categories").removeClass("active");
        $("#Cities").removeClass("active");
    }
    else if (a == 1) {
        $("#Bookings").addClass("active");
        $("#Home").removeClass("active");
        $("#Cart").removeClass("active");
        $("#Notification").removeClass("active");
        $("#Profile").removeClass("active");
        $("#Profileb2c").removeClass("active");
        $("#Profilelogin").removeClass("active");
        $("#Categories").removeClass("active");
        $("#Cities").removeClass("active");
    }
    else if (a == 2) {

        $("#Cart").addClass("active");
        $("#Home").removeClass("active");
        $("#Bookings").removeClass("active");
        $("#Notification").removeClass("active");
        $("#Profile").removeClass("active");
        $("#Profileb2c").removeClass("active");
        $("#Profilelogin").removeClass("active");
        $("#Categories").removeClass("active");
        $("#Cities").removeClass("active");
    }
    else if (a == 3) {

        $("#Notification").addClass("active");
        $("#Home").removeClass("active");
        $("#Bookings").removeClass("active");
        $("#Cart").removeClass("active");
        $("#Profile").removeClass("active");
        $("#Profileb2c").removeClass("active");
        $("#Profilelogin").removeClass("active");
        $("#Categories").removeClass("active");
        $("#Cities").removeClass("active");
    }
    else if (a == 4) {

        $("#Profile").addClass("active");
        $("#Profileb2c").addClass("active");
        $("#Profilelogin").addClass("active");
        $("#Home").removeClass("active");
        $("#Bookings").removeClass("active");
        $("#Cart").removeClass("active");
        $("#Notification").removeClass("active");
        $("#Categories").removeClass("active");
        $("#Cities").removeClass("active");
    }
    else if (a == 5) {
        $("#Categories").addClass("active");
        $("#Profile").removeClass("active");
        $("#Profileb2c").removeClass("active");
        $("#Profilelogin").removeClass("active");
        $("#Home").removeClass("active");
        $("#Bookings").removeClass("active");
        $("#Cart").removeClass("active");
        $("#Notification").removeClass("active");
        $("#Cities").removeClass("active");
    }
    else if (a == 6) {
        $("#Cities").addClass("active");
        $("#Profile").removeClass("active");
        $("#Profileb2c").removeClass("active");
        $("#Profilelogin").removeClass("active");
        $("#Home").removeClass("active");
        $("#Bookings").removeClass("active");
        $("#Cart").removeClass("active");
        $("#Notification").removeClass("active");
        $("#Categories").removeClass("active");
    }

}

//=================B2C Profile=================//
$("#btnLoginGuest").click(function (t) {
    if ($("#txtGuestUsername").val() == "" || $("#txtGuestUserPassword").val() == "") {
        if ($("#txtGuestUsername").val() == "")
            $("#txtGuestUsername").addClass("validate");
        if ($("#txtGuestUserPassword").val() == "")
            $("#txtGuestUserPassword").addClass("validate");
        return false;
    }
    else {
        $("#txtGuestUsername").removeClass("validate");
        $("#txtGuestUserPassword").removeClass("validate");
    }
    return login($("#txtGuestUsername").val(), $("#txtGuestUserPassword").val(), $("#chkRememberMeGuest").prop("checked"), t),
        !1;
});


function login(e, s, a) {
    Set_Cookie(e, s, a);
    var r = {
        UserName: e,
        Password: s,
        RememberMe: a,
    };
    JSON.stringify(r);
    $.ajax({
        url: "/AjaxCall.aspx/GuestUserSignIn",
        data: JSON.stringify({ userRegistration: r }),
        datatype: "json",
        type: "POST",
        async: 1,
        cache: !0,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () { $("#LoginLoader").removeClass("hide"); },
        success: function (data) {
            if (data.d != null) {
                if (parseInt(data.d.status) == 0) {
                    $("#validatemessagesignin").text(data.d.message);
                    return;
                }
                if (parseInt(data.d.status) > 0) {
                    setCookie_login("guestuserid", data.d.status, 365);
                    setCookie_login("email", data.d.email, 365);
                    //var str1 = window.location.pathname;
                    //var str2 = "profile";
                    //if (str1.indexOf(str2) != -1) {
                    //window.location.href = "/B2CLogin/MyBookings";
                    window.location.href = "/profilepage.aspx";
                    //}
                    //else {
                    //    window.location.href = str1;
                    //}
                }
            }
        },
        error: function (t) { },
        complete: function () { },
    });
}
function Set_Cookie(username, password, rememberme) {
    var name = new Array();
    var value = new Array();
    var expires = 20;
    var path = "/";
    var domain = "";
    var secure = "";
    if (rememberme) {
        name[0] = 'loginusername';
        name[1] = 'loginuserpassword';
        name[2] = 'checkboxstate';
        value[0] = username;
        value[1] = password;
        value[2] = rememberme;
        var today = new Date();
        today.setTime(today.getTime());
        if (expires) {
            expires = expires * 1000 * 60 * 60 * 24
        }
        var expires_date = new Date(today.getTime() + (expires));
        for (i = 0; i < name.length; i++) {
            document.cookie = name[i] + "=" + escape(value[i]) + ((expires) ? ";expires=" + expires_date.toGMTString() : "") + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ((secure) ? ";secure" : "")
        }
    } else {
        name[0] = 'loginusername';
        name[1] = 'loginuserpassword';
        name[2] = 'checkboxstate';
        value[0] = '';
        value[1] = '';
        value[2] = '';
        var today = new Date();
        today.setTime(today.getTime());
        if (expires) {
            expires = expires * 1000 * 60 * 60 * 24
        }
        var expires_date = new Date(today.getTime() + (expires));
        for (i = 0; i < name.length; i++) {
            document.cookie = name[i] + "=" + escape(value[i]) + ((expires) ? ";expires=" + expires_date.toGMTString() : "") + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ((secure) ? ";secure" : "")
        }
    }
}
$("#txtPassword").keypress(function (t) {
    var e = t.which;
    13 == e && $("#btnLoginGuest").click()
});
$("#txtUsername").keypress(function (t) {
    var e = t.which;
    13 == e && $("#btnLoginGuest").click()
});
function Get_Cookie() {
    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = !1;
    for (i = 0; i < a_all_cookies.length; i++) {
        a_temp_cookie = a_all_cookies[i].split('=');
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
        if (cookie_name == 'loginusername') {
            b_cookie_found = !0;
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                if (document.getElementById('txtGuestUsername') != null)
                    document.getElementById('txtGuestUsername').value = cookie_value;
            }
        }
        if (cookie_name == 'loginuserpassword') {
            b_cookie_found = !0;
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                if (document.getElementById('txtGuestUserPassword') != null)
                    document.getElementById('txtGuestUserPassword').value = cookie_value;
            }
        }
        if (cookie_name == 'checkboxstate') {
            b_cookie_found = !0;
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                if (cookie_value == 'false' || cookie_value == '') {
                    if (document.getElementById('chkRememberMeGuest') != null) {
                        document.getElementById('chkRememberMeGuest').checked = !1;
                        $("#lblChkRememberMe").removeClass("checked")
                    }
                } else {
                    if (document.getElementById('chkRememberMeGuest') != null) {
                        document.getElementById('chkRememberMeGuest').checked = !0;
                        $("#lblChkRememberMe").addClass("checked")
                    }
                }
            }
        }
        a_temp_cookie = null;
        cookie_name = ''
    }
    if (!b_cookie_found) { }
}
function setCookie_login(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}