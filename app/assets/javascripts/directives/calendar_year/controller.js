/*jslint vars: true, browser: true , nomen: true, indent: 2*/
/*global angular */

angular.module("directives.calendarYear").controller("calendarYearController", ["$scope", "$timeout", "requestData", "moment", function ($scope, $timeout, requestData, moment) {
  "use strict";
  var captureTime = 800;
  var capturedDays = [];
  var captureTimer;

  $scope.year = moment().year();

  // Create an array of months. We will render a <calendar-month> for each of
  // these.
  $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (num) {
    var date = moment([$scope.year, num - 1]);
    return {
      date: date,
      month: date.month() + 1,
      requests: []
    };
  });

  // Take a list of requests and assign them to their corresponding month.
  function assignRequests(requests) {
    $scope.months.forEach(function (month) {
      month.requests = requests.filter(function (request) {
        return month.date.isSame(request.date, "month");
      });
    });
  }

  $scope.$watch("group", function (group) {
    if (!group) {
      return;
    }
    var groupRequests = requestData.forGroup(group.id);
    assignRequests(groupRequests);
  });

  $scope.$watch("employee", function (employee) {
    if (!employee) {
      return;
    }
    var employeeRequests = requestData.forEmployee(employee.id);
    assignRequests(employeeRequests);
  });

  // Process our list of captured days and clean up.
  function endCapture() {
    parent.console.log(capturedDays);
    capturedDays = [];
  }

  // Add a date to our list of captured days and return a new timer. If a timer
  // already exists, cancel it.
  function capture(array, date, delay, timer) {
    if (timer) {
      $timeout.cancel(timer);
    }
    array.push(date);
    return $timeout(function () {
      return endCapture();
    }, delay);
  }

  // As days are clicked on, make a list of days that we need to process. Once
  // a specified time has elapsed without any being clicked, process the list.
  $scope.$on("calendar-day-clicked", function (event, day) {
    event.stopPropagation();
    captureTimer = capture(capturedDays, day.date, captureTime, captureTimer);
  });
}]);
