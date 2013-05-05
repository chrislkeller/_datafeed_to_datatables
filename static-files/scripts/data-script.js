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

    // use either tabletop or flatfile. Default is tabletop
    dataSource: 'flatfile',

    // add if dataSource is tabletop
    spreadsheetKey: '0An8W63YKWOsxdE1aSVBMV2RBaWphdWFqT3VQOU1xeHc',

    // add if dataSource is a flat json file
    jsonFile: 'static-files/data/nicar_sessions_sked.json',

    // div to write table to
    tableElementContainer: '#demo',

    // table type can be drilldown or standard. Blank === standard
    tableType: 'drilldown',

    // column headers from the spreadsheet you want to appear
    columnHeaders: ['Day', 'Time', 'Place'],

    // if table type above is set to drilldown, these are the columns to display
    drilldownInfo: ['Day', 'Time', 'Place', 'Title', 'Speaker', 'Description', 'Test'],

    // table sorting method
    // first value is the column to sort on
    // second is 'asc' or 'desc'
    tableSorting: [[ 3, "asc" ]],

    // minimum of 10 needed to alter the per page select menu
	displayLength: 15
};

// begin main datatables object
var dataTablesConfig = {

    initialize: function(){

        if (!defaultTableOptions.dataSource){
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

    // function to push splice object to table column array if drilldown selected
    // pulls column headers from config array and pushs to table column array
    createArrayOfTableColumns: function(){
        var headers = defaultTableOptions.columnHeaders;

        if (defaultTableOptions.tableType === 'drilldown'){
            var oTableColumnsTest = {'mDataProp': null, 'sClass': 'control center', 'sDefaultContent': '<i class="icon-plus icon-black"></i>'};
            dataTablesConfig.oTableColumns.splice(0, 0, oTableColumnsTest);
        }

        for (var i=0;i<headers.length;i++){
            var oTableColumnBuild = {
                'mDataProp': headers[i].toLowerCase(),
                'sTitle': headers[i]
            };
            dataTablesConfig.oTableColumns.push(oTableColumnBuild);
        }

    },

    // create table headers with array of table header objects
    oTableColumns: [],

    oTableDefaultObjectTest: {
        'oLanguage': {
            'sLengthMenu': '_MENU_ records per page'
            },
        'bProcessing': true,
        'sPaginationType': 'bootstrap',
        'iDisplayLength': defaultTableOptions.displayLength,

        // sets table sorting
        'aaSorting': defaultTableOptions.tableSorting,

        // sets column headers
        'aoColumns': null,

        /* data source needed for tabletop */
        'aaData': null,

        /* data source needed for flat json file */
        'sAjaxDataProp': null,
        'sAjaxSource': null
    },

    // create the table container and object
    writeTableWith: function(dataSource){

        // working toward pulling column headers via config or auto
        dataTablesConfig.createArrayOfTableColumns();

        jqueryNoConflict(defaultTableOptions.tableElementContainer).html('<table cellpadding="0" cellspacing="0" border="0" class="display table table-bordered table-striped" id="data-table-container"></table>');

        // write values to oTableDefaultObjectTest if tabletop
        if (defaultTableOptions.dataSource === 'tabletop'){
            console.log('config = tabletop');
            dataTablesConfig.oTableDefaultObjectTest['aaData'] = dataSource;
            dataTablesConfig.oTableDefaultObjectTest['aoColumns'] = dataTablesConfig.oTableColumns;

        // else write values if flatfile
        } else {
            console.log('config = flatfile');
            dataTablesConfig.oTableDefaultObjectTest['aoColumns'] = dataTablesConfig.oTableColumns;
            dataTablesConfig.oTableDefaultObjectTest['sAjaxDataProp'] = 'objects';
            dataTablesConfig.oTableDefaultObjectTest['sAjaxSource'] = dataSource;
        }

        var oTable = jqueryNoConflict('#data-table-container').dataTable(dataTablesConfig.oTableDefaultObjectTest);

    	dataTablesConfig.hideShowDiv(oTable);
        dataTablesConfig.formatNumberData();
    },

    // format details function
    fnFormatDetails: function (oTable, nTr){

        // retrieve data object
        var oData = oTable.fnGetData(nTr);

        // retrieve config headers and lowercase items
        var configHeaders = lowerCaseArrayItems(defaultTableOptions.drilldownInfo);

        // holding container
        var justAnArray = [];

        // loop through config headers
        for (var i=0;i<configHeaders.length;i++){

            // compare the data object keys with the config headers
            if (oData.hasOwnProperty(configHeaders[i])){

                // if an item appears in config headers, push the matching object value to array
                justAnArray.push('value');

            // else it should not be displayed
            } else {
                console.log('no');
            }
        }
        // end for loop

        console.log(justAnArray);


        /* swap out the properties of oData to reflect
        the names of columns or keys you want to display */
        var sOut =
            '<div class="innerDetails">' +
                '<p>' + justAnArray[0] + '</p>' +
                '<p>' + justAnArray[1] + '</p>' +
                '<p>' + justAnArray[2] + '</p>' +
                '<p>' + justAnArray[3] + '</p>' +
                '<p>' + justAnArray[4] + '</p>' +
                '<p>' + justAnArray[5] + '</p>' +

/*
                '<p>' + oData.day + '</p>' +
                '<p>' + oData.time + '</p>' +
                '<p>' + oData.place + '</p>' +
                '<p>' + oData.title + '</p>' +
                '<p>' + oData.speaker + '</p>' +
                '<p>' + oData.description + '</p>' +
*/

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


function lowerCaseArrayItems(array){
    var arrayHoldingContainer = [];
    for (var i=0;i<array.length;i++){
        arrayHoldingContainer.push(array[i].toLowerCase());
    }
    return arrayHoldingContainer;
}