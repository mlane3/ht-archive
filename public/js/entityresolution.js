(function() {
  "use strict";

  var app = angular
    .module("erApp", ["ui.bootstrap", "datatables"])
    .controller("erController", EntityResolutionController);

  function EntityResolutionController(DTOptionsBuilder, DTColumnBuilder,
      DTColumnDefBuilder) {
    var vm = this;

    vm.phones = [{number: ""}];
    vm.emails = [{address: ""}];

    vm.testMsg = "This is a test message.";
    vm.dtOptions = DTOptionsBuilder.newOptions()
      // FIXME: This is an AWFUL hack to get the renderer setup correctly.
      // Should potentially look at promises renderer.
      .withOption("ajax", {url: "/api/backpage/entities/resolve"})
      .withOption("stateSave", true)
      .withPaginationType("full_numbers");
    vm.dtColumns = [
      DTColumnBuilder.newColumn("id", "Entity ID"),
      DTColumnBuilder.newColumn("phone", "Phone #'s")
        .renderWith(function(data, type, full) {
          if (data == null || data == "") {
            return "None";
          } else {
            return data;
          }
        }),
      DTColumnBuilder.newColumn("email", "Emails")
        .renderWith(function(data, type, full) {
          if (data == null || data == "") {
            return "None";
          } else {
            return data;
          }
        }),
      DTColumnBuilder.newColumn("postcount", "# Posts")
        .renderWith(function(data, type, full) {
          if (data == null || data == "") {
            return 0;
          } else {
            return data;
          }
        }),
    ];
    vm.dtInstance = { };

    vm.resolveEntities = function() {
      var phoneQuery = vm.phones.
        filter(function(p) { return p.number; }).
        map(function(p) { return "phone=" + p.number; }).join("&");
      var emailQuery = vm.emails.
        filter(function(e) { return e.address; }).
        map(function(e) { return "email=" + e.address; }).join("&");
      var queryString = ([phoneQuery, emailQuery]).
        filter(function(e) { return e; }).
        join("&");

      var api = "/api/backpage/entities/resolve?" + queryString;

      console.log(api);
      vm.dtInstance.changeData({url: api, dataSrc: "entities"});
    };

    vm.addPhone = function() {
      vm.phones.push({number: ""});
    }
    vm.removePhone = function() {
      vm.phones.pop();
    }
    vm.addEmail = function() {
      vm.emails.push({addres: ""});
    }
    vm.removeEmail = function() {
      vm.emails.pop();
    }

  }
})();
