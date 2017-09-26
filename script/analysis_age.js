importClass(java.util.ArrayList)

importClass(com.experian.queryengine.column.Column)

importClass(com.experian.datatype.Datatype)

var query = pobjects.get(0);

// Return the row count

function getRowCount() {
    //pquery = pobjects.get(0);
    //rowCount = pquery.getRowCount();
    return 6;

}

// Return the column count
function getColumnCount() {
    pquery = pobjects.get(0);
    colCount = pquery.getColumnCount();
    return colCount + 1; // we added a new column

}

// Return the columns from the input, and an additional column
function getColumns() {

    // get the table's columns
    var columns = new ArrayList();
    //for each (var def in pquery.getColumns()) {
    //    var col = pquery.getColumn(def.getIndex());
    //    columns.add(col);
    //}

    // and add a new one
    var cc = new Column();
    cc.setName("age groups");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.ALPHANUMERIC);
    newColumnIndex = columns.size();
    columns.add(cc);

    // and add a new one
    var cc = new Column();
    cc.setName("number of approved");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.INTEGER);
    newColumnIndex = columns.size();
    columns.add(cc);
	
    // and add a new one
    var cc = new Column();
    cc.setName("number of rejected");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.INTEGER);
    newColumnIndex = columns.size();
    columns.add(cc);
    
    // and add a new one
    var cc = new Column();
    cc.setName("approval likelihood");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.DECIMAL);
    newColumnIndex = columns.size();
    columns.add(cc);
    return columns;

}

// Get the cell value
function getCell(row, col) {
    // rows and columns start at 0
    pquery = pobjects.get(0);
	rowCount = pquery.getRowCount();
    colCount = pquery.getColumnCount();
    if (col == colCount) {
        return getManufacturedCell(row, col);
    } else {
		if(col == 0){
			if(row == 0) return 'less than 20';
			if(row == 1) return '21-40';
			if(row == 2) return '41-60';
			if(row == 3) return '61-80';
			if(row == 4) return '81 above';
			if(row == 5) return 'total';
		}
		// SQL: Select ages from TABLE where APPROVAL='Y' && age>0 && age<20
		if(col == 1){
			if(row == 0) return getAge(0,  20,  'y');
			if(row == 1) return getAge(21, 40,  'y');
			if(row == 2) return getAge(41, 60,  'y');
			if(row == 3) return getAge(61, 80,  'y');
			if(row == 4) return getAge(81, 100, 'y');
			if(row == 5) return getAge(0,  100, 'y');
		}
		if(col == 2){
			if(row == 0) return getAge(0,  20,  'n');
			if(row == 1) return getAge(21, 40,  'n');
			if(row == 2) return getAge(41, 60,  'n');
			if(row == 3) return getAge(61, 80,  'n');
			if(row == 4) return getAge(81, 100, 'n');
			if(row == 5) return getAge(0,  100, 'n');
		}
        return getViewCell(row, col);
    }
    return cellValue;

}

// Look in the input view for the value
function getViewCell(row, col) {
    var cellValue;
    try {
        var cell = query.getCell(row, col);
        cellValue = (cell===undefined) ? '' : cell.getValue();
        if (cellValue===undefined) {
            cellValue = '';
        }
     } catch (err) {
        cellValue = '';
     }
     return cellValue;

}

// Create the value
function getManufacturedCell(row, col) {
    var cellValue = 'new cell at (' + row + ',' + col + ')';
    return cellValue;

}

function getAge(min, max, apr){
    var pquery = pobjects.get(0);
	var rowCount = pquery.getRowCount();
    var colCount = pquery.getColumnCount();
	var ageIndex = 0;
	var approvalIndex = colCount-1;
	var sum = 0;
	for (var i = 0; i < rowCount; i++) {
		var approval = pquery.getCell(i, approvalIndex);
		var age = pquery.getCell(i, ageIndex);
		if(approval == apr && age>=min && age<max){
			sum++;
		}
	}
	return sum;
	
}