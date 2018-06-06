﻿angular.module('time').controller('RegisterCtrl', function ($scope, $http, $routeParams, $location, usSpinnerService) {
    $scope.loaded = false;

    $scope.load = function () {
        $scope.user = {};
        $scope.user.firstName = '';
        $scope.user.lastName = '';
        $scope.user.password = '';
        $scope.user.type = 'S';
        $scope.password = '';
        $scope.repeatPassword = '';

        $scope.register = function () {
            if ($scope.user.username === '') {
                toastr['error']("Please enter a Username");
                return;
            } else if ($scope.user.displayName === '') {
                toastr['error']("Please enter a Display Name");
                return;
            } else if ($scope.password === '') {
                toastr["error"]("Please enter a Password");
                return;
            } else if ($scope.repeatPassword !== $scope.password) {
                toastr["error"]("Your passwords don't match.");
                return;
            }

            //TODO Reenable hashing
            //$scope.user.password = CryptoJS.SHA256($scope.password).toString(CryptoJS.enc.Hex);
            $scope.user.password = $scope.password;
            usSpinnerService.spin('spinner');
            $http.post("/Home/RegisterUser", $scope.user)
                .then(function (response) { //Success Callback
                    usSpinnerService.stop('spinner');
                    if (response.status === 204) {
                        toastr["error"]("Username already taken.");
                    } else {
                        toastr["success"]("User created.");
                        $location.path('/dashboard');
                    }
                }, function () { //Failure Callback
                    usSpinnerService.stop('spinner');
                    toastr["error"]("Error creating user.");
                });
            //toastr["info"]("Attempted to register user - enable REST endpoint");
        };

        $scope.cancel = function () {
            $location.path('/'); //Changes to the login URL
        };

        $scope.loaded = true;

        $("#username").focus(); //Username focus for quicker typing
    };

    //Check if a user is logged in, if they are, redirect to appropriate page
    if (!$scope.$parent.user || $scope.$parent.user === '') {
        $http.get("/Home/CheckSession")
            .then(function (response) {
                if (response.data === '') {
                    $scope.load();
                    return;
                }
                $scope.$parent.user = response.data;
                $scope.$parent.loaded = true;
                if ($scope.$parent.user.type === 'A' || $scope.$parent.user.type === 'I') $location.path('/courses');
                else $location.path('/dashboard');
            }, function () {
                $scope.load();
            });

        //Dummy
        //$scope.load();
    } else {
        if ($scope.$parent.user.type === 'A' || $scope.$parent.user.type === 'I') $location.path('/courses');
        else $location.path('/dashboard');
    }
});