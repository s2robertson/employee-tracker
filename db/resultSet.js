class ResultSet {
    constructor(rows, fields) {
        this.rows = rows;
        this.fields = fields.map(colDef => ({
            name: colDef.name,
            maxLength: colDef.name?.length || 0
        }));
        // calculate maxLength for each field
        this.fields.forEach(field => {
            this.rows.forEach(row => {
                const length = row[field.name]?.toString().length;
                if (length > field.maxLength) {
                    field.maxLength = length;
                }
            })
        });
    }

    toString() {
        let result = '';
        // column headers first
        for (const field of this.fields) {
            result += field.name.padEnd(field.maxLength + 2);
        }
        result += '\n';
        // '---' dividers
        for (const field of this.fields) {
            result += '-'.repeat(field.maxLength) + '  ';
        }
        result += '\n';
        // rows
        for (const row of this.rows) {
            for (const field of this.fields) {
                const fieldStr = row[field.name] === null ? 'null' : row[field.name].toString();
                result += fieldStr.padEnd(field.maxLength + 2);
            }
            result += '\n';
        }
        return result;
    }
}

class DepartmentResultSet extends ResultSet {
    getNameIdMapping() {
        return this.rows.map(row => ({
            name: row.name,
            value: row.id
        }));
    }
}

class RoleResultSet extends ResultSet {
    getNameIdMapping() {
        return this.rows.map(row => ({
            name: row.title,
            value: row.id
        }))
    }
}

class EmployeeResultSet extends ResultSet {
    getNameIdMapping() {
        return this.rows.map(row => ({
            name: row.first_name + ' ' + row.last_name,
            value: row.id
        }));
    }
}

module.exports = { DepartmentResultSet, RoleResultSet, EmployeeResultSet };