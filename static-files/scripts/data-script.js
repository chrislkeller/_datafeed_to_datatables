var jqueryNoConflict = jQuery;
var defaultTableOptions = defaultTableOptions || {};
var dataTablesConfig = dataTablesConfig || {};

// begin main function
jqueryNoConflict(document).ready(function(){
    dataTablesConfig.initialize();
});
// end main function

// default configuration options
var defaultTableOptions = {

    // table type can be standard or drilldown
    tableType: 'drilldown',

    // use either tabletop or flatfile
    dataSource: 'tabletop',

    // add if dataSource is tabletop
    spreadsheetKey: '0An8W63YKWOsxdE1aSVBMV2RBaWphdWFqT3VQOU1xeHc',

    // add if dataSource is a flat json file
    jsonFile: 'static-files/data/nicar_sessions_sked.json',

    // minimum of 10 needed to alter the per page select menu
	displayLength: 15

};

// begin main datatables object
var dataTablesConfig = {

    initialize: function(){

        if (!defaultTableOptions.dataSource) {

            //jqueryNoConflict.error('please set the dataSource to either tabletop or flatfile');
            alert('Please set the dataSource to either tabletop or flatfile');

        } else if (defaultTableOptions.dataSource === 'tabletop'){
            dataTablesConfig.retrieveTabletopObject();

        } else if (defaultTableOptions.dataSource === 'flatfile'){
            dataTablesConfig.writeTableWith(defaultTableOptions.jsonFile);

        } else {
            //jqueryNoConflict.error('please set the dataSource to either tabletop or flatfile');
            alert('Please set the dataSource to either tabletop or flatfile');
        }
    },

    retrieveTabletopObject: function(){
        Tabletop.init({
            key: defaultTableOptions.spreadsheetKey,
            callback: dataTablesConfig.writeTableWith,
            simpleSheet: true,
            parseNumbers: true,
            debug: true
        });
    },

    oTableDefaultObject: {},

    // create the table container and object
    writeTableWith: function(dataSource){

        jqueryNoConflict('#demo').html('<table cellpadding="0" cellspacing="0" border="0" class="display table table-bordered table-striped" id="data-table-container"></table>');

        var oTable;

        // if defaultTableOptions set to tabletop
        if (defaultTableOptions.dataSource === 'tabletop'){
            oTable = jqueryNoConflict('#data-table-container').dataTable({
                'oLanguage': {
                    'sLengthMenu': '_MENU_ records per page'
                    },
                'bProcessing': true,
            	'sPaginationType': 'bootstrap',
            	'iDisplayLength': defaultTableOptions.displayLength,
                'aoColumns': dataTablesConfig.createTableColumns(),

                /* works with tabletop */
                'aaData': dataSource,

                /* works with flat json file */
                'sAjaxDataProp': null,
                'sAjaxSource': null
            });

        // if defaultTableOptions set to flatfile
        } else {
            oTable = jqueryNoConflict('#data-table-container').dataTable({
                'oLanguage': {
                    'sLengthMenu': '_MENU_ records per page'
                    },
                'bProcessing': true,
        		'sPaginationType': 'bootstrap',
        		'iDisplayLength': defaultTableOptions.displayLength,
                'aoColumns': dataTablesConfig.createTableColumns(),

                /* works with tabletop */
                'aaData': null,

                /* works with flat json file */
                'sAjaxDataProp': 'objects',
                'sAjaxSource': dataSource
            });

        }

    	dataTablesConfig.hideShowDiv(oTable);
        dataTablesConfig.formatNumberData();
    },

    // create table headers
    createTableColumns: function (){

        /* swap out the properties of mDataProp & sTitle to reflect
        the names of columns or keys you want to display */
        var tableColumns = [
            {'mDataProp': null, 'sClass': 'control center', 'sDefaultContent': '<i class="icon-plus icon-black"></i>'},
            {'mDataProp': "day", 'sTitle': 'Day'},
            {'mDataProp': "time", 'sTitle': 'Time'},
            {'mDataProp': "place", 'sTitle': 'Place'}
        ];
        return tableColumns;
    },

    // format details function
    fnFormatDetails: function (oTable, nTr){
        var oData = oTable.fnGetData(nTr);

        /* swap out the properties of oData to reflect
        the names of columns or keys you want to display */
        var sOut =
            '<div class="innerDetails">' +
                '<p>' + oData.day + '</p>' +
                '<p>' + oData.time + '</p>' +
                '<p>' + oData.place + '</p>' +
                '<p>' + oData.title + '</p>' +
                '<p>' + oData.speaker + '</p>' +
                '<p>' + oData.description + '</p>' +
            '</div>';

        return sOut;
    },

    // hide show drilldown details
    hideShowDiv: function (oTable){

        var anOpen = [];

        // animation to make opening and closing smoother
        jqueryNoConflict('#demo td.control').live('click', function () {
            var nTr = this.parentNode;
            var i = jqueryNoConflict.inArray(nTr, anOpen);

            if (i === -1) {
                jqueryNoConflict('i', this).attr('class', 'icon-minus icon-black');
                var nDetailsRow = oTable.fnOpen(nTr, dataTablesConfig.fnFormatDetails(oTable, nTr), 'details');
                jqueryNoConflict('div.innerDetails', nDetailsRow).slideDown();
                anOpen.push(nTr);
            } else {
                jqueryNoConflict('i', this).attr('class', 'icon-plus icon-black');
                jqueryNoConflict('div.innerDetails', jqueryNoConflict(nTr).next()[0]).slideUp( function (){
                    oTable.fnClose(nTr);
                    anOpen.splice(i, 1);
                });
            }
        });
    },

    formatNumberData: function (){

        //define two custom functions (asc and desc) for string sorting
        jqueryNoConflict.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
            return ((x < y) ? -1 : ((x > y) ?  0 : 0));
        };

        jqueryNoConflict.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
            return ((x < y) ?  1 : ((x > y) ? -1 : 0));
        };

        // More number formatting
        jqueryNoConflict.fn.dataTableExt.oSort['number-asc'] = function (x, y) {
            x = x.replace('N/A','-1').replace(/[^\d\-\.\/]/g, '');
            y = y.replace('N/A', '-1').replace(/[^\d\-\.\/]/g, '');
            if (x.indexOf('/') >= 0) x = eval(x);
            if (y.indexOf('/') >= 0) y = eval(y);
            return x / 1 - y / 1;
        };

        jqueryNoConflict.fn.dataTableExt.oSort['number-desc'] = function (x, y) {
            x = x.replace('N/A', '-1').replace(/[^\d\-\.\/]/g, '');
            y = y.replace('N/A', '-1').replace(/[^\d\-\.\/]/g, '');
            if (x.indexOf('/') >= 0) x = eval(x);
            if (y.indexOf('/') >= 0) y = eval(y);
            return y / 1 - x / 1;
        };
    }
}
// end main datatables object