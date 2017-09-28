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
    cc.setName("DebtGroups");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.ALPHANUMERIC);
    newColumnIndex = columns.size();
    columns.add(cc);

    // and add a new one
    var cc = new Column();
    cc.setName("Approved");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.INTEGER);
    newColumnIndex = columns.size();
    columns.add(cc);
	
    // and add a new one
    var cc = new Column();
    cc.setName("Rejected");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.INTEGER);
    newColumnIndex = columns.size();
    columns.add(cc);

    // and add a new one
    var cc = new Column();
    cc.setName("Approval Likelihood given the group (prior = 0.5)");
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
    colCount = pquery.getColumnCount();
    if (col == colCount) {
        return getManufacturedCell(row, col);
    } else {
		if(col == 0){
			if(row == 0) return '[0-2]';
			if(row == 1) return '[2-4]';
			if(row == 2) return '[4-6]';
			if(row == 3) return '[6-8]';
			if(row == 4) return '[8-10]';
			if(row == 5) return 'total';
		}
		// SQL: Select ages from TABLE where APPROVAL='Y' && age>0 && age<20
		if(col == 1){
			if(row == 0) return getDebt(0,  2,   'y');
			if(row == 1) return getDebt(2,  4,   'y');
			if(row == 2) return getDebt(4,  6,   'y');
			if(row == 3) return getDebt(6,  8,   'y');
			if(row == 4) return getDebt(8,  20,  'y');
			if(row == 5) return getDebt(0,  20,  'y');
		}
		if(col == 2){
			if(row == 0) return getDebt(0,  2,   'n');
			if(row == 1) return getDebt(2,  4,   'n');
			if(row == 2) return getDebt(4,  6,   'n');
			if(row == 3) return getDebt(6,  8,   'n');
			if(row == 4) return getDebt(8,  20,  'n');
			if(row == 5) return getDebt(0,  20,  'n');
		}
		if(col == 3){
			prior =  0.5;
			priorInv = getDebt(0,  20,  'n') / (getDebt(0,  20,  'n') + getDebt(0,  20,  'y'));
			if(row == 0) {
			    priorConditional = getDebt(0,  2,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(0,  2,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 1) {
			    priorConditional = getDebt(2,  4,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(2,  4,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 2) {
			    priorConditional = getDebt(4,  6,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(4,  6,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 3) {
			    priorConditional = getDebt(6,  8,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(6,  8,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 4) {
			    priorConditional = getDebt(8,  20,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(8,  20,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 5) return '-';
			return likelihood.toFixed(2);
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

function getDebt(min, max, d){
    var pquery = pobjects.get(0);
	var rowCount = pquery.getRowCount();
    var colCount = pquery.getColumnCount();
	var debtIndex = 3;
	var approvalIndex = 0;
	var sum = 0;
	for (var i = 0; i < rowCount; i++) {
		var approval = pquery.getCell(i, approvalIndex);
		var debt = pquery.getCell(i, debtIndex);
		if(approval == d && debt>=min && debt<max){
			sum++;
		}
	}
	return sum;
	
}