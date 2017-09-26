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
    cc.setName("AgeGroups");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.ALPHANUMERIC);
    newColumnIndex = columns.size();
    columns.add(cc);

    // and add a new one
    var cc = new Column();
    cc.setName("Approved_age");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.INTEGER);
    newColumnIndex = columns.size();
    columns.add(cc);
	
    // and add a new one
    var cc = new Column();
    cc.setName("Rejected_age");
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
    cc.setName("Approved_debt");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.INTEGER);
    newColumnIndex = columns.size();
    columns.add(cc);
	
    // and add a new one
    var cc = new Column();
    cc.setName("Rejected_debt");
    cc.setAlias(null);
    cc.setExternalName(cc.getName());
    cc.setDatatype(Datatype.INTEGER);
    newColumnIndex = columns.size();
    columns.add(cc);

    // and add a new one
    var cc = new Column();
    cc.setName("Approval Likelihood given the group (prior = after assimilating age)");
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
		if(col == 3){
			prior =  0.5;
			priorInv = getAge(0,  100,  'n') / (getAge(0,  100,  'n') + getAge(0,  100,  'y'));
			if(row == 0) return assimilatingAge(0, 20, 0.5);
			if(row == 1) return assimilatingAge(21, 40, 0.5);
			if(row == 2) return assimilatingAge(41, 60, 0.5);
			if(row == 3) return assimilatingAge(61, 80, 0.5);
			if(row == 4) return assimilatingAge(81, 100, 0.5);
			if(row == 5) return '-';
			return likelihood.toFixed(2);
		}
		if(col == 4){
			if(row == 0) return '[4-6]';
			if(row == 1) return '[0-2]';
			if(row == 2) return '[8-10]';
			if(row == 3) return '[2-4]';
			if(row == 4) return '[6-8]';
			if(row == 5) return 'total';
		}
		// SQL: Select ages from TABLE where APPROVAL='Y' && age>0 && age<20
		if(col == 5){
			if(row == 0) return getDebt(4,  6,   'y');
			if(row == 1) return getDebt(0,  2,   'y');
			if(row == 2) return getDebt(8,  10,   'y');
			if(row == 3) return getDebt(2,  4,   'y');
			if(row == 4) return getDebt(6,  8,  'y');
			if(row == 5) return getDebt(0,  20,  'y');
		}
		if(col == 6){
			if(row == 0) return getDebt(4,  6,   'n');
			if(row == 1) return getDebt(0,  2,   'n');
			if(row == 2) return getDebt(8,  10,   'n');
			if(row == 3) return getDebt(2,  4,   'n');
			if(row == 4) return getDebt(6,  8,  'n');
			if(row == 5) return getDebt(0,  20,  'n');
		}
		if(col == 7){
			priorInv = getDebt(0,  20,  'n') / (getDebt(0,  20,  'n') + getDebt(0,  20,  'y'));
			if(row == 0) {
			    prior =  assimilatingAge(0, 20, 0.5);
			    priorConditional = getDebt(4,  6,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(4,  6,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 1) {
			    prior =  assimilatingAge(21, 40, 0.5);
			    priorConditional = getDebt(0,  2,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(0,  2,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 2) {
			    prior =  assimilatingAge(41, 60, 0.5);
			    priorConditional = getDebt(8,  10,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(8,  10,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 3) {
			    prior =  assimilatingAge(61, 80, 0.5);
			    priorConditional = getDebt(2,  4,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(2,  4,   'n')/getDebt(0,  20,   'n');
				likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			}
			if(row == 4) {
			    prior =  assimilatingAge(81, 100, 0.5);
			    priorConditional = getDebt(6,  8,   'y')/getDebt(0,  20,   'y');
			    priorConditionalInv = getDebt(6,  8,   'n')/getDebt(0,  20,   'n');
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
	var debtIndex = 1;
	var approvalIndex = colCount-1;
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

function assimilatingAge(min, max, prior){
			priorInv = getAge(0,  100,  'n') / (getAge(0,  100,  'n') + getAge(0,  100,  'y'));
			priorConditional = getAge(min,  max,   'y')/getAge(0,  100,   'y');
			priorConditionalInv = getAge(min,  max,   'n')/getAge(0,  100,   'n');
			likelihood = (prior*priorConditional)/(prior*priorConditional + priorInv*priorConditionalInv);
			return likelihood.toFixed(2);
	
}