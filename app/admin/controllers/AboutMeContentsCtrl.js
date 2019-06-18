'use strict';

angular.module('app.admin').controller('AboutMeContentsController', function ($scope, $timeout, AboutmeService, $filter, ServerURL) {
    $scope.tableData = $scope.safeData = [];
    $scope.currRow = {};
    $scope.loading = true;
    $scope.ckeditor = null;

    $scope.getData = function () {
        $scope.loading = true;

        AboutmeService.get().then(function (response) {
            $scope.tableData = $scope.safeData = response.data;
            $scope.loading = false;
            setTimeout(function () {
                if(!$scope.ckeditor){
                    $scope.ckeditor = CKEDITOR.replace( 'ckeditor', { 
                                                    height: '380px',
                                                    startupFocus : true,
                                                    filebrowserUploadUrl: ServerURL+'upload.php'
                                            } );
                }
            },100)
        });
    };
    $scope.getData();

    $scope.save = function () {
        $scope.loading = true;
        var data = $scope.currRow;
        data.content = $scope.ckeditor.getData();

        AboutmeService.save(data).then(function (res) {
            $('#myModal').modal('hide');
            $scope.getData();
        });
    };

    $scope.addRow = function () {
        $scope.currRow = {
            id: 0,
            title: '',
            content: '',
            order: ($scope.tableData.length+1)
        };
        $scope.ckeditor.setData("");
    };

    $scope.editRow = function (row) {
        $scope.currRow = JSON.parse(angular.toJson(row));
        $scope.currRow.order = $scope.currRow.order*1;
        $scope.ckeditor.setData(row.content);
        $('#myModal').modal('show');
    };

    $scope.deleteRow = function (rowId, rowInd) {
        if (confirm('Are you sure want to delete this?')) {
            $scope.loading = true;
            AboutmeService.delete(rowId).then(function () {
                //$scope.getData();
                $scope.tableData.splice(rowInd, 1);
                $scope.loading = false;
            });
        }
    };
});


$.fn.modal.Constructor.prototype.enforceFocus = function() {
  var modal_this = this
  $(document).on('focusin.modal', function (e) {
    if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length 
    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') 
    && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
      modal_this.$element.focus()
    }
  })
};