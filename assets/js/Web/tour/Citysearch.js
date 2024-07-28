RaynaApp.controller("TourSearchController", ['$scope', '$http', '$rootScope', '$timeout', function ($scope, $http, $rootScope, $timeout) {
    $scope.UPlstTourId = [];
    $scope.UPlstCountryCity = [];
    $scope.Destination = "";
    $scope.SelectedPercentage = 0;
    $('.instructions-popup').removeClass('hide');
    Get_CookiePupUp();
    $scope.Destination = "Select Location";

    $scope.GetTourTariffWise = function () {
        if ($scope.UPlstCountryCity.length == 0) {
            $.ajax({
                type: 'POST',
                data: "{Flag:2}",
                contentType: 'application/json; charset=utf-8',
                url: '/AjaxCall_Dashboard.aspx/GetCountryCityTariffWise',
                async: true,
                beforeSend: function () {
                    $('#cityloader').removeClass('hide');
                },
                success: function (data) {
                    var arr = data.d[0];
                    if (arr.length > 0) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                    $scope.UPlstCountryCity = arr;
                                    $('#cityloader').addClass('hide');
                            });
                        });

                    }
                },
                error: function () { },
                complete: function () {
                    $('#cityloader').addClass('hide');
                }
            });

        }

    }

    //$scope.GetTourTariffWise();

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


    $scope.$watch('CurrencyFactor', function () {

        $('.prices').each(function () {
            var basePrice = parseFloat($(this).attr('data-baseprice'));
            var amount = basePrice + (basePrice * $scope.SelectedPercentage / 100);
            $(this).text(parseFloat(amount / $rootScope.CurrencyFactor).toFixed(2));
        });
        $('.currencysymbol').each(function () {
            $(this).html($rootScope.CurrencySymbol);
        });
        //$scope.loadbannerrates();
    });


    function successTourRates(data) {

        $.each(data, function (i, data) {

            //$('.currencysymbol').each(function () {
            //    $(this).html($rootScope.CurrencySymbol);
            //});

            //var amount = parseFloat(data.amount).toFixed(2);
            var totalamount = parseFloat(data.amount / $rootScope.CurrencyFactor).toFixed(2);
            var amount = parseFloat(data.amount / $rootScope.CurrencyFactor).toFixed(2);
            var discount = parseFloat(data.discount / $rootScope.CurrencyFactor).toFixed(2);
            amount = parseFloat(amount - discount).toFixed(2);
            //var amount = parseFloat(data.amount) + (data.amount * $scope.SelectedPercentage.id / 100);
            //var discount = parseFloat(data.discount) + (data.discount * $scope.SelectedPercentage.id / 100);
            //var amount_a = parseFloat(amount / $rootScope.CurrencyFactor).toFixed(2);
            //var amount_b = parseFloat((amount - discount) / $rootScope.CurrencyFactor).toFixed(2);
            //var amount_c = parseFloat(data.amount).toFixed(2);
            //var amount_d = parseFloat(data.amount - data.discount).toFixed(2);

            // $("#Bannertour-" + data.tourId).text(amount);
            // $('#Bannertour-' + data.tourId).removeClass('hide');
            $('#Bannertour-' + data.tourId + ' .price-set').text(amount);
            $('#Bannertour-' + data.tourId + ' .price-set').attr('data-baseprice', amount);

            if (data.discount == 0) {
                $('#Bannertour-' + data.tourId + ' .text-strike-price').addClass("priceline font-12 hide");
                $('#Bannertour-' + data.tourId + ' .save-price2').addClass("hide");
            }
            else {
                $('#Bannertour-' + data.tourId + ' .text-strike-price').removeClass("priceline font-12");
                $('#Bannertour-' + data.tourId + ' .text-strike-price').removeClass("hide");
                $('#Bannertour-' + data.tourId + ' .text-strike-price').addClass("priceline font-12");
                $('#Bannertour-' + data.tourId + ' .save-price2').removeClass("hide");
                $('#Bannertour-' + data.tourId + ' .price-save').text(parseFloat(totalamount / $rootScope.CurrencyFactor).toFixed(2));
                $('#Bannertour-' + data.tourId + ' .price-save').attr("data-baseprice", totalamount);
            }
            $('#Bannertour-' + data.tourId + ' .origionalprice').removeClass('hide');
        });
        $('.loadingPattern').addClass('hide');

    }
    $scope.loadbannerrates = function () {
        //var tourIds = "38,39,177,41262,41485";
        var tourIds = $('#hdnTourIds').val() == undefined ? "" : $('#hdnTourIds').val();
        if (tourIds != "") {
            //var tourIds = $('#hdnTourIds').val();
            //var tourIds = "33,37,38,39";

            tourIds = tourIds.replace(/,\s*$/, "");
            //$scope.arrTourIds = tourIds.split(',');   

            $rootScope.callAjax('/AjaxCall.aspx/GetDynamicTourListRates', '{tourIds:"' + tourIds + '",countryId:"' + 0 + '",cityId:"' + 0 + '"}', successTourRates);
        }
    }
   // $scope.loadbannerrates();
    $(".skipintro").click(function () {
        $(".instructions-popup").addClass("hide");
    });

}]);


$("#txtCityNameTour").click(function (event) {
    event.stopPropagation();
    $("#searchcontant").css("display", "block"), tjq(".preloading").unveil();
});

$("#txtCityNameTour").keypress(function () {
    $("#searchcontant").css("display", "none");
});

$(document).click(function () {
    $("#searchcontant").css("display", "none")
});

$(document).ready(function () {

    $(".preloading").unveil();
    $("#dcpopupgotit").on('click', function (e) {
        Set_CookiePupUp(true);
        $(".instructions-popup").addClass("hide");
    });
});

function Get_CookiePupUp() {

    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = !1;
    for (i = 0; i < a_all_cookies.length; i++) {
        a_temp_cookie = a_all_cookies[i].split('=');
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

        if (cookie_name == 'loadpopup') {
            b_cookie_found = !0;
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                cookie_value == "true" ? $('.instructions-popup').addClass('hide') : $('.instructions-popup').removeClass('hide');
            }
        }
        a_temp_cookie = null;
        cookie_name = ''
    }
    if (!b_cookie_found) { }
}

function Set_CookiePupUp(GotitValue) {

    var name = new Array();
    var value = new Array();
    var expires = 20;
    var path = "/";
    var domain = "";
    var secure = "";
    if (GotitValue) {
        name[0] = 'loadpopup';
        value[0] = GotitValue;

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
        name[0] = 'loadpopup';
        value[0] = '';
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

